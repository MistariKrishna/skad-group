"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useContact } from "@/components/providers/ContactProvider";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillSubmit } from "@/components/ui/Pill";
import { BOUNCE } from "@/lib/motion";
import { COMPANIES, CONTACT_DETAILS, COUNTRIES, ENQUIRY_TYPES, PARTNER_ROUTES } from "@/lib/data";

type FormState = {
  name: string; company: string; role: string; email: string; phone: string;
  website: string; country: string; message: string; consent: boolean;
};
type FieldKey = keyof FormState | "type" | "file";
type Errors = Partial<Record<FieldKey, string>>;

const EMPTY: FormState = { name: "", company: "", role: "", email: "", phone: "", website: "", country: "", message: "", consent: false };
const ORDER: FieldKey[] = ["type", "name", "company", "role", "email", "phone", "website", "country", "message", "file", "consent"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;
const URL_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

const FILE_ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const FILE_RE = /\.(pdf|docx?)$/i;
const FILE_MAX = 4 * 1024 * 1024; // 4 MB

const checkFile = (f: File): string | undefined => {
  if (!FILE_RE.test(f.name)) return "Upload a PDF, DOC or DOCX file.";
  if (f.size > FILE_MAX) return "The file must be 4 MB or smaller.";
  return undefined;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/** 16px text on phones prevents iOS from zooming into fields. */
const control = (err?: string) =>
  clsx(
    "w-full rounded-xl border bg-mist px-4 text-[16px] text-navy transition-all duration-200 placeholder:text-muted/60 hover:bg-[#EEF0F3] focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10 sm:text-[15.5px]",
    err ? "border-[#B42318] bg-white" : "border-transparent",
  );

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[13px] leading-snug text-[#B42318]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailIcon({ kind }: { kind: "pin" | "mail" | "phone" | "clock" }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold sm:h-11 sm:w-11">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {kind === "pin" && <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>}
        {kind === "mail" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>}
        {kind === "phone" && <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />}
        {kind === "clock" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
      </svg>
    </span>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5l-8.6 8.6a5 5 0 01-7-7l8.6-8.6a3.3 3.3 0 014.7 4.7l-8.6 8.6a1.7 1.7 0 01-2.4-2.4l8-8" />
    </svg>
  );
}

export default function Contact() {
  const { enquiry, setEnquiry, prefill } = useContact();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);

  const companyRequired = PARTNER_ROUTES.includes(enquiry);
  const isCareers = enquiry === "Careers";
  const { address, email, phone, hours } = CONTACT_DETAILS;

  const details: { kind: "pin" | "mail" | "phone" | "clock"; label: string; content: ReactNode }[] = [];
  if (address.length > 0) details.push({ kind: "pin", label: "Address", content: address.map((l) => <span key={l} className="block">{l}</span>) });
  if (email) details.push({ kind: "mail", label: "Email", content: <a href={`mailto:${email}`} className="break-all hover:underline">{email}</a> });
  if (phone) details.push({ kind: "phone", label: "Phone", content: <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">{phone}</a> });
  if (hours) details.push({ kind: "clock", label: "Hours", content: hours });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (enquiry) setSent(false);
    setErrors((e) => ({ ...e, type: undefined }));
  }, [enquiry]);

  useEffect(() => {
    if (!prefill) return;
    setSent(false);
    setForm((f) => ({ ...f, message: prefill.message }));
    setErrors((e) => ({ ...e, message: undefined }));
  }, [prefill]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const clearFile = () => {
    setFile(null);
    setErrors((e) => ({ ...e, file: undefined }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setErrors((x) => ({ ...x, file: undefined }));
    if (!f) {
      setFile(null);
      return;
    }
    const err = checkFile(f);
    if (err) {
      setFile(null);
      e.target.value = "";
      setErrors((x) => ({ ...x, file: err }));
      return;
    }
    setFile(f);
  };

  const validate = (): Errors => {
    const E: Errors = {};
    if (!enquiry) E.type = "Select an enquiry type.";
    if (!form.name.trim()) E.name = "Enter your name.";
    if (companyRequired && !form.company.trim()) E.company = "Enter your company name for this enquiry type.";
    if (!EMAIL_RE.test(form.email.trim())) E.email = "Enter an email address in the format name@example.com.";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) E.phone = "Enter a phone number with country code, for example +91 98765 43210.";
    if (form.website.trim() && !URL_RE.test(form.website.trim())) E.website = "Enter a website address, for example example.com.";
    if (!form.country.trim()) E.country = "Enter your country.";
    if (form.message.trim().length < 10) E.message = "Write a message of at least 10 characters.";
    if (file) {
      const fe = checkFile(file);
      if (fe) E.file = fe;
    }
    if (!form.consent) E.consent = "Confirm you have read the Privacy Policy.";
    return E;
  };

  const focusFirst = (E: Errors) => {
    const first = ORDER.find((k) => E[k]);
    if (first) window.setTimeout(() => document.getElementById(`f-${first}`)?.focus(), 0);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const E = validate();
    if (Object.keys(E).length > 0) {
      setErrors(E);
      focusFirst(E);
      return;
    }

    setSending(true);
    try {
      const body = new FormData();
      body.append("type", enquiry);
      (Object.keys(form) as (keyof FormState)[]).forEach((k) => body.append(k, String(form[k]).trim()));
      if (file) body.append("attachment", file);
      body.append("fax", trapRef.current?.value ?? "");
      body.append("t", String(startedAt.current));

      const res = await fetch("/api/enquiries", { method: "POST", body });
      const data: { message?: string; errors?: Errors } = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirst(data.errors);
        }
        setServerError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setServerError("We couldn’t reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setServerError("");
    setSent(false);
    setEnquiry("");
    clearFile();
    startedAt.current = Date.now();
  };

  const describedBy = (k: FieldKey) => (errors[k] ? `f-${k}-err` : undefined);

  return (
    <section id="contact" aria-labelledby="ct-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[24px] bg-mist py-14 sm:rounded-[28px] sm:py-20 md:py-28">
        {/*
          Phones: heading → form → contact details.
          Desktop: heading + details on the left, form on the right.
        */}
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-x-14 lg:gap-y-10">
          {/* Heading */}
          <Reveal className="lg:col-span-5 lg:row-start-1">
            <SectionHeading
              id="ct-h"
              eyebrow="Contact"
              title="Let’s build something meaningful"
              intro="Choose an enquiry type and your message will be routed to the right team across the group."
            />
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <div className="rounded-[20px] border border-rule bg-white p-5 shadow-[0_30px_70px_-40px_rgba(10,31,68,.45)] sm:rounded-[24px] sm:p-8 md:p-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    role="status"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[380px] flex-col justify-center sm:min-h-[460px]"
                  >
                    <motion.span
                      aria-hidden="true"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F4EC] text-2xl text-[#1E7A46]"
                    >
                      ✓
                    </motion.span>
                    <h3 className="mt-6 font-serif text-[26px] font-medium leading-tight text-navy sm:text-[30px]">
                      Thank you. Your enquiry has been received.
                    </h3>
                    <p className="mt-3 break-words text-[16px] leading-relaxed">
                      Your <strong className="font-semibold text-navy">{enquiry}</strong> enquiry has been routed to the right team. A member of the team will reply to {form.email}.
                    </p>
                    <motion.button
                      type="button"
                      onClick={reset}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={BOUNCE}
                      className="mt-8 w-full rounded-full border border-navy/15 bg-white px-6 py-3.5 text-[15px] font-medium text-navy transition-colors hover:border-navy/40 sm:w-auto sm:self-start"
                    >
                      Send another enquiry
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex flex-col gap-5"
                  >
                    {/* Spam trap: hidden from people, filled by bots */}
                    <div aria-hidden="true" className="absolute left-0 top-0 h-px w-px overflow-hidden opacity-0">
                      <label htmlFor="f-fax">Fax</label>
                      <input ref={trapRef} id="f-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <AnimatePresence>
                      {serverError && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="rounded-xl border border-[#F4C7C3] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]"
                        >
                          {serverError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <Field id="f-type" label="Enquiry type" error={errors.type}>
                      <div className="relative">
                        <select
                          id="f-type"
                          value={enquiry}
                          onChange={(e) => setEnquiry(e.target.value)}
                          aria-invalid={!!errors.type}
                          aria-describedby={describedBy("type")}
                          className={clsx(control(errors.type), "h-12 cursor-pointer appearance-none pr-10")}
                        >
                          <option value="" disabled>Select an enquiry type</option>
                          {ENQUIRY_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <Chevron />
                      </div>
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="f-name" label="Full name" error={errors.name}>
                        <input id="f-name" value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" maxLength={120} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={clsx(control(errors.name), "h-12")} />
                      </Field>
                      <Field id="f-company" label="Company" optional={!companyRequired} error={errors.company}>
                        <input id="f-company" value={form.company} onChange={(e) => update("company", e.target.value)} autoComplete="organization" maxLength={160} aria-invalid={!!errors.company} aria-describedby={describedBy("company")} className={clsx(control(errors.company), "h-12")} />
                      </Field>
                      <Field id="f-role" label="Role" optional error={errors.role}>
                        <input id="f-role" value={form.role} onChange={(e) => update("role", e.target.value)} autoComplete="organization-title" maxLength={120} aria-invalid={!!errors.role} aria-describedby={describedBy("role")} className={clsx(control(errors.role), "h-12")} />
                      </Field>
                      <Field id="f-email" label="Email" error={errors.email}>
                        <input id="f-email" type="email" inputMode="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" maxLength={200} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={clsx(control(errors.email), "h-12")} />
                      </Field>
                      <Field id="f-phone" label="Phone" optional error={errors.phone}>
                        <input id="f-phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" placeholder="+91" maxLength={30} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={clsx(control(errors.phone), "h-12")} />
                      </Field>
                      <Field id="f-website" label="Company website" optional error={errors.website}>
                        <input id="f-website" type="url" inputMode="url" value={form.website} onChange={(e) => update("website", e.target.value)} autoComplete="url" placeholder="example.com" maxLength={200} aria-invalid={!!errors.website} aria-describedby={describedBy("website")} className={clsx(control(errors.website), "h-12")} />
                      </Field>
                    </div>

                    <Field id="f-country" label="Country" error={errors.country}>
                      <input id="f-country" list="country-list" value={form.country} onChange={(e) => update("country", e.target.value)} autoComplete="country-name" maxLength={80} aria-invalid={!!errors.country} aria-describedby={describedBy("country")} className={clsx(control(errors.country), "h-12")} />
                      <datalist id="country-list">
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </Field>

                    <Field id="f-message" label="Message" error={errors.message}>
                      <textarea id="f-message" value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={1500} rows={5} aria-invalid={!!errors.message} aria-describedby={describedBy("message")} className={clsx(control(errors.message), "min-h-[140px] resize-y py-3 leading-relaxed")} />
                      <span className="self-end text-xs text-muted">{form.message.length}/1500</span>
                    </Field>

                    {/* Attachment — custom control (the browser's default overflows on phones) */}
                    <Field id="f-file" label={isCareers ? "CV / résumé" : "Attachment"} optional error={errors.file}>
                      <div
                        className={clsx(
                          "flex min-w-0 items-center gap-3 rounded-xl border p-2 transition-colors",
                          errors.file ? "border-[#B42318] bg-white" : "border-transparent bg-mist",
                        )}
                      >
                        <input
                          ref={fileRef}
                          id="f-file"
                          type="file"
                          accept={FILE_ACCEPT}
                          onChange={onFile}
                          aria-invalid={!!errors.file}
                          aria-describedby={["f-file-hint", errors.file ? "f-file-err" : ""].filter(Boolean).join(" ")}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="f-file"
                          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-navy px-3.5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-navy-soft peer-focus-visible:ring-4 peer-focus-visible:ring-navy/25"
                        >
                          <PaperclipIcon />
                          {file ? "Change" : "Choose file"}
                        </label>
                        <span className={clsx("min-w-0 flex-1 truncate text-[14px]", file ? "text-navy" : "text-muted")}>
                          {file ? file.name : "No file chosen"}
                        </span>
                        {file && (
                          <button
                            type="button"
                            onClick={clearFile}
                            aria-label={`Remove ${file.name}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl leading-none text-muted transition-colors hover:bg-white hover:text-navy"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <p id="f-file-hint" className="text-[13px] text-muted">
                        {file ? `${formatSize(file.size)} · PDF, DOC or DOCX, up to 4 MB` : "PDF, DOC or DOCX, up to 4 MB."}
                      </p>
                    </Field>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="f-consent" className="flex cursor-pointer items-start gap-3 rounded-xl bg-mist p-4 text-[14.5px] leading-relaxed">
                        <input
                          id="f-consent"
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => update("consent", e.target.checked)}
                          aria-invalid={!!errors.consent}
                          aria-describedby={describedBy("consent")}
                          className="mt-1 h-[18px] w-[18px] shrink-0 accent-navy"
                        />
                        <span>
                          I have read the{" "}
                          <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-navy underline underline-offset-2">Privacy Policy</a>{" "}
                          and consent to SKAD GROUP processing this enquiry.
                        </span>
                      </label>
                      {errors.consent && (
                        <p id="f-consent-err" role="alert" className="text-[13px] text-[#B42318]">
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    <div className="mt-1">
                      <PillSubmit disabled={sending} arrow={!sending} className="w-full sm:w-auto">
                        {sending ? "Sending…" : "Send enquiry"}
                      </PillSubmit>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Contact details + group companies */}
          <Reveal delay={0.05} className="min-w-0 lg:col-span-5 lg:row-start-2">
            {details.length > 0 && (
              <ul className="mb-4 space-y-3">
                {details.map((d) => (
                  <motion.li
                    key={d.label}
                    whileHover={{ x: 4 }}
                    transition={BOUNCE}
                    className="flex items-start gap-4 rounded-2xl border border-rule bg-white p-4"
                  >
                    <DetailIcon kind={d.kind} />
                    <div className="min-w-0 text-[15px] leading-relaxed">
                      <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-muted">{d.label}</p>
                      <div className="mt-0.5 text-navy">{d.content}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="rounded-2xl border border-rule bg-white p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-muted">Group companies</p>
              <ul className="mt-3 space-y-2 text-[14.5px] text-navy">
                {COMPANIES.map((c) => (
                  <li key={c.key} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span className="min-w-0">
                      {c.name}
                      {c.location ? <span className="text-muted"> · {c.location}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}