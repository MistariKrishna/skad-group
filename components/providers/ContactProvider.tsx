"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { scrollToHash } from "@/lib/scroll";

type ContactCtx = {
  enquiry: string;
  setEnquiry: (value: string) => void;
  startRoute: (route: string) => void;
};

const Ctx = createContext<ContactCtx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [enquiry, setEnquiry] = useState("");

  const startRoute = useCallback((route: string) => {
    setEnquiry(route);
    window.setTimeout(() => scrollToHash("#contact"), 10);
  }, []);

  const value = useMemo(() => ({ enquiry, setEnquiry, startRoute }), [enquiry, startRoute]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContact(): ContactCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContact must be used inside <ContactProvider>");
  return ctx;
}