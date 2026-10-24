"use client";

import type { ReactNode } from "react";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillLink, PillRoute } from "@/components/ui/Pill";
import { COMPANIES, pad } from "@/lib/data";

function Chip({ icon, children }: { icon: "pin" | "doc" | "tag"; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[13px] text-navy">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {icon === "pin" && <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>}
        {icon === "doc" && <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></>}
        {icon === "tag" && <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>}
      </svg>
      {children}
    </span>
  );
}

export default function Companies() {
  return (
    <section id="companies" aria-labelledby="co-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-mist py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionHeading
                id="co-h"
                eyebrow="Our companies"
                title="The companies behind the group"
                intro="Four operating companies across manufacturing, diamond trading, beauty, fine jewellery and global commerce."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <PillLink href="#partners" variant="secondary" arrow>Work with our companies</PillLink>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {COMPANIES.map((c, i) => (
              <Reveal key={c.key} delay={(i % 2) * 0.08} className="h-full">
                <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.45)]">
                  <article className="flex h-full flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[18px]">
                      <HoverZoom className="absolute inset-0">
                        <Media src={c.image} alt={c.name} label={c.imageLabel} className="h-full w-full" sizes="(min-width: 768px) 50vw, 100vw" />
                      </HoverZoom>
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[.1em] text-navy backdrop-blur">
                        {c.sector}
                      </span>
                      <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 font-serif text-[15px] text-navy backdrop-blur">
                        {pad(i + 1)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-4 pb-4 pt-6 md:px-5">
                      <h3 className="font-serif text-[23px] font-semibold leading-snug text-navy">{c.name}</h3>
                      <p className="mt-3 flex-1 text-[15.5px] leading-relaxed">{c.description}</p>
                      {(c.location || c.regNo || c.brands.length > 0) && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {c.location && <Chip icon="pin">{c.location}</Chip>}
                          {c.regNo && <Chip icon="doc">Reg. {c.regNo}</Chip>}
                          {c.brands.length > 0 && <Chip icon="tag">Brand: {c.brands.join(", ")}</Chip>}
                        </div>
                      )}
                      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-rule pt-5">
                        <PillRoute route={c.route} size="sm" arrow>Enquire</PillRoute>
                        {c.website && (
                          <PillLink href={c.website} external size="sm" variant="secondary">Visit website ↗</PillLink>
                        )}
                      </div>
                    </div>
                  </article>
                </HoverCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}