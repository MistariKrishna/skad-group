import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { INDUSTRIES, pad } from "@/lib/data";

export default function Industries() {
  return (
    <section id="industries" aria-labelledby="in-h" className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            id="in-h"
            eyebrow="Industries"
            title="Where the group works"
            intro="The industries our companies, brands and platforms operate in."
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 md:mt-14 lg:grid-cols-3">
          {INDUSTRIES.map((x, i) => (
            <li key={x.t} className="h-full">
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <HoverCard className="h-full rounded-[24px] hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
                  <article className="group relative h-full overflow-hidden rounded-[24px] border border-rule bg-white p-6 md:p-7">
                    <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-gold/20 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125" />
                    <span aria-hidden="true" className="font-serif text-[15px] text-gold-dark">{pad(i + 1)}</span>
                    <h3 className="mt-4 font-serif text-[23px] font-medium leading-tight text-navy md:text-[24px]">{x.t}</h3>
                    <span aria-hidden="true" className="mt-4 block h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" />
                    <p className="mt-4 text-[15px] leading-relaxed">{x.d}</p>
                    <ul aria-label={`Related to ${x.t}`} className="mt-6 flex flex-wrap gap-2">
                      {x.entities.map((e) => (
                        <li key={e} className="rounded-full bg-mist px-3 py-1 text-[12.5px] font-medium text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                          {e}
                        </li>
                      ))}
                    </ul>
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