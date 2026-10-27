"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { scrollToHash } from "@/lib/scroll";

/** A message to drop into the contact form. `id` changes on every call so the same text can be re-applied. */
export type Prefill = { message: string; id: number };

type ContactCtx = {
  enquiry: string;
  setEnquiry: (value: string) => void;
  prefill: Prefill | null;
  startRoute: (route: string, message?: string) => void;
};

const Ctx = createContext<ContactCtx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [enquiry, setEnquiry] = useState("");
  const [prefill, setPrefill] = useState<Prefill | null>(null);

  const startRoute = useCallback((route: string, message?: string) => {
    setEnquiry(route);
    setPrefill(message ? { message, id: Date.now() } : null);
    window.setTimeout(() => scrollToHash("#contact"), 10);
  }, []);

  const value = useMemo(() => ({ enquiry, setEnquiry, prefill, startRoute }), [enquiry, prefill, startRoute]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContact(): ContactCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContact must be used inside <ContactProvider>");
  return ctx;
}