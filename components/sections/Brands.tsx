"use client";

import Image from "next/image";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillLink, PillRoute } from "@/components/ui/Pill";
import { BRANDS, type Brand, type BrandKey } from "@/lib/data";

const PANEL: Record<BrandKey, string> = {
  detara: "bg-[#111111] text-[#F3EEE4]",
  luxora: "bg-[#F3E6E1] text-[#4A2A2A]",
  benavi: "bg-[#E9ECEE] text-[#26313B]",
  rupaari: "bg-[#5E1A24] text-[#F6E7D8]",
  casesuno: "bg-[#F4F6F8] text-[#1C2733]",
  zemo: "bg-[#D9F24F] text-[#0B0B0B]",
};

function Wordmark({ k }: { k: BrandKey }) {
  switch (k) {
    case "detara":
      return <span className="font-bodoni text-4xl tracking-[.24em]">DETARA</span>;
    case "luxora":
      return <span className="font-display text-5xl italic">Luxora Glow</span>;
    case "benavi":
      return <span className="text-4xl font-light tracking-[.3em]">BENAVI</span>;
    case "rupaari":
      return <span className="font-display text-5xl font-semibold tracking-[.06em]">RUPAARI</span>;
    case "casesuno":
      return <span className="font-mono text-3xl font-medium">CASE_SUNO</span>;
    case "zemo":
      return <span className="font-archivo text-6xl tracking-[-.03em]">ZEMO</span>;
    default:
      return null;
  }
}

function Visual({ b }: { b: Brand }) {
  if (b.image) {
    return (
      <HoverZoom className="absolute inset-0">
        <Image src={b.image} alt={b.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </HoverZoom>
    );
  }
  return (
    <HoverZoom scale={1.08} className="flex h-full w-full items-center justify-center">
      {b.logo ? <Image src={b.logo} alt={`${b.name} logo`} width={220} height={80} className="h-16 w-auto object-contain" /> : <Wordmark k={b.key} />}
    </HoverZoom>
  );
}

export default function Brands() {
  return (
    <section id="brands" aria-labelledby="br-h" className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            id="br-h"
            eyebrow="Our brands"
            title="Brands built for their own markets"
            intro="Each brand has its own identity, customers and market, supported by the companies and capabilities of the group."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((b, i) => (
            <Reveal key={b.key} delay={(i % 3) * 0.06} className="h-full">
              <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.45)]">
                <article className="flex h-full flex-col">
                  <div className={clsx("relative aspect-[4/3] overflow-hidden rounded-[18px]", b.image || b.logo ? "bg-mist" : PANEL[b.key])}>
                    <Visual b={b} />
                    {b.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[.1em] text-navy shadow-sm">
                        {b.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-gold-dark">{b.category}</p>
                    <h3 className="mt-1.5 text-lg font-semibold text-navy">{b.name}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed">{b.tagline}</p>
                    <p className="mt-4 text-[13px] text-muted">{b.company}</p>
                    <div className="mt-5 border-t border-rule pt-4">
                      {b.url ? (
                        <PillLink href={b.url} external size="sm" variant="secondary">Visit {b.name} ↗</PillLink>
                      ) : (
                        <PillRoute route={b.route} size="sm" variant="secondary" arrow>Enquire</PillRoute>
                      )}
                    </div>
                  </div>
                </article>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}