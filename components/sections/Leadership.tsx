"use client";

import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { LEADERSHIP } from "@/lib/data";

export default function Leadership() {
  if (LEADERSHIP.length === 0) return null;

  return (
    <section id="leadership" aria-labelledby="ld-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-mist py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading id="ld-h" eyebrow="Leadership" title="The people leading the group" />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((p, i) => (
              <Reveal key={p.name} delay={(i % 4) * 0.06} className="h-full">
                <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.45)]">
                  <article>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                      <HoverZoom className="absolute inset-0">
                        <Media src={p.image} alt={p.name} label="Portrait" className="h-full w-full" sizes="(min-width: 1024px) 25vw, 50vw" />
                      </HoverZoom>
                    </div>
                    <div className="px-3 pb-3 pt-5">
                      <h3 className="text-lg font-semibold text-navy">{p.name}</h3>
                      <p className="mt-1 text-sm font-medium text-gold-dark">{p.title}</p>
                      <p className="mt-3 text-[15px] leading-relaxed">{p.bio}</p>
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