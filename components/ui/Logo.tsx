import Image from "next/image";
import clsx from "clsx";
import { SITE } from "@/lib/data";

type Props = { tone?: "dark" | "light"; className?: string };

export default function Logo({ tone = "dark", className }: Props) {
  const src = tone === "light" ? SITE.logoLight || SITE.logo : SITE.logo;

  // Text fallback if no logo file is set
  if (!src) {
    return (
      <span
        className={clsx(
          "font-serif text-[22px] font-semibold tracking-[.08em]",
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
      width={180}
      height={48}
      priority={tone === "dark"} // header logo is above the fold
      className={clsx("h-9 w-auto sm:h-10", className)}
      style={{ width: "auto" }} // keeps the aspect ratio; removes the Next.js warning
    />
  );
}