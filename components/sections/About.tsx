"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillLink } from "@/components/ui/Pill";
import { BOUNCE } from "@/lib/motion";
import { VALUES, pad } from "@/lib/data";

const ICONS: ReactNode[] = [
  <svg key="b" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /><rect x="8" y="3" width="8" height="8" rx="1.5" /></svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="5" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M7.3 11l9.4-4.6M7.3 13l9.4 4.6" /></svg>,
  <svg key="s" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>,
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="section-y">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <SectionHeading id="about-h" eyebrow="About the group" title="One group. Many possibilities." />
          <p className="mt-6 text-xl leading-relaxed text-navy">
            SKAD GROUP brings together operating companies, consumer brands, technology platforms and entrepreneurial ventures under a shared approach to building, connecting and scaling businesses.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed">
            Each company and brand serves its own market, while drawing on capabilities shared across the group, from manufacturing and sourcing to brand building, technology and commerce.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <PillLink href="#companies" arrow>Our companies</PillLink>
            <PillLink href="#approach" variant="secondary">How we build</PillLink>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:col-span-6">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <HoverCard className="flex items-start gap-5 rounded-[22px] border border-rule bg-white p-6 hover:shadow-[0_24px_48px_-28px_rgba(10,31,68,.35)] md:p-7">
                <motion.span
                  aria-hidden="true"
                  variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -8, scale: 1.08 } }}
                  transition={BOUNCE}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-gold"
                >
                  {ICONS[i]}
                </motion.span>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-sm text-gold-dark">{pad(i + 1)}</span>
                    <h3 className="text-lg font-semibold text-navy">{v.t}</h3>
                  </div>
                  <p className="mt-1.5 text-[15.5px] leading-relaxed">{v.d}</p>
                </div>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}