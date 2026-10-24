"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useContact } from "@/components/providers/ContactProvider";
import { BOUNCE } from "@/lib/motion";

export type PillVariant = "primary" | "secondary" | "light" | "outline-light";
type Size = "md" | "sm";
type Common = { children: ReactNode; variant?: PillVariant; arrow?: boolean; size?: Size; className?: string };

const STYLES: Record<PillVariant, string> = {
  primary: "bg-navy text-white shadow-[0_16px_32px_-16px_rgba(10,31,68,.7)] hover:bg-navy-soft",
  secondary: "border border-navy/15 bg-white text-navy hover:border-navy/40",
  light: "bg-white text-navy shadow-[0_16px_32px_-16px_rgba(0,0,0,.5)] hover:bg-mist",
  "outline-light": "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
};
const ARROW: Record<PillVariant, string> = {
  primary: "bg-white/15",
  secondary: "bg-navy/[0.06]",
  light: "bg-navy/[0.07]",
  "outline-light": "bg-white/10",
};

function classes(variant: PillVariant, arrow: boolean, size: Size, className?: string) {
  return clsx(
    "group inline-flex items-center justify-center gap-3 rounded-full font-medium transition-colors duration-200",
    size === "sm" ? "text-[14px]" : "text-[15px]",
    arrow ? (size === "sm" ? "py-1.5 pl-4 pr-1.5" : "py-2.5 pl-6 pr-2.5") : size === "sm" ? "px-4 py-2" : "px-6 py-3.5",
    STYLES[variant],
    className,
  );
}

function Content({ children, arrow, variant, size }: { children: ReactNode; arrow: boolean; variant: PillVariant; size: Size }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className={clsx(
            "flex shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5",
            size === "sm" ? "h-7 w-7 text-[13px]" : "h-9 w-9 text-sm",
            ARROW[variant],
          )}
        >
          →
        </span>
      )}
    </>
  );
}

export function PillLink({ href, external = false, children, variant = "primary", arrow = false, size = "md", className }: Common & { href: string; external?: boolean }) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={BOUNCE}
      className={classes(variant, arrow, size, className)}
    >
      <Content arrow={arrow} variant={variant} size={size}>{children}</Content>
    </motion.a>
  );
}

export function PillRoute({ route, children, variant = "primary", arrow = false, size = "md", className }: Common & { route: string }) {
  const { startRoute } = useContact();
  return (
    <motion.button
      type="button"
      onClick={() => startRoute(route)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={BOUNCE}
      className={classes(variant, arrow, size, className)}
    >
      <Content arrow={arrow} variant={variant} size={size}>{children}</Content>
    </motion.button>
  );
}

export function PillSubmit({ children, disabled = false, variant = "primary", arrow = false, size = "md", className }: Common & { disabled?: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={BOUNCE}
      className={clsx(classes(variant, arrow, size, className), "disabled:cursor-not-allowed disabled:opacity-60")}
    >
      <Content arrow={arrow} variant={variant} size={size}>{children}</Content>
    </motion.button>
  );
}