import Image from "next/image";
import clsx from "clsx";
import { SITE } from "@/lib/data";

type Size = "md" | "lg" | "xl";
type Props = { tone?: "dark" | "light"; size?: Size; className?: string };

/** Logo heights per size. "lg" is the default (header & footer). */
const HEIGHTS: Record<Size, string> = {
  md: "h-9 sm:h-10", //          36px → 40px
  lg: "h-10 sm:h-[46px]", //     40px → 46px
  xl: "h-12 sm:h-14", //         48px → 56px
};

export default function Logo({ tone = "dark", size = "lg", className }: Props) {
  const src = tone === "light" ? SITE.logoLight || SITE.logo : SITE.logo;

  // Text fallback if no logo file is set
  if (!src) {
    return (
      <span
        className={clsx(
          "font-serif text-[24px] font-semibold tracking-[.08em]",
          tone === "light" ? "text-white" : "text-navy",
          className,
        )}
      >
        SKAD GROUP
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt="SKAD GROUP"
      width={220}
      height={60}
      priority={tone === "dark"} // header logo is above the fold
      unoptimized // SVGs are already sharp at every size; serve the original file
      draggable={false}
      className={clsx("block w-auto select-none object-contain", HEIGHTS[size], className)}
      style={{ width: "auto" }}
    />
  );
}