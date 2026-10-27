"use client";

import { useState } from "react";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import HoverCard, { HoverZoom } from "@/components/ui/HoverCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterChips from "@/components/ui/FilterChips";
import { INSIGHTS, INSIGHT_CATEGORIES, type Insight, type InsightCategory } from "@/lib/data";

type Filter = InsightCategory | "All";
const PAGE = 6;
const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : fmt.format(d);
};

function Card({ a }: { a: Insight }) {
  const ext = !!a.href && /^https?:\/\//.test(a.href);
  return (
    <HoverCard className="h-full rounded-[24px] border border-rule bg-white p-2.5 hover:shadow-[0_30px_60px_-32px_rgba(10,31,68,.4)]">
      <article className="flex h-full flex-col">
        {a.image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
            <HoverZoom className="absolute inset-0">
              <Media src={a.image} alt="" label="Article image" className="h-full w-full" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
            </HoverZoom>
          </div>
        )}
        <div className="flex flex-1 flex-col px-4 pb-5 pt-5">
          <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-gold-dark">{a.category}</p>
          <h3 className="mt-3 font-serif text-[22px] font-medium leading-snug text-navy">{a.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed">{a.summary}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
            <span>{a.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            {a.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{a.readingTime}</span>
              </>
            )}
          </p>
          {a.href && (
            <div className="mt-auto pt-5">
              <a href={a.href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="link-arrow text-[14.5px]">
                Read article<span className="sr-only">: {a.title}{ext ? " (opens in a new tab)" : ""}</span>
                <span aria-hidden="true">{ext ? "↗" : "→"}</span>
              </a>
            </div>
          )}
        </div>
      </article>
    </HoverCard>
  );
}

export default function Insights() {
  const [active, setActive] = useState<Filter>("All");
  const [limit, setLimit] = useState(PAGE);

  const sorted = [...INSIGHTS].sort((a, b) => b.date.localeCompare(a.date));
  const cats = INSIGHT_CATEGORIES.filter((c) => INSIGHTS.some((a) => a.category === c));
  const list = active === "All" ? sorted : sorted.filter((a) => a.category === active);

  return (
    <section id="insights" aria-labelledby="is-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[24px] bg-mist py-16 sm:rounded-[28px] md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="is-h"
              eyebrow="SKAD Insights"
              title="Perspectives from the group"
              intro="Thinking on business, markets, technology, commerce and brand building."
            />
          </Reveal>

          {INSIGHTS.length === 0 ? (
            <Reveal delay={0.1}>
              <div className="mt-12 rounded-[24px] border border-dashed border-rule bg-white p-6 md:p-10">
                <p className="max-w-xl text-[16px] leading-relaxed">Articles will be published here on these topics:</p>
                <ul aria-label="Insight topics" className="mt-5 flex flex-wrap gap-2">
                  {INSIGHT_CATEGORIES.map((c) => (
                    <li key={c} className="rounded-full bg-mist px-3.5 py-1.5 text-[13px] font-medium text-navy">{c}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : (
            <>
              {cats.length > 1 && (
                <Reveal delay={0.05}>
                  <FilterChips
                    id="insights"
                    label="Filter articles by topic"
                    options={["All", ...cats] as Filter[]}
                    value={active}
                    onChange={(f) => {
                      setActive(f);
                      setLimit(PAGE);
                    }}
                    className="mt-10"
                  />
                </Reveal>
              )}
              <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {list.slice(0, limit).map((a, i) => (
                  <li key={a.id} className="h-full">
                    <Reveal delay={(i % 3) * 0.06} className="h-full">
                      <Card a={a} />
                    </Reveal>
                  </li>
                ))}
              </ul>
              {list.length > limit && (
                <div className="mt-10 flex justify-center">
                  <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn btn-secondary">
                    Show more articles
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}