"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useContact } from "@/components/providers/ContactProvider";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillSubmit } from "@/components/ui/Pill";
import { BOUNCE } from "@/lib/motion";
import { COMPANIES, CONTACT_DETAILS, COUNTRIES, ENQUIRY_TYPES, PARTNER_ROUTES } from "@/lib/data";

type FormState = { name: string; company: string; email: string; phone: string; country: string; message: string; consent: boolean };
type FieldKey = keyof FormState | "type";
type Errors = Partial<Record<FieldKey, string>>;

const EMPTY: FormState = { name: "", company: "", email: "", phone: "", country: "", message: "", consent: false };
const ORDER: FieldKey[] = ["type", "name", "company", "email", "phone", "country", "message", "consent"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

const control = (err?: string) =>
  clsx(
    "w-full rounded-xl border bg-mist px-4 text-[15.5px] text-navy transition-all duration-200 placeholder:text-muted/60 hover:bg-[#EEF0F3] focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10",
    err ? "border-[#B42318] bg-white" : "border-transparent",
  );

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
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
            className="text-[13px] text-[#B42318]"
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
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {kind === "pin" && <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>}
        {kind === "mail" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>}
        {kind === "phone" && <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />}
        {kind === "clock" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
      </svg>
    </span>
  );
}

export default function Contact() {
  const { enquiry, setEnquiry } = useContact();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const companyRequired = PARTNER_ROUTES.includes(enquiry);
  const { address, email, phone, hours } = CONTACT_DETAILS;

  const details: { kind: "pin" | "mail" | "phone" | "clock"; label: string; content: ReactNode }[] = [];
  if (address.length > 0) details.push({ kind: "pin", label: "Address", content: address.map((l) => <span key={l} className="block">{l}</span>) });
  if (email) details.push({ kind: "mail", label: "Email", content: <a href={`mailto:${email}`} className="hover:underline">{email}</a> });
  if (phone) details.push({ kind: "phone", label: "Phone", content: <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">{phone}</a> });
  if (hours) details.push({ kind: "clock", label: "Hours", content: hours });

  useEffect(() => {
    if (enquiry) setSent(false);
    setErrors((e) => ({ ...e, type: undefined }));
  }, [enquiry]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const E: Errors = {};
    if (!enquiry) E.type = "Select an enquiry type.";
    if (!form.name.trim()) E.name = "Enter your name.";
    if (companyRequired && !form.company.trim()) E.company = "Enter your company name for this enquiry type.";
    if (!EMAIL_RE.test(form.email.trim())) E.email = "Enter an email address in the format name@example.com.";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) E.phone = "Enter a phone number with country code, for example +91 98765 43210.";
    if (!form.country.trim()) E.country = "Enter your country.";
    if (form.message.trim().length < 10) E.message = "Write a message of at least 10 characters.";
    if (!form.consent) E.consent = "Confirm you have read the Privacy Policy.";
    return E;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const E = validate();
    if (Object.keys(E).length > 0) {
      setErrors(E);
      const first = ORDER.find((k) => E[k]);
      if (first) window.setTimeout(() => document.getElementById(`f-${first}`)?.focus(), 0);
      return;
    }
    setSending(true);
    // Replace with a real API call (e.g. POST /api/enquiries) when the backend is ready.
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1000);
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSent(false);
    setEnquiry("");
  };

  const describedBy = (k: FieldKey) => (errors[k] ? `f-${k}-err` : undefined);

  return (
    <section id="contact" aria-labelledby="ct-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-mist py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              id="ct-h"
              eyebrow="Contact"
              title="Let’s build something meaningful"
              intro="Choose an enquiry type and your message will be routed to the right team across the group."
            />

            {details.length > 0 && (
              <ul className="mt-10 space-y-3">
                {details.map((d) => (
                  <motion.li
                    key={d.label}
                    whileHover={{ x: 4 }}
                    transition={BOUNCE}
                    className="flex items-start gap-4 rounded-2xl border border-rule bg-white p-4"
                  >
                    <DetailIcon kind={d.kind} />
                    <div className="text-[15px] leading-relaxed">
                      <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-muted">{d.label}</p>
                      <div className="mt-0.5 text-navy">{d.content}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="mt-6 rounded-2xl border border-rule bg-white p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-muted">Group companies</p>
              <ul className="mt-3 space-y-2 text-[14.5px] text-navy">
                {COMPANIES.map((c) => (
                  <li key={c.key} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>
                      {c.name}
                      {c.location ? <span className="text-muted"> · {c.location}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-[24px] border border-rule bg-white p-6 shadow-[0_30px_70px_-40px_rgba(10,31,68,.45)] md:p-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    role="status"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[460px] flex-col justify-center"
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
                    <h3 className="mt-6 font-serif text-[30px] font-medium leading-tight text-navy">Thank you. Your enquiry has been received.</h3>
                    <p className="mt-3 text-[16px] leading-relaxed">
                      Your <strong className="font-semibold text-navy">{enquiry}</strong> enquiry has been routed to the right team. A member of the team will reply to {form.email}.
                    </p>
                    <motion.button
                      type="button"
                      onClick={reset}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={BOUNCE}
                      className="mt-8 self-start rounded-full border border-navy/15 bg-white px-6 py-3.5 text-[15px] font-medium text-navy transition-colors hover:border-navy/40"
                    >
                      Send another enquiry
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
                    <Field id="f-type" label="Enquiry type" error={errors.type}>
                      <select
                        id="f-type"
                        value={enquiry}
                        onChange={(e) => setEnquiry(e.target.value)}
                        aria-invalid={!!errors.type}
                        aria-describedby={describedBy("type")}
                        className={clsx(control(errors.type), "h-12 cursor-pointer")}
                      >
                        <option value="" disabled>Select an enquiry type</option>
                        {ENQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="f-name" label="Full name" error={errors.name}>
                        <input id="f-name" value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={clsx(control(errors.name), "h-12")} />
                      </Field>
                      <Field id="f-company" label="Company" optional={!companyRequired} error={errors.company}>
                        <input id="f-company" value={form.company} onChange={(e) => update("company", e.target.value)} autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={describedBy("company")} className={clsx(control(errors.company), "h-12")} />
                      </Field>
                      <Field id="f-email" label="Email" error={errors.email}>
                        <input id="f-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={clsx(control(errors.email), "h-12")} />
                      </Field>
                      <Field id="f-phone" label="Phone" optional error={errors.phone}>
                        <input id="f-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" placeholder="+91" aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={clsx(control(errors.phone), "h-12")} />
                      </Field>
                    </div>

                    <Field id="f-country" label="Country" error={errors.country}>
                      <input id="f-country" list="country-list" value={form.country} onChange={(e) => update("country", e.target.value)} autoComplete="country-name" aria-invalid={!!errors.country} aria-describedby={describedBy("country")} className={clsx(control(errors.country), "h-12")} />
                      <datalist id="country-list">
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </Field>

                    <Field id="f-message" label="Message" error={errors.message}>
                      <textarea id="f-message" value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={1500} rows={5} aria-invalid={!!errors.message} aria-describedby={describedBy("message")} className={clsx(control(errors.message), "resize-y py-3 leading-relaxed")} />
                      <span className="self-end text-xs text-muted">{form.message.length}/1500</span>
                    </Field>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="f-consent" className="flex cursor-pointer items-start gap-3 rounded-xl bg-mist p-4 text-[14.5px] leading-relaxed">
                        <input id="f-consent" type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} className="mt-1 h-[18px] w-[18px] shrink-0 accent-navy" />
                        <span>
                          I have read the{" "}
                          <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-navy underline underline-offset-2">Privacy Policy</a>{" "}
                          and consent to SKAD GROUP processing this enquiry.
                        </span>
                      </label>
                      {errors.consent && <p id="f-consent-err" role="alert" className="text-[13px] text-[#B42318]">{errors.consent}</p>}
                    </div>

                    <div className="mt-2">
                      <PillSubmit disabled={sending} arrow={!sending}>
                        {sending ? "Sending…" : "Send enquiry"}
                      </PillSubmit>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}