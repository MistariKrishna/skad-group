"use client";

import type { ReactNode } from "react";
import { useContact } from "@/components/providers/ContactProvider";

export default function RouteButton({ route, className, children }: { route: string; className?: string; children: ReactNode }) {
  const { startRoute } = useContact();
  return (
    <button type="button" className={className} onClick={() => startRoute(route)}>
      {children}
    </button>
  );
}