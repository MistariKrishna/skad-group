"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PRELOADER_KEY } from "@/lib/preloader";

const MIN_MS = 1700; //  minimum time on screen, counted from when it first appeared
const MAX_MS = 4500; //  never wait longer than this for the page to finish loading
const EXIT_MS = 1150; // length of the exit (bar → fade → curtain)

// Infinity / gateway mark and central star (viewBox 0 0 120 60)
const INFINITY = "M60 30 C70 15 95 10 100 30 C105 50 70 45 60 30 C50 15 25 10 20 30 C15 50 50 45 60 30";
const STAR = "M60 21.5 L61.9 28.1 L68.5 30 L61.9 31.9 L60 38.5 L58.1 31.9 L51.5 30 L58.1 28.1 Z";
const WORD = "SKAD GROUP";

type PlWindow = Window & { __plStart?: number };

export default function Preloader() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("pl-skip")) {
      setPhase("done");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = reduced ? 300 : MIN_MS;
    // When the preloader first painted (set by the <head> script); falls back to now
    const shownAt = (window as PlWindow).__plStart ?? performance.now();

    let finished = false;
    let exitTimer = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      const elapsed = performance.now() - shownAt;
      exitTimer = window.setTimeout(() => {
        setPhase("exit");
        root.classList.remove("pl-active");
        try {
          sessionStorage.setItem(PRELOADER_KEY, "1");
        } catch {
          /* private mode — ignore */
        }
      }, Math.max(0, min - elapsed));
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = window.setTimeout(finish, MAX_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(cap);
      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => setPhase("done"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div id="preloader" className={phase === "exit" ? "pl pl--exit" : "pl"} role="status" aria-live="polite">
      <span className="sr-only">Loading SKAD GROUP</span>

      <div className="pl__curtain" aria-hidden="true">
        <span className="pl__ring pl__ring--1" />
        <span className="pl__ring pl__ring--2" />
        <span className="pl__ring pl__ring--3" />
      </div>

      <div className="pl__content" aria-hidden="true">
        <svg className="pl__mark" viewBox="0 0 120 60">
          <path className="pl__track" d={INFINITY} pathLength={1} />
          <path className="pl__draw" d={INFINITY} pathLength={1} />
          <path className="pl__glint" d={INFINITY} pathLength={1} />
          <path className="pl__star" d={STAR} />
        </svg>

        <p className="pl__word">
          {WORD.split("").map((ch, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </p>

        <p className="pl__tag">BUILD • CONNECT • SCALE</p>

        <div className="pl__bar">
          <span />
        </div>
      </div>
    </div>
  );
}