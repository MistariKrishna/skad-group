import { NextResponse, type NextRequest } from "next/server";
import { ENQUIRY_TYPES, PARTNER_ROUTES } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------- Rules (keep in sync with Contact.tsx) ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;
const URL_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;
const MAX_FILE = 4 * 1024 * 1024; // 4 MB (fits hosting request limits)
const SIGNATURES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46], //  %PDF
  doc: [0xd0, 0xcf, 0x11, 0xe0], //  legacy Word
  docx: [0x50, 0x4b, 0x03, 0x04], // zip container
};

/* ---------- Simple per-IP rate limit (5 per 10 minutes) ---------- */
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const text = (fd: FormData, key: string, max: number) => String(fd.get(key) ?? "").trim().slice(0, max);
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** ENQUIRY_TO_<TYPE> in .env (e.g. ENQUIRY_TO_CAREERS), falling back to ENQUIRY_TO_DEFAULT. */
function recipients(type: string) {
  const key = `ENQUIRY_TO_${type.toUpperCase().replace(/[^A-Z]+/g, "_").replace(/^_+|_+$/g, "")}`;
  return (process.env[key] || process.env.ENQUIRY_TO_DEFAULT || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Email provider error ${res.status}: ${await res.text()}`);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ message: "Too many enquiries. Please try again in a few minutes." }, { status: 429 });
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ message: "The form could not be read. Please try again." }, { status: 400 });
  }

  // Spam traps: hidden field filled, or submitted too fast. Pretend success so bots learn nothing.
  const started = Number(fd.get("t") || 0);
  if (text(fd, "fax", 200) || (started > 0 && Date.now() - started < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    type: text(fd, "type", 60),
    name: text(fd, "name", 120),
    company: text(fd, "company", 160),
    role: text(fd, "role", 120),
    email: text(fd, "email", 200),
    phone: text(fd, "phone", 30),
    website: text(fd, "website", 200),
    country: text(fd, "country", 80),
    message: text(fd, "message", 1500),
    consent: fd.get("consent") === "true",
  };

  /* ---------- Server-side validation ---------- */
  const errors: Record<string, string> = {};
  if (!ENQUIRY_TYPES.includes(data.type)) errors.type = "Select an enquiry type.";
  if (!data.name) errors.name = "Enter your name.";
  if (PARTNER_ROUTES.includes(data.type) && !data.company) errors.company = "Enter your company name for this enquiry type.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Enter an email address in the format name@example.com.";
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = "Enter a phone number with country code, for example +91 98765 43210.";
  if (data.website && !URL_RE.test(data.website)) errors.website = "Enter a website address, for example example.com.";
  if (!data.country) errors.country = "Enter your country.";
  if (data.message.length < 10) errors.message = "Write a message of at least 10 characters.";
  if (!data.consent) errors.consent = "Confirm you have read the Privacy Policy.";

  /* ---------- Attachment checks: extension, size and real file signature ---------- */
  let attachment: { filename: string; content: string } | undefined;
  const raw = fd.get("attachment");
  if (raw && typeof raw === "object" && "arrayBuffer" in raw && (raw as Blob).size > 0) {
    const blob = raw as Blob & { name?: string };
    const name = blob.name || "attachment";
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const sig = SIGNATURES[ext];
    if (!sig) {
      errors.file = "Upload a PDF, DOC or DOCX file.";
    } else if (blob.size > MAX_FILE) {
      errors.file = "The file must be 4 MB or smaller.";
    } else {
      const buf = Buffer.from(await blob.arrayBuffer());
      if (!sig.every((b, i) => buf[i] === b)) {
        errors.file = "This file doesn’t look like a valid PDF or Word document.";
      } else {
        attachment = { filename: name.replace(/[^\w.\- ]+/g, "_").slice(0, 120), content: buf.toString("base64") };
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  /* ---------- Delivery ---------- */
  const to = recipients(data.type);
  const from = process.env.ENQUIRY_FROM;
  if (!process.env.RESEND_API_KEY || !from || to.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[enquiry] Email not configured — enquiry received (dev only):", { ...data, attachment: attachment?.filename });
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[enquiry] Email delivery is not configured. Set RESEND_API_KEY, ENQUIRY_FROM and ENQUIRY_TO_DEFAULT.");
    return NextResponse.json({ message: "Enquiries are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Enquiry type", data.type],
    ["Name", data.name],
    ["Company", data.company],
    ["Role", data.role],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Website", data.website],
    ["Country", data.country],
    ["Attachment", attachment?.filename ?? ""],
  ];
  const filled = rows.filter(([, v]) => v);

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0A1F44;max-width:640px">
      <h2 style="margin:0 0 16px">New ${esc(data.type)} enquiry</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
        ${filled.map(([k, v]) => `<tr><td style="background:#F5F6F8;width:160px"><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join("")}
      </table>
      <h3 style="margin:24px 0 8px">Message</h3>
      <p style="font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(data.message)}</p>
    </div>`;
  const plain = `${filled.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${data.message}`;

  try {
    await sendEmail({
      from,
      to,
      reply_to: data.email,
      subject: `[${data.type}] Enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
      html,
      text: plain,
      ...(attachment ? { attachments: [attachment] } : {}),
    });
  } catch (err) {
    console.error("[enquiry] Delivery failed:", err);
    return NextResponse.json({ message: "We couldn’t send your enquiry right now. Please try again shortly." }, { status: 502 });
  }

  // Confirmation to the sender (failure here does not fail the enquiry)
  if (process.env.ENQUIRY_CONFIRMATION !== "off") {
    try {
      await sendEmail({
        from,
        to: [data.email],
        subject: "We have received your enquiry | SKAD GROUP",
        html: `
          <div style="font-family:Arial,sans-serif;color:#0A1F44;max-width:560px;font-size:15px;line-height:1.6">
            <p>Dear ${esc(data.name)},</p>
            <p>Thank you for contacting SKAD GROUP. Your <strong>${esc(data.type)}</strong> enquiry has been received and routed to the right team. A member of the team will reply to this email address.</p>
            <p>SKAD GROUP</p>
          </div>`,
        text: `Dear ${data.name},\n\nThank you for contacting SKAD GROUP. Your ${data.type} enquiry has been received and routed to the right team. A member of the team will reply to this email address.\n\nSKAD GROUP`,
      });
    } catch (err) {
      console.error("[enquiry] Confirmation email failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}