"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { BOUNCE, SLOW } from "@/lib/motion";

/** Card that lifts with a bounce on hover. Children can react via "rest" / "hover" variants. */
export default function HoverCard({ children, className, lift = 6 }: { children: ReactNode; className?: string; lift?: number }) {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={{ rest: { y: 0 }, hover: { y: -lift } }}
      transition={BOUNCE}
      className={clsx("transition-shadow duration-300", className)}
    >
      {children}
    </motion.div>
  );
}

/** Slow zoom for images inside a HoverCard. */
export function HoverZoom({ children, className, scale = 1.05 }: { children: ReactNode; className?: string; scale?: number }) {
  return (
    <motion.div variants={{ rest: { scale: 1 }, hover: { scale } }} transition={SLOW} className={className}>
      {children}
    </motion.div>
  );
}