"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillRoute } from "@/components/ui/Pill";
import { useContact } from "@/components/providers/ContactProvider";
import { BOUNCE } from "@/lib/motion";
import { PATHWAYS, pad } from "@/lib/data";

export default function Partners() {
  const { startRoute } = useContact();

  return (
    <section id="partners" aria-labelledby="pa-h" className="px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-navy py-20 text-white md:py-28">
        <span aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-gold/10" />
        <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-gold/20" />

        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              id="pa-h"
              light
              eyebrow="Work with us"
              title="Build with SKAD"
              intro="Whether you supply, distribute, invest or build, each enquiry is routed to the team best placed to respond."
            />
            <div className="mt-9">
              <PillRoute route="Business Partnership" variant="light" arrow>Start an enquiry</PillRoute>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {PATHWAYS.map((p, i) => (
              <Reveal key={p.t} delay={(i % 2) * 0.06} className="h-full">
                <motion.button
                  type="button"
                  onClick={() => startRoute(p.route)}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                  transition={BOUNCE}
                  className="flex h-full w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition-colors duration-300 hover:border-gold/40 hover:bg-white/[0.07]"
                >
                  <span>
                    <span className="block text-xs text-gold">{pad(i + 1)}</span>
                    <span className="mt-1 block text-[17px] font-medium text-white">{p.t}</span>
                    <span className="mt-1 block text-sm text-white/60">{p.d}</span>
                  </span>
                  <motion.span
                    aria-hidden="true"
                    variants={{
                      rest: { rotate: 0, backgroundColor: "rgba(255,255,255,0.08)", color: "#FFFFFF" },
                      hover: { rotate: -45, backgroundColor: "#D4AF37", color: "#0A1F44" },
                    }}
                    transition={BOUNCE}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  >
                    →
                  </motion.span>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}