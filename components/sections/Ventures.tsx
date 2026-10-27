import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import RouteButton from "@/components/ui/RouteButton";
import { PillRoute } from "@/components/ui/Pill";
import { FUTURE_AREAS, OPPORTUNITY_TYPES, VENTURES } from "@/lib/data";

export default function Ventures() {
  return (
    <section id="ventures" aria-labelledby="vn-h" className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            id="vn-h"
            eyebrow="What’s next"
            title="Building what comes next"
            intro="New businesses, brands, technologies and markets. If you have an opportunity, we would like to hear it."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <ul aria-label="Areas we are exploring" className="mt-8 flex flex-wrap gap-2">
            {FUTURE_AREAS.map((a) => (
              <li key={a} className="rounded-full border border-rule bg-white px-4 py-2 text-[14px] font-medium text-navy">{a}</li>
            ))}
          </ul>
        </Reveal>

        {VENTURES.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VENTURES.map((v, i) => (
              <li key={v.name} className="h-full">
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-6 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] font-semibold uppercase tracking-[.12em] text-gold-dark">{v.type}</span>
                      <span className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-medium text-navy">{v.status}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-[24px] font-medium text-navy">{v.name}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed">{v.description}</p>
                    {v.related && <p className="mt-3 text-[13px] text-muted">{v.related}</p>}
                  </HoverCard>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {/* Opportunity types */}
          <Reveal delay={0.05} className="lg:col-span-7">
            <h3 className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold-dark">Opportunities we consider</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {OPPORTUNITY_TYPES.map((o) => (
                <li key={o.t}>
                  <RouteButton
                    route={o.route}
                    className="group flex h-full w-full items-start justify-between gap-4 rounded-2xl border border-rule bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-[0_20px_40px_-28px_rgba(10,31,68,.45)]"
                  >
                    <span>
                      <span className="block text-[16px] font-semibold text-navy">{o.t}</span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-body">{o.d}</span>
                    </span>
                    <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition-all duration-300 group-hover:bg-navy group-hover:text-white">
                      →
                    </span>
                  </RouteButton>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-[24px] bg-navy p-7 text-white md:p-10">
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full border border-gold/15" />
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full border border-gold/25" />
              <div className="relative flex h-full flex-col">
                <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[.12em] text-gold">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Opportunities
                </span>
                <h3 className="mt-5 font-serif text-[30px] font-medium leading-tight">Have an opportunity?</h3>
                <p className="mt-4 flex-1 text-[16px] leading-relaxed text-white/70">
                  Tell us about the business, market or idea. Your submission goes directly to the right team.
                </p>
                <div className="mt-8">
                  <PillRoute route="Business Opportunity" variant="light" arrow>Submit a business opportunity</PillRoute>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}