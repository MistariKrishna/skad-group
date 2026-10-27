import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillRoute } from "@/components/ui/Pill";
import { CAPABILITIES, pad } from "@/lib/data";

export default function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="cap-h" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              id="cap-h"
              eyebrow="Capabilities"
              title="What we bring to every business"
              intro="Capabilities shared across the group’s companies, brands and platforms."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <PillRoute route="Business Partnership" variant="secondary" arrow>Discuss a partnership</PillRoute>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 md:mt-14 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => (
            <li key={c.t} className="h-full">
              <Reveal delay={(i % 4) * 0.05} className="h-full">
                <HoverCard className="h-full rounded-[24px] hover:shadow-[0_30px_60px_-30px_rgba(10,31,68,.55)]">
                  <article className="group relative h-full overflow-hidden rounded-[24px] border border-rule bg-white p-6 transition-colors duration-300 hover:border-navy hover:bg-navy md:p-7">
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-14 -right-14 h-36 w-36 rounded-full border border-gold/0 transition-all duration-700 group-hover:scale-110 group-hover:border-gold/25" />
                    <div className="flex items-center justify-between">
                      <span aria-hidden="true" className="font-serif text-[15px] text-gold-dark transition-colors duration-300 group-hover:text-gold">{pad(i + 1)}</span>
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold/40 transition-all duration-300 group-hover:scale-150 group-hover:bg-gold" />
                    </div>
                    <h3 className="mt-8 font-serif text-[26px] font-medium leading-tight text-navy transition-colors duration-300 group-hover:text-white">{c.t}</h3>
                    <span aria-hidden="true" className="mt-4 block h-px w-10 bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                    <p className="mt-4 text-[15px] leading-relaxed transition-colors duration-300 group-hover:text-white/75">{c.d}</p>
                  </article>
                </HoverCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}