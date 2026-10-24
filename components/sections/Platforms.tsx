"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillRoute } from "@/components/ui/Pill";
import { BOUNCE } from "@/lib/motion";
import { PLATFORMS } from "@/lib/data";

export default function Platforms() {
  const os = PLATFORMS[0];
  const lab = PLATFORMS[1];

  return (
    <section id="platforms" aria-labelledby="pl-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-mist py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="pl-h"
              eyebrow="Platforms & ventures"
              title="Technology and execution for growing businesses"
              intro="SKAD CommerceOS is the infrastructure. SKAD Commerce Lab is the execution. Both sit within the SKAD DIATECH EXPORTS ecosystem."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-5">
            <Reveal className="h-full lg:col-span-3">
              <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-8 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)] md:p-10">
                <span className="inline-flex rounded-full bg-[#EAF1FD] px-3 py-1 text-[12px] font-semibold uppercase tracking-[.1em] text-[#1F4FA8]">{os.label}</span>
                <h3 className="mt-5 font-serif text-[30px] font-medium text-navy">{os.name}</h3>
                <p className="mt-1 text-sm font-medium tracking-[.06em] text-muted">{os.tagline}</p>
                <p className="mt-5 text-[16px] leading-relaxed">{os.description}</p>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {os.items.map((item) => (
                    <motion.li
                      key={item}
                      whileHover={{ scale: 1.07, y: -2 }}
                      transition={BOUNCE}
                      className="cursor-default rounded-full border border-rule bg-mist px-3.5 py-1.5 text-[13.5px] text-navy transition-colors duration-200 hover:border-[#1F4FA8]/30 hover:bg-[#EAF1FD]"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8">
                  <PillRoute route="Technology" size="sm" arrow>Enquire about CommerceOS</PillRoute>
                </div>
              </HoverCard>
            </Reveal>

            <Reveal delay={0.08} className="h-full lg:col-span-2">
              <HoverCard className="relative h-full overflow-hidden rounded-[24px] bg-navy p-8 text-white md:p-10">
                <span aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-gold/15" />
                <span aria-hidden="true" className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-gold/25" />
                <div className="relative flex h-full flex-col">
                  <span className="inline-flex self-start rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[.1em] text-gold">{lab.label}</span>
                  <h3 className="mt-5 font-serif text-[30px] font-medium">{lab.name}</h3>
                  <p className="mt-1 text-sm font-medium tracking-[.06em] text-white/60">{lab.tagline}</p>
                  <div className="mt-8 flex items-end gap-3">
                    <span className="font-serif text-[64px] leading-none text-gold">15</span>
                    <span className="pb-2 text-[15px] text-white/80">service capabilities</span>
                  </div>
                  <p className="mt-5 flex-1 text-[15.5px] leading-relaxed text-white/70">{lab.description}</p>
                  <div className="mt-8">
                    <PillRoute route="Technology" size="sm" variant="light" arrow>Enquire about Commerce Lab</PillRoute>
                  </div>
                </div>
              </HoverCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}