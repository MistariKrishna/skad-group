"use client";

import { motion } from "framer-motion";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillRoute } from "@/components/ui/Pill";
import { BOUNCE, SLOW } from "@/lib/motion";
import { FOUNDATION } from "@/lib/data";

export default function Foundation() {
  return (
    <section id="foundation" aria-labelledby="fo-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-[#F4F1EA] py-20 md:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={SLOW}
              className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-[0_40px_80px_-44px_rgba(45,59,78,.55)]"
            >
              <Media src={FOUNDATION.image} alt="Kalla Rudra Foundation" label={FOUNDATION.imageLabel} className="h-full w-full" />
            </motion.div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <SectionHeading
              id="fo-h"
              eyebrow="Kalla Rudra Foundation"
              title="Beyond business"
              intro="The Kalla Rudra Foundation is the social impact initiative of SKAD GROUP."
            />
            <ul className="mt-8 flex flex-wrap gap-2">
              {FOUNDATION.areas.map((a) => (
                <motion.li
                  key={a}
                  whileHover={{ scale: 1.07, y: -2 }}
                  transition={BOUNCE}
                  className="cursor-default rounded-full border border-[#D9CFB8] bg-white px-4 py-2 text-[14px] text-navy transition-colors duration-200 hover:border-gold"
                >
                  {a}
                </motion.li>
              ))}
            </ul>
            <div className="mt-9">
              <PillRoute route="Foundation" arrow>Contact the foundation</PillRoute>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}