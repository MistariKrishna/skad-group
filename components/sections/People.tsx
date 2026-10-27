"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterChips from "@/components/ui/FilterChips";
import { PEOPLE, PEOPLE_GROUPS, type PeopleGroup, type Person } from "@/lib/data";
import { EASE } from "@/lib/motion";

type Filter = PeopleGroup | "All";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

/** Photo if provided, otherwise a navy monogram (never a fake photo placeholder for a real person). */
function Portrait({ person, sizes }: { person: Person; sizes: string }) {
  if (person.image) {
    return <Media src={person.image} alt={`Portrait of ${person.name}`} label="Portrait" className="h-full w-full" sizes={sizes} />;
  }
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center overflow-hidden bg-navy">
      <span className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-gold/15" />
      <span className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full border border-gold/25" />
      <span className="relative font-serif text-[52px] font-medium tracking-wide text-gold">{initials(person.name)}</span>
    </div>
  );
}

function LinkedIn({ person }: { person: Person }) {
  if (!person.linkedin) return null;
  return (
    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="link-arrow mt-5 text-[14px]">
      LinkedIn
      <span className="sr-only"> profile of {person.name} (opens in a new tab)</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function FounderCard({ person, delay }: { person: Person; delay: number }) {
  return (
    <Reveal delay={delay}>
      <HoverCard lift={4} className="rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.45)]">
        <article className="grid gap-2 md:grid-cols-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] md:col-span-5 md:aspect-auto md:min-h-[460px]">
            <HoverZoom className="absolute inset-0">
              <Portrait person={person} sizes="(min-width: 768px) 40vw, 100vw" />
            </HoverZoom>
          </div>
          <div className="flex flex-col justify-center px-4 pb-6 pt-4 md:col-span-7 md:px-10 md:py-10">
            <p className="text-[12px] font-semibold uppercase tracking-[.14em] text-gold-dark">{person.title}</p>
            <h3 className="mt-3 font-serif text-[clamp(30px,3.2vw,42px)] font-medium leading-[1.1] text-navy">{person.name}</h3>
            {person.company && <p className="mt-2 text-[14.5px] text-muted">{person.company}</p>}
            <p className="mt-6 whitespace-pre-line text-[16.5px] leading-relaxed">{person.bio}</p>
            {person.expertise && person.expertise.length > 0 && (
              <ul aria-label="Areas of expertise" className="mt-7 flex flex-wrap gap-2">
                {person.expertise.map((e) => (
                  <li key={e} className="rounded-full bg-mist px-3.5 py-1.5 text-[13px] font-medium text-navy">{e}</li>
                ))}
              </ul>
            )}
            <LinkedIn person={person} />
          </div>
        </article>
      </HoverCard>
    </Reveal>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.45)]">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
          <HoverZoom className="absolute inset-0">
            <Portrait person={person} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          </HoverZoom>
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <p className="text-[11.5px] font-semibold uppercase tracking-[.12em] text-muted">{person.group}</p>
          <h3 className="mt-1.5 text-lg font-semibold text-navy">{person.name}</h3>
          <p className="mt-1 text-sm font-medium text-gold-dark">{person.title}</p>
          {person.company && <p className="mt-1 text-[13px] text-muted">{person.company}</p>}
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed">{person.bio}</p>
          <div className="mt-auto">
            <LinkedIn person={person} />
          </div>
        </div>
      </article>
    </HoverCard>
  );
}

export default function People() {
  const [active, setActive] = useState<Filter>("All");
  if (PEOPLE.length === 0) return null;

  const founders = PEOPLE.filter((p) => p.group === "Founder");
  const team = PEOPLE.filter((p) => p.group !== "Founder");
  const groups = PEOPLE_GROUPS.filter((g) => g !== "Founder" && team.some((p) => p.group === g));
  const visible = active === "All" ? team : team.filter((p) => p.group === active);

  return (
    <section id="people" aria-labelledby="pp-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-mist py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading id="pp-h" eyebrow="People" title="The people building SKAD" />
          </Reveal>

          {founders.length > 0 && (
            <div className="mt-14 space-y-5">
              {founders.map((p, i) => (
                <FounderCard key={p.name} person={p} delay={i * 0.06} />
              ))}
            </div>
          )}

          {team.length > 0 && (
            <div className={founders.length > 0 ? "mt-20" : "mt-14"}>
              {founders.length > 0 && (
                <Reveal>
                  <h3 className="font-serif text-[28px] font-medium leading-tight text-navy">Leadership & teams</h3>
                </Reveal>
              )}

              {groups.length > 1 && (
                <Reveal delay={0.05}>
                  <FilterChips
                    id="people"
                    label="Filter people by team"
                    options={["All", ...groups] as Filter[]}
                    value={active}
                    onChange={setActive}
                    className="mt-6"
                  />
                </Reveal>
              )}

              <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {visible.map((p) => (
                    <motion.li
                      key={p.name}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="h-full"
                    >
                      <PersonCard person={p} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}