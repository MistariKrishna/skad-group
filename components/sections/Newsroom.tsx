"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterChips from "@/components/ui/FilterChips";
import { PillLink, PillRoute } from "@/components/ui/Pill";
import { MEDIA_KIT, NEWS, NEWS_CATEGORIES, type NewsCategory, type NewsItem } from "@/lib/data";
import { EASE } from "@/lib/motion";

type Filter = NewsCategory | "All";
const PAGE = 6;

// timeZone "UTC" keeps server and browser output identical (avoids hydration mismatch)
const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : fmt.format(d);
};
const isExternal = (href: string) => /^https?:\/\//.test(href);

function Meta({ item }: { item: NewsItem }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] font-semibold uppercase tracking-[.1em] text-muted">
      <time dateTime={item.date}>{formatDate(item.date)}</time>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
      <span className="text-gold-dark">{item.category}</span>
      {item.entity && (
        <>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rule" />
          <span>{item.entity}</span>
        </>
      )}
    </p>
  );
}

function ReadMore({ item }: { item: NewsItem }) {
  if (!item.href) return null;
  const ext = isExternal(item.href);
  return (
    <a href={item.href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="link-arrow mt-6 text-[14.5px]">
      Read more
      <span className="sr-only">: {item.title}{ext ? " (opens in a new tab)" : ""}</span>
      <span aria-hidden="true">{ext ? "↗" : "→"}</span>
    </a>
  );
}

function Featured({ item }: { item: NewsItem }) {
  return (
    <HoverCard lift={4} className="rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
      <article className={clsx("grid gap-2", item.image && "md:grid-cols-2")}>
        {item.image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] md:aspect-auto md:min-h-[360px]">
            <HoverZoom className="absolute inset-0">
              <Media src={item.image} alt="" label="News image" className="h-full w-full" sizes="(min-width: 768px) 50vw, 100vw" />
            </HoverZoom>
          </div>
        )}
        <div className="flex flex-col justify-center px-4 pb-6 pt-4 md:p-10">
          <span className="self-start rounded-full bg-navy px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[.12em] text-gold">Latest</span>
          <div className="mt-5"><Meta item={item} /></div>
          <h3 className="mt-4 font-serif text-[clamp(26px,2.6vw,34px)] font-medium leading-tight text-navy">{item.title}</h3>
          <p className="mt-4 text-[16.5px] leading-relaxed">{item.summary}</p>
          <ReadMore item={item} />
        </div>
      </article>
    </HoverCard>
  );
}

function Card({ item }: { item: NewsItem }) {
  return (
    <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
      <article className="flex h-full flex-col">
        {item.image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
            <HoverZoom className="absolute inset-0">
              <Media src={item.image} alt="" label="News image" className="h-full w-full" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
            </HoverZoom>
          </div>
        )}
        <div className="flex flex-1 flex-col px-4 pb-5 pt-5">
          <Meta item={item} />
          <h3 className="mt-3 font-serif text-[22px] font-medium leading-snug text-navy">{item.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed">{item.summary}</p>
          <div className="mt-auto"><ReadMore item={item} /></div>
        </div>
      </article>
    </HoverCard>
  );
}

export default function Newsroom() {
  const [active, setActive] = useState<Filter>("All");
  const [limit, setLimit] = useState(PAGE);

  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const cats = NEWS_CATEGORIES.filter((c) => NEWS.some((n) => n.category === c));
  const list = active === "All" ? sorted : sorted.filter((n) => n.category === active);
  const [featured, ...rest] = list;
  const shown = rest.slice(0, limit);

  const choose = (f: Filter) => {
    setActive(f);
    setLimit(PAGE);
  };

  return (
    <section id="news" aria-labelledby="nw-h" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              id="nw-h"
              eyebrow="Newsroom"
              title="Announcements"
              intro="Company news, launches, partnerships and foundation updates from across the group."
            />
          </Reveal>
          <Reveal delay={0.08} className="flex flex-wrap gap-3">
            {MEDIA_KIT.href && (
              <PillLink href={MEDIA_KIT.href} variant="secondary" size="sm">Media kit</PillLink>
            )}
            <PillRoute route="Media" variant="secondary" size="sm" arrow>Media enquiries</PillRoute>
          </Reveal>
        </div>

        {NEWS.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-[24px] border border-dashed border-rule bg-mist p-8 md:p-10">
              <p className="max-w-xl text-[16px] leading-relaxed">
                Company news, launches and announcements from across the group will be published here.
              </p>
            </div>
          </Reveal>
        ) : (
          <>
            {cats.length > 1 && (
              <Reveal delay={0.05}>
                <FilterChips
                  id="news"
                  label="Filter announcements by category"
                  options={["All", ...cats] as Filter[]}
                  value={active}
                  onChange={choose}
                  className="mt-10"
                />
              </Reveal>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {featured && (
                  <div className="mt-10">
                    <Featured item={featured} />
                  </div>
                )}

                {shown.length > 0 && (
                  <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {shown.map((n, i) => (
                      <li key={n.id} className="h-full">
                        <Reveal delay={(i % 3) * 0.06} className="h-full">
                          <Card item={n} />
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                )}

                {rest.length > limit && (
                  <div className="mt-10 flex justify-center">
                    <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn btn-secondary">
                      Show more announcements
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}