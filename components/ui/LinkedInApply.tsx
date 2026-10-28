"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { BOUNCE } from "@/lib/motion";
import { CAREER_AREAS, COUNTRIES } from "@/lib/data";
import { useFocusTrap } from "@/lib/useFocusTrap";

type FormState = { name: string; email: string; linkedin: string; country: string; area: string; consent: boolean };
type FieldKey = "name" | "email" | "linkedin" | "country" | "consent";
type Errors = Partial<Record<FieldKey, string>>;

const EMPTY: FormState = { name: "", email: "", linkedin: "", country: "", area: "", consent: false };
const ORDER: FieldKey[] = ["name", "email", "linkedin", "country", "consent"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LINKEDIN_RE = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/(in|pub)\/[A-Za-z0-9_%\-.]+\/?(\?.*)?$/i;

const normaliseUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

const control = (err?: string) =>
  clsx(
    "h-12 w-full rounded-xl border bg-mist px-4 text-[15.5px] text-navy transition-all duration-200 placeholder:text-muted/60 hover:bg-[#EEF0F3] focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10",
    err ? "border-[#B42318] bg-white" : "border-transparent",
  );

function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9V9z" />
    </svg>
  );
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-[13px] text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Send LinkedIn profile" button + accessible dialog. `tone` = background the button sits on. */
export default function LinkedInApply({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const openedAt = useRef(0);
  const trap = useFocusTrap(panelRef);

  useEffect(() => setMounted(true), []);

  // Lock page scroll, focus the first field, close on Escape, restore focus on close
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => document.getElementById(id(sent ? "done" : "name"))?.focus(), 80);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      body.style.overflow = "";
      body.style.paddingRight = "";
      triggerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const show = () => {
    if (sent) {
      setForm(EMPTY);
      setSent(false);
    }
    setErrors({});
    setServerError("");
    openedAt.current = Date.now();
    setOpen(true);
  };

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const E: Errors = {};
    if (!form.name.trim()) E.name = "Enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) E.email = "Enter an email address in the format name@example.com.";
    if (!LINKEDIN_RE.test(form.linkedin.trim())) E.linkedin = "Enter your LinkedIn profile link, for example linkedin.com/in/your-name.";
    if (!form.country.trim()) E.country = "Enter your country.";
    if (!form.consent) E.consent = "Confirm you have read the Privacy Policy.";
    return E;
  };

  const focusFirst = (E: Errors) => {
    const first = ORDER.find((k) => E[k]);
    if (first) window.setTimeout(() => document.getElementById(id(first))?.focus(), 0);
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
      const url = normaliseUrl(form.linkedin.trim());
      const message = [
        `LinkedIn profile: ${url}`,
        form.area ? `Area of interest: ${form.area}` : "",
        "",
        "Sent with “Send LinkedIn profile” on the Careers section.",
      ]
        .filter((l, i) => l || i === 2)
        .join("\n");

      const body = new FormData();
      body.append("type", "Careers");
      body.append("name", form.name.trim());
      body.append("email", form.email.trim());
      body.append("country", form.country.trim());
      body.append("message", message);
      body.append("consent", String(form.consent));
      body.append("fax", trapRef.current?.value ?? "");
      body.append("t", String(openedAt.current));

      const res = await fetch("/api/enquiries", { method: "POST", body });
      const data: { message?: string; errors?: Record<string, string> } = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          const mapped: Errors = {
            name: data.errors.name,
            email: data.errors.email,
            country: data.errors.country,
            consent: data.errors.consent,
          };
          setErrors(mapped);
          focusFirst(mapped);
        }
        setServerError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
      window.setTimeout(() => document.getElementById(id("done"))?.focus(), 60);
    } catch {
      setServerError("We couldn’t reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const describedBy = (k: FieldKey) => (errors[k] ? `${id(k)}-err` : undefined);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={BOUNCE}
        className={clsx(
          "inline-flex items-center justify-center gap-2.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200",
          tone === "dark"
            ? "border border-white/25 text-white hover:border-white/60 hover:bg-white/5"
            : "border border-navy/15 bg-white text-navy hover:border-navy/40",
          className,
        )}
      >
        <span className={clsx("flex h-6 w-6 items-center justify-center rounded-full", tone === "dark" ? "bg-white/10" : "bg-navy/[0.06]")}>
          <LinkedInIcon className="h-3.5 w-3.5" />
        </span>
        Send LinkedIn profile
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="li-dialog"
                className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div aria-hidden="true" onClick={() => setOpen(false)} className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm" />

                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={id("title")}
                  aria-describedby={id("desc")}
                  onKeyDown={trap}
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 48, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[24px] bg-white p-6 shadow-2xl sm:rounded-[24px] sm:p-8"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                        <LinkedInIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-gold-dark">Careers</p>
                        <h2 id={id("title")} className="font-serif text-[24px] font-medium leading-tight text-navy">
                          Send your LinkedIn profile
                        </h2>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule text-2xl leading-none text-navy transition-transform duration-300 hover:rotate-90"
                    >
                      ×
                    </button>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {sent ? (
                      <motion.div key="sent" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-8">
                        <motion.span
                          aria-hidden="true"
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.05 }}
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F4EC] text-2xl text-[#1E7A46]"
                        >
                          ✓
                        </motion.span>
                        <p id={id("desc")} className="mt-6 font-serif text-[24px] font-medium leading-tight text-navy">
                          Thank you. Your LinkedIn profile has been sent.
                        </p>
                        <p className="mt-3 text-[15.5px] leading-relaxed">
                          Our team will review it and reply to {form.email} if there’s a suitable role.
                        </p>
                        <button id={id("done")} type="button" onClick={() => setOpen(false)} className="btn btn-primary mt-8">
                          Done
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 flex flex-col gap-5">
                        <p id={id("desc")} className="text-[15px] leading-relaxed">
                          Share your LinkedIn profile and we’ll keep it on file for current and future roles across the group.
                        </p>

                        {/* Spam trap */}
                        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                          <label htmlFor={id("fax")}>Fax</label>
                          <input ref={trapRef} id={id("fax")} type="text" tabIndex={-1} autoComplete="off" />
                        </div>

                        {serverError && (
                          <p role="alert" className="rounded-xl border border-[#F4C7C3] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">
                            {serverError}
                          </p>
                        )}

                        <Field id={id("name")} label="Full name" error={errors.name}>
                          <input id={id("name")} value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" maxLength={120} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={control(errors.name)} />
                        </Field>

                        <Field id={id("email")} label="Email" error={errors.email}>
                          <input id={id("email")} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" maxLength={200} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={control(errors.email)} />
                        </Field>

                        <Field id={id("linkedin")} label="LinkedIn profile URL" error={errors.linkedin}>
                          <input id={id("linkedin")} type="url" inputMode="url" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/your-name" autoComplete="url" maxLength={200} aria-invalid={!!errors.linkedin} aria-describedby={describedBy("linkedin")} className={control(errors.linkedin)} />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field id={id("country")} label="Country" error={errors.country}>
                            <input id={id("country")} list={id("countries")} value={form.country} onChange={(e) => update("country", e.target.value)} autoComplete="country-name" maxLength={80} aria-invalid={!!errors.country} aria-describedby={describedBy("country")} className={control(errors.country)} />
                            <datalist id={id("countries")}>
                              {COUNTRIES.map((c) => (
                                <option key={c} value={c} />
                              ))}
                            </datalist>
                          </Field>

                          <Field id={id("area")} label="Area of interest" optional>
                            <select id={id("area")} value={form.area} onChange={(e) => update("area", e.target.value)} className={clsx(control(), "cursor-pointer")}>
                              <option value="">Any area</option>
                              {CAREER_AREAS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3 rounded-xl bg-mist p-4 text-[14.5px] leading-relaxed">
                            <input id={id("consent")} type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} className="mt-1 h-[18px] w-[18px] shrink-0 accent-navy" />
                            <span>
                              I have read the{" "}
                              <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-navy underline underline-offset-2">Privacy Policy</a>{" "}
                              and consent to SKAD GROUP storing my profile for recruitment.
                            </span>
                          </label>
                          {errors.consent && (
                            <p id={`${id("consent")}-err`} role="alert" className="text-[13px] text-[#B42318]">
                              {errors.consent}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <motion.button
                            type="submit"
                            disabled={sending}
                            whileHover={sending ? undefined : { scale: 1.04 }}
                            whileTap={sending ? undefined : { scale: 0.96 }}
                            transition={BOUNCE}
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-navy py-2.5 pl-6 pr-2.5 text-[15px] font-medium text-white shadow-[0_16px_32px_-16px_rgba(10,31,68,.7)] transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {sending ? "Sending…" : "Send profile"}
                            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm transition-transform duration-300 group-hover:translate-x-0.5">
                              {sending ? "…" : "→"}
                            </span>
                          </motion.button>
                          <button type="button" onClick={() => setOpen(false)} className="rounded-full px-4 py-2.5 text-[15px] font-medium text-muted transition-colors hover:text-navy">
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}