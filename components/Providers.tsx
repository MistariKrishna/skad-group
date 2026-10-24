"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ContactProvider } from "@/components/providers/ContactProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ContactProvider>{children}</ContactProvider>
    </MotionConfig>
  );
}