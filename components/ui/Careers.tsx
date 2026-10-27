"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import HoverCard from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterChips from "@/components/ui/FilterChips";
import { PillLink, PillRoute } from "@/components/ui/Pill";
import { useContact } from "@/components/providers/ContactProvider";
import { CULTURE, JOBS, pad, type CareerArea, type Job } from "@/lib/data";
import { BOUNCE, EASE } from "@/lib/motion";

type Filter = CareerArea | "All";

function ApplyButton({ job }: { job: Job }) {
  const { startRoute } = useContact();
  const message = `I would like to apply for the ${job.title} role (${job.department}, ${job.location}).`;
  return (
    <motion.button
      type="button"
      onClick={() => startRoute("Careers", message)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={BOUNCE}
      className="group inline-flex items-center gap-3 rounded-full bg-navy py-1.5 pl-4 pr-1.5 text-[14px] font-medium text-white shadow-[0_16px_32px_-16px_rgba(10,31,68,.7)] transition-colors duration-200 hover:bg-navy-soft"
    >
      Apply for this role<span className="sr-only">: {job.title}</span>
      <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[13px] transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </motion.button>
  );
}

function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="border-b border-rule last:border-b-0">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition-colors hover:bg-mist/60 md:px-8"
        >
          <span>
            <span className="block text-[18px] font-semibold text-navy">{job.title}</span>
            <span className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <span className="rounded-full bg-mist px-2.5 py-1 font-medium text-navy">{job.type}</span>
              <span>{job.department}</span>
              <span aria-hidden="true">·</span>
              <span>{job.location}</span>
              {job.company && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{job.company}</span>
                </>
              )}
            </span>
          </span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 45 : 0 }}
            transition={BOUNCE}
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xl leading-none transition-colors",
              open ? "border-navy bg-navy text-white" : "border-rule text-navy group-hover:border-navy/40",
            )}
          >
            +
          </motion.span>
        </button>
      </h4>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 md:px-8">
              <p className="max-w-2xl text-[16px] leading-relaxed">{job.summary}</p>
              {job.requirements.length > 0 && (
                <>
                  <p className="mt-6 text-[12px] font-semibold uppercase tracking-[.12em] text-gold-dark">What we’re looking for</p>
                  <ul className="mt-3 space-y-2">
                    {job.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-7">
                {job.applyUrl ? (
                  <PillLink href={job.applyUrl} external size="sm" arrow>
                    Apply for this role<span className="sr-only">: {job.title} (opens in a new tab)</span>
                  </PillLink>
                ) : (
                  <ApplyButton job={job} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Careers() {
  const [active, setActive] = useState<Filter>("All");

  const openings = JOBS.filter((j) => j.status === "open");
  const departments = Array.from(new Set(openings.map((j) => j.department)));
  const list = active === "All" ? openings : openings.filter((j) => j.department === active);

  return (
    <section id="careers" aria-labelledby="cr-h" className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            id="cr-h"
            eyebrow="Careers"
            title="Build your future with SKAD"
            intro="Join a group building companies, brands and technology platforms."
          />
        </Reveal>

        {/* Culture */}
        <Reveal delay={0.05}>
          <h3 className="mt-16 text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold-dark">How we work</h3>
        </Reveal>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CULTURE.map((c, i) => (
            <li key={c.t} className="h-full">
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-7 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
                  <span aria-hidden="true" className="font-serif text-[15px] text-gold-dark">{pad(i + 1)}</span>
                  <p className="mt-4 font-serif text-[24px] font-medium leading-tight text-navy">{c.t}</p>
                  <p className="mt-3 text-[15px] leading-relaxed">{c.d}</p>
                </HoverCard>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Roles + profile */}
        <div className="mt-20 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <h3 className="font-serif text-[30px] font-medium leading-tight text-navy">Open positions</h3>
            </Reveal>

            {openings.length === 0 ? (
              <Reveal delay={0.05}>
                <div className="mt-6 rounded-[24px] border border-dashed border-rule bg-mist p-8 md:p-10">
                  <p className="max-w-xl text-[16px] leading-relaxed">
                    There are no open positions right now. Send your profile and we will keep it on file for future roles across the group.
                  </p>
                </div>
              </Reveal>
            ) : (
              <>
                {departments.length > 1 && (
                  <Reveal delay={0.05}>
                    <FilterChips
                      id="careers"
                      label="Filter roles by department"
                      options={["All", ...departments] as Filter[]}
                      value={active}
                      onChange={setActive}
                      className="mt-6"
                    />
                  </Reveal>
                )}
                <p className="sr-only" aria-live="polite">
                  {list.length} {list.length === 1 ? "role" : "roles"} shown
                </p>
                <Reveal delay={0.08}>
                  <ul className="mt-6 overflow-hidden rounded-[24px] border border-rule bg-white">
                    {list.map((j) => (
                      <JobRow key={j.id} job={j} />
                    ))}
                  </ul>
                </Reveal>
              </>
            )}
          </div>

          <Reveal delay={0.1} className="lg:col-span-4">
            <aside className="relative overflow-hidden rounded-[24px] bg-navy p-8 text-white md:p-10 lg:sticky lg:top-28">
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full border border-gold/15" />
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full border border-gold/25" />
              <div className="relative">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[.12em] text-gold">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Talent network
                </span>
                <h3 className="mt-5 font-serif text-[30px] font-medium leading-tight">Send your profile</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                  Interested in working with the group, including internships? Tell us about yourself and attach your CV.
                </p>
                <div className="mt-8">
                  <PillRoute route="Careers" variant="light" size="sm" arrow>Send your profile</PillRoute>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}