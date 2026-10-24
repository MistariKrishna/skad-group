"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const R = 20;
const CIRC = 2 * Math.PI * R;
const BOUNCE = { type: "spring" as const, stiffness: 520, damping: 14 };

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setShow(y > 600);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 40, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.6, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ type: "spring", stiffness: 420, damping: 12 }}
          whileHover="hover"
          whileTap={{ scale: 0.88 }}
          variants={{ hover: { scale: 1.1, transition: BOUNCE } }}
          className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-[0_12px_30px_-10px_rgba(10,31,68,.55)] transition-colors duration-200 hover:bg-navy-soft md:bottom-8 md:right-8 md:h-14 md:w-14"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
            />
          </svg>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="relative h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              hover: {
                y: [0, -5, 0],
                transition: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
              },
            }}
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}