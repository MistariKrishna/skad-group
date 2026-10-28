"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
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

/** Founders first, then Leadership, Management… (order of PEOPLE_GROUPS); original order kept within a group. */
const ORDERED: Person[] = PEOPLE.map((p, i) => ({ p, i }))
  .sort((a, b) => PEOPLE_GROUPS.indexOf(a.p.group) - PEOPLE_GROUPS.indexOf(b.p.group) || a.i - b.i)
  .map(({ p }) => p);

/* ------------------------------------------------------------------ */
/* Portrait: photo if provided, otherwise a navy + gold monogram       */
/* ------------------------------------------------------------------ */
function Portrait({ person, sizes }: { person: Person; sizes: string }) {
  if (person.image) {
    return <Media src={person.image} alt={`Portrait of ${person.name}`} label="Portrait" className="h-full w-full" sizes={sizes} />;
  }
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-navy-soft via-navy to-navy-deep">
      <span className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full border border-gold/15" />
      <span className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full border border-gold/25" />
      <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full border border-white/5" />
      <span className="relative font-serif text-[56px] font-medium tracking-wide text-gold">{initials(person.name)}</span>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9V9z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Card (same for everyone, founders included)                         */
/* ------------------------------------------------------------------ */
function PersonCard({ person }: { person: Person }) {
  const hasExpertise = !!person.expertise && person.expertise.length > 0;
  const isFounder = person.group === "Founder";

  return (
    <HoverCard className="group h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.45)]">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-navy">
          <HoverZoom className="absolute inset-0" scale={1.07}>
            <Portrait person={person} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          </HoverZoom>

          {/* Soft bottom shade */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/50 to-transparent" />

          {/* Team tag (gold for founders) */}
          <span
            className={clsx(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] shadow-sm backdrop-blur",
              isFounder ? "bg-gold text-navy-deep" : "bg-white/90 text-navy",
            )}
          >
            {person.group}
          </span>

          {/* Hover / focus bio panel (devices with a mouse only) */}
          <div className="absolute inset-0 hidden flex-col justify-end bg-navy-deep/[0.88] p-5 text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex">
            <div className="max-h-full translate-y-4 overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:translate-y-0 group-hover:translate-y-0">
              <span aria-hidden="true" className="block h-px w-8 bg-gold" />
              <p className="mt-4 whitespace-pre-line text-[14.5px] leading-relaxed text-white/85">{person.bio}</p>
              {hasExpertise && (
                <ul aria-label="Areas of expertise" className="mt-4 flex flex-wrap gap-1.5">
                  {person.expertise!.map((e) => (
                    <li key={e} className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-white/80">{e}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug text-navy">{person.name}</h3>
              <p className="mt-1 text-sm font-medium text-gold-dark">{person.title}</p>
            </div>
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} on LinkedIn (opens in a new tab)`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule text-navy transition-all duration-300 hover:-rotate-6 hover:border-navy hover:bg-navy hover:text-white"
              >
                <LinkedInIcon />
              </a>
            )}
          </div>

          {/* Gold line grows on hover */}
          <span aria-hidden="true" className="mt-4 block h-px w-10 bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />

          {person.company && <p className="mt-3 text-[13px] leading-snug text-muted">{person.company}</p>}

          {/* Bio shown inline on touch devices (no hover available) */}
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed [@media(hover:hover)]:hidden">{person.bio}</p>

          {/* Expertise shown inline on touch devices */}
          {hasExpertise && (
            <ul aria-label="Areas of expertise" className="mt-3 flex flex-wrap gap-1.5 [@media(hover:hover)]:hidden">
              {person.expertise!.map((e) => (
                <li key={e} className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-medium text-navy">{e}</li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </HoverCard>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function People() {
  const [active, setActive] = useState<Filter>("All");
  if (PEOPLE.length === 0) return null;

  const groups = PEOPLE_GROUPS.filter((g) => PEOPLE.some((p) => p.group === g));
  const visible = active === "All" ? ORDERED : ORDERED.filter((p) => p.group === active);

  return (
    <section id="people" aria-labelledby="pp-h" className="px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[24px] bg-mist py-16 sm:rounded-[28px] md:py-28">
        <span aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full border border-navy/[0.05]" />

        <div className="container-x relative">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <SectionHeading
                id="pp-h"
                eyebrow="People"
                title="The people building SKAD"
                intro="The founder, leadership and teams behind the group’s companies, brands and platforms."
              />
            </Reveal>
            {groups.length > 1 && (
              <Reveal delay={0.05}>
                <FilterChips
                  id="people"
                  label="Filter people by team"
                  options={["All", ...groups] as Filter[]}
                  value={active}
                  onChange={setActive}
                />
              </Reveal>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            {visible.length} {visible.length === 1 ? "person" : "people"} shown
          </p>

          <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
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
      </div>
    </section>
  );
}