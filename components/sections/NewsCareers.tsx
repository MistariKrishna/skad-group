"use client";

import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import { PillRoute } from "@/components/ui/Pill";

export default function NewsCareers() {
  return (
    <section aria-label="News and careers" className="section-y">
      <div className="container-x grid gap-5 md:grid-cols-2">
        <Reveal className="h-full">
          <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-8 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)] md:p-10">
            <div id="news" className="flex h-full flex-col">
              <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-rule bg-mist px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[.12em] text-gold-dark">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                News
              </span>
              <h2 className="mt-5 font-serif text-[32px] font-medium leading-tight text-navy">Announcements</h2>
              <p className="mt-4 flex-1 text-[16px] leading-relaxed">
                Company news, launches and announcements from across the group will be published here.
              </p>
              <div className="mt-8">
                <PillRoute route="Media" variant="secondary" size="sm" arrow>Media enquiries</PillRoute>
              </div>
            </div>
          </HoverCard>
        </Reveal>

        <Reveal delay={0.08} className="h-full">
          <HoverCard className="relative h-full overflow-hidden rounded-[24px] bg-navy p-8 text-white md:p-10">
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full border border-gold/15" />
            <div id="careers" className="relative flex h-full flex-col">
              <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[.12em] text-gold">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                Careers
              </span>
              <h2 className="mt-5 font-serif text-[32px] font-medium leading-tight">Build your future with SKAD</h2>
              <p className="mt-4 flex-1 text-[16px] leading-relaxed text-white/70">
                There are no open positions right now. Send your profile and we will keep it on file for future roles across the group.
              </p>
              <div className="mt-8">
                <PillRoute route="Careers" variant="light" size="sm" arrow>Send your profile</PillRoute>
              </div>
            </div>
          </HoverCard>
        </Reveal>
      </div>
    </section>
  );
}