"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { BOUNCE } from "@/lib/motion";

type Props<T extends string> = {
  /** Unique per section so the sliding highlight doesn't jump between sections */
  id: string;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export default function FilterChips<T extends string>({ id, label, options, value, onChange, className }: Props<T>) {
  return (
    <div role="group" aria-label={label} className={clsx("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const on = o === value;
        return (
          <motion.button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            whileTap={{ scale: 0.95 }}
            transition={BOUNCE}
            className={clsx(
              "relative rounded-full border px-4 py-2 text-[14px] font-medium transition-colors duration-200",
              on ? "border-transparent text-white" : "border-rule bg-white text-body hover:border-navy/30 hover:text-navy",
            )}
          >
            {on && (
              <motion.span
                layoutId={`chip-${id}`}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-navy"
                transition={{ type: "spring", stiffness: 480, damping: 22 }}
              />
            )}
            <span className="relative">{o}</span>
          </motion.button>
        );
      })}
    </div>
  );
}