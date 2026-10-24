import Image from "next/image";
import clsx from "clsx";
import { SITE } from "@/lib/data";

/* Adjust these to match your logo's proportions (width ÷ height). */
const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 44;

function lemniscate(n = 160): string {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const s = Math.sin(t);
    const c = Math.cos(t);
    const k = 1 + s * s;
    d += (i ? "L" : "M") + (c / k).toFixed(4) + " " + (((s * c) / k) * 1.15).toFixed(4);
  }
  return d + "Z";
}
const PATH = lemniscate();

export function Mark({ className, color = "#B8862D" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-1.08 -0.5 2.16 1" className={className} aria-hidden="true" focusable="false">
      <path d={PATH} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M0 -0.09 L0.022 0 L0 0.09 L-0.022 0 Z" fill={color} />
    </svg>
  );
}

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const file = tone === "light" ? SITE.logoLight || SITE.logo : SITE.logo;

  if (file) {
    return (
      <Image
        src={file}
        alt="SKAD GROUP"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority
        unoptimized={file.endsWith(".svg")}
        className="h-10 w-auto md:h-11"
      />
    );
  }

  // Fallback text logo (shown until a logo file is set in lib/data.ts)
  return (
    <span className={clsx("flex items-center gap-3", tone === "light" ? "text-white" : "text-navy")}>
      <Mark className="h-5 w-10" color={tone === "light" ? "#D4AF37" : "#B8862D"} />
      <span className="flex items-baseline gap-2">
        <span className="font-serif text-[24px] font-semibold tracking-[.1em]">SKAD</span>
        <span className={clsx("text-[11px] font-semibold tracking-[.3em]", tone === "light" ? "text-gold" : "text-gold-dark")}>GROUP</span>
      </span>
    </span>
  );
}