"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterChips from "@/components/ui/FilterChips";
import { PEOPLE, PEOPLE_GROUPS, type PeopleGroup, type Person } from "@/lib/data";
import { BOUNCE, EASE } from "@/lib/motion";

type Filter = PeopleGroup | "All";

const initials = (name: string) => {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
};

/** Founders first, then Leadership, Management… (order of PEOPLE_GROUPS); original order kept within a group. */
const ORDERED: Person[] = PEOPLE.map((p, i) => ({ p, i }))
  .sort((a, b) => PEOPLE_GROUPS.indexOf(a.p.group) - PEOPLE_GROUPS.indexOf(b.p.group) || a.i - b.i)
  .map(({ p }) => p);

/** "A · B · C" → ["A", "B", "C"] */
const splitCompanies = (s?: string) =>
  (s ?? "")
    .split("·")
    .map((x) => x.trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ */
/* Portrait: photo if provided, otherwise a navy + gold monogram       */
/* ------------------------------------------------------------------ */
function Portrait({ person, sizes }: { person: Person; sizes: string }) {
  if (person.image) {
    return (
      <Image
        src={person.image}
        alt={`Portrait of ${person.name}`}
        fill
        sizes={sizes}
        className="object-cover object-[50%_18%]"
      />
    );
  }
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-navy-soft via-navy to-navy-deep">
      <span className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-gold/15" />
      <span className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full border border-gold/25" />
      <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full border border-white/5" />
      <span className="relative font-serif text-[48px] font-medium tracking-wide text-gold">{initials(person.name)}</span>
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
/* Card — identical for everyone                                       */
/* ------------------------------------------------------------------ */
function PersonCard({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const companies = splitCompanies(person.company);
  const hasExpertise = !!person.expertise && person.expertise.length > 0;
  const isFounder = person.group === "Founder";
  const hasDetails = !!person.bio || companies.length > 0 || hasExpertise;

  return (
    <HoverCard lift={4} className="rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
      <article>
        {/* Portrait photo (4:5) */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-navy">
          <HoverZoom className="absolute inset-0" scale={1.04}>
            <Portrait person={person} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          </HoverZoom>
          <span
            className={clsx(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] shadow-sm",
              isFounder ? "bg-gold text-navy-deep" : "bg-white text-navy",
            )}
          >
            {person.group}
          </span>
        </div>

        <div className="px-3 pb-3 pt-5">
          {/* Name + title (fixed two-line space each, so every card is the same height) */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 min-h-[2.75em] text-[18px] font-semibold leading-snug text-navy">{person.name}</h3>
              <p className="mt-1 line-clamp-2 min-h-[2.75em] text-[14px] font-medium leading-snug text-gold-dark">{person.title}</p>
            </div>
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} on LinkedIn (opens in a new tab)`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
              >
                <LinkedInIcon />
              </a>
            )}
          </div>

          {/* No details yet → keep the same card height */}
          {!hasDetails && <div aria-hidden="true" className="mt-4 h-[46px]" />}

          {hasDetails && (
            <>
              {/* Read bio */}
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
                className={clsx(
                  "mt-4 flex h-[46px] w-full items-center justify-between rounded-xl border px-4 text-[14px] font-medium transition-colors duration-200",
                  open ? "border-navy bg-navy text-white" : "border-rule text-navy hover:border-navy/30 hover:bg-mist",
                )}
              >
                <span>
                  {open ? "Hide bio" : "Read bio"}
                  <span className="sr-only"> of {person.name}</span>
                </span>
                <motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} transition={BOUNCE} className="text-lg leading-none">
                  +
                </motion.span>
              </button>

              {/* Expanding details */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={panelId}
                    key="bio"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="pt-5">
                      {companies.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-muted">
                            {companies.length > 1 ? "Associated companies" : "Company"}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {companies.map((c) => (
                              <li key={c} className="flex items-start gap-2 text-[13px] leading-snug text-navy">
                                <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {person.bio && (
                        <p className={clsx("whitespace-pre-line text-[14.5px] leading-relaxed text-body", companies.length > 0 && "mt-4")}>
                          {person.bio}
                        </p>
                      )}

                      {hasExpertise && (
                        <ul aria-label="Areas of expertise" className="mt-4 flex flex-wrap gap-1.5">
                          {person.expertise!.map((e) => (
                            <li key={e} className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-medium text-navy">
                              {e}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
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

          {/* items-start: opening one card doesn't stretch the others in its row */}
          <ul className="mt-10 grid items-start gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <motion.li
                  key={p.name}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <PersonCard person={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </section>
  );
}