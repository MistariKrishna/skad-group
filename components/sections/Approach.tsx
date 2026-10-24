"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { BOUNCE } from "@/lib/motion";
import { APPROACH, pad } from "@/lib/data";

export default function Approach() {
  return (
    <section id="approach" aria-labelledby="ap-h" className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            id="ap-h"
            eyebrow="How we build"
            title="From idea to scale"
            intro="A consistent approach used across the companies and brands of the group."
          />
        </Reveal>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APPROACH.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 0.07} className="h-full">
              <li className="h-full list-none">
                <HoverCard className="h-full rounded-[22px] border border-rule bg-white p-7 hover:shadow-[0_24px_48px_-28px_rgba(10,31,68,.35)] md:p-8">
                  <div className="flex items-center justify-between">
                    <motion.span
                      variants={{
                        rest: { backgroundColor: "#F5F6F8", color: "#8A6A1F", scale: 1 },
                        hover: { backgroundColor: "#0A1F44", color: "#D4AF37", scale: 1.08 },
                      }}
                      transition={BOUNCE}
                      className="flex h-12 w-12 items-center justify-center rounded-full font-serif text-lg"
                    >
                      {pad(i + 1)}
                    </motion.span>
                    <span className="text-[12px] font-semibold uppercase tracking-[.12em] text-muted">Step {i + 1} of {APPROACH.length}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-navy">{s.t}</h3>
                  <p className="mt-1 text-sm font-medium text-gold-dark">{s.k}</p>
                  <p className="mt-4 text-[15px] leading-relaxed">{s.d}</p>
                </HoverCard>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}