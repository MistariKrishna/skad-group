import type { Transition } from "framer-motion";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const BOUNCE: Transition = { type: "spring", stiffness: 520, damping: 14 };
export const SOFT: Transition = { type: "spring", stiffness: 260, damping: 22 };
export const SLOW: Transition = { type: "spring", stiffness: 120, damping: 20 };