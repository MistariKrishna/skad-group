"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterChips from "@/components/ui/FilterChips";
import { PillLink } from "@/components/ui/Pill";
import { BRANDS, COMPANIES, FOUNDATION, PLATFORMS, type Brand } from "@/lib/data";
import { EASE } from "@/lib/motion";

type Kind = "group" | "company" | "brand" | "platform" | "collection" | "impact";
type Detail = { eyebrow: string; title: string; text: string; relation?: string; href: string; external?: boolean; cta: string };
type EcoNode = { id: string; label: string; kind: Kind; col: 0 | 1 | 2; y: number; parent?: string; detail: Detail };
type Kid = Omit<EcoNode, "col" | "y" | "parent">;
type Filter = "All" | "Companies" | "Brands" | "Platforms" | "Impact";

const W = 1000;
const ROW = 56;
const TOP = 36;
const NODE_H = 40;
const COLS = [
  { x: 16, w: 176 },
  { x: 330, w: 252 },
  { x: 760, w: 224 },
] as const;

const KIND_LABEL: Record<Kind, string> = {
  group: "Group", company: "Company", brand: "Brand", platform: "Platform", collection: "Brands", impact: "Impact",
};

const FILTER_KINDS: Record<Filter, Kind[] | null> = {
  All: null, Companies: ["company"], Brands: ["brand", "collection"], Platforms: ["platform"], Impact: ["impact"],
};

const STYLE: Record<Kind, { fill: string; stroke: string; text: string; dot: string; dash?: string }> = {
  group: { fill: "#0A1F44", stroke: "#D4AF37", text: "#FFFFFF", dot: "#D4AF37" },
  company: { fill: "#FFFFFF", stroke: "#0A1F44", text: "#0A1F44", dot: "#0A1F44" },
  brand: { fill: "#FFFFFF", stroke: "#D4AF37", text: "#0A1F44", dot: "#D4AF37" },
  platform: { fill: "#F5F6F8", stroke: "#16305C", text: "#0A1F44", dot: "#16305C", dash: "4 3" },
  collection: { fill: "#FFFFFF", stroke: "#C9CED8", text: "#5B6478", dot: "#C9CED8", dash: "4 3" },
  impact: { fill: "#FBF6E6", stroke: "#8A6A1F", text: "#8A6A1F", dot: "#8A6A1F" },
};

const GROUP_DETAIL: Detail = {
  eyebrow: "Group",
  title: "SKAD GROUP",
  text: "A diversified business group building companies, brands, technology platforms and entrepreneurial ventures across markets.",
  href: "#about",
  cta: "About the group",
};

function brandKid(b: Brand): Kid {
  return {
    id: `b-${b.key}`,
    label: b.name,
    kind: "brand",
    detail: {
      eyebrow: b.badge ? `Brand · ${b.category} · ${b.badge}` : `Brand · ${b.category}`,
      title: b.name,
      text: b.tagline,
      relation: b.company,
      href: b.url || "#brands",
      external: !!b.url,
      cta: b.url ? `Visit ${b.name}` : "View brands",
    },
  };
}

/** Lays out Group → Companies (+ group brands, impact) → Brands / Platforms from the data. */
function build() {
  const nodes: EcoNode[] = [];
  let row = 0;
  const yOf = (r: number) => TOP + r * ROW;

  const place = (id: string, label: string, kind: Kind, detail: Detail, kids: Kid[]) => {
    const start = row;
    kids.forEach((k) => {
      nodes.push({ ...k, col: 2, y: yOf(row), parent: id });
      row++;
    });
    if (kids.length === 0) row++;
    nodes.push({ id, label, kind, col: 1, y: yOf((start + row - 1) / 2), parent: "group", detail });
  };

  const owned = new Set<string>();
  for (const c of COMPANIES) {
    const brandKids = c.brands
      .map((n) => BRANDS.find((b) => b.name === n))
      .filter((b): b is Brand => !!b)
      .map((b) => {
        owned.add(b.key);
        return brandKid(b);
      });
    const platformKids: Kid[] = (c.platforms ?? [])
      .map((k) => PLATFORMS.find((p) => p.key === k))
      .filter((p): p is (typeof PLATFORMS)[number] => !!p)
      .map((p) => ({
        id: `p-${p.key}`,
        label: p.name,
        kind: "platform",
        detail: {
          eyebrow: `Platform · ${p.label}`,
          title: p.name,
          text: p.description,
          relation: `Part of the ${c.name} ecosystem`,
          href: "#platforms",
          cta: "View platforms",
        },
      }));

    place(
      `c-${c.key}`,
      c.short,
      "company",
      {
        eyebrow: `Company · ${c.sector}`,
        title: c.name,
        text: c.description,
        relation: c.location || undefined,
        href: c.website || "#companies",
        external: !!c.website,
        cta: c.website ? "Visit website" : "View companies",
      },
      [...brandKids, ...platformKids],
    );
  }

  const groupBrands = BRANDS.filter((b) => !owned.has(b.key));
  if (groupBrands.length > 0) {
    place(
      "collection",
      "Group brands",
      "collection",
      { eyebrow: "Brands", title: "Brands of SKAD GROUP", text: "Consumer brands that are part of SKAD GROUP, each with its own identity.", href: "#brands", cta: "View brands" },
      groupBrands.map(brandKid),
    );
  }

  place(
    "impact",
    "Kalla Rudra Foundation",
    "impact",
    { eyebrow: "Impact", title: "Kalla Rudra Foundation", text: FOUNDATION.summary, href: "#foundation", cta: "About the foundation" },
    [],
  );

  const height = TOP * 2 + (row - 1) * ROW;
  nodes.unshift({ id: "group", label: "SKAD GROUP", kind: "group", col: 0, y: height / 2, detail: GROUP_DETAIL });
  return { nodes, height };
}

const { nodes: NODES, height: H } = build();
const BY_ID = new Map(NODES.map((n) => [n.id, n] as const));
const MIDS = NODES.filter((n) => n.col === 1);
const childrenOf = (id: string) => NODES.filter((n) => n.parent === id);

function related(id: string) {
  const set = new Set<string>([id]);
  const n = BY_ID.get(id);
  if (n?.parent) {
    set.add(n.parent);
    const p = BY_ID.get(n.parent);
    if (p?.parent) set.add(p.parent);
  }
  childrenOf(id).forEach((c) => {
    set.add(c.id);
    childrenOf(c.id).forEach((g) => set.add(g.id));
  });
  return set;
}

function edge(p: EcoNode, c: EcoNode) {
  const x1 = COLS[p.col].x + COLS[p.col].w;
  const x2 = COLS[c.col].x;
  const d = (x2 - x1) * 0.5;
  return `M ${x1} ${p.y} C ${x1 + d} ${p.y}, ${x2 - d} ${c.y}, ${x2} ${c.y}`;
}

function DetailLink({ d, light = false }: { d: Detail; light?: boolean }) {
  return (
    <a
      href={d.href}
      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={light ? "mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-gold" : "link-arrow mt-3 text-[14px]"}
    >
      {d.cta}
      {d.external && <span className="sr-only"> (opens in a new tab)</span>}
      <span aria-hidden="true">{d.external ? "↗" : "→"}</span>
    </a>
  );
}

export default function Ecosystem() {
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState("group");
  const [filter, setFilter] = useState<Filter>("All");

  const focusId = hover ?? selected;
  const rel = related(focusId);
  const kinds = FILTER_KINDS[filter];
  const inFilter = (n: EcoNode) => n.kind === "group" || !kinds || kinds.includes(n.kind);
  const current = BY_ID.get(focusId) ?? NODES[0];

  return (
    <section id="ecosystem" aria-labelledby="eco-h" className="px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[24px] bg-mist py-16 sm:rounded-[28px] md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="eco-h"
              eyebrow="SKAD ecosystem"
              title="How the group connects"
              intro="The group, its companies, and the brands and platforms within each one."
            />
          </Reveal>

          {/* ---------- Interactive map (large screens) ---------- */}
          <Reveal delay={0.05} className="mt-12 hidden lg:block">
            <div className="flex items-center justify-between gap-6">
              <FilterChips
                id="eco"
                label="Highlight by type"
                options={["All", "Companies", "Brands", "Platforms", "Impact"] as Filter[]}
                value={filter}
                onChange={setFilter}
              />
              <p className="text-[13px] text-muted">Hover or select a name to explore</p>
            </div>

            <div className="mt-6 rounded-[24px] border border-rule bg-white p-6 xl:p-8">
              <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full font-sans" aria-hidden="true">
                {NODES.filter((n) => n.parent).map((n) => {
                  const p = BY_ID.get(n.parent as string);
                  if (!p) return null;
                  const on = rel.has(n.id) && rel.has(p.id) && focusId !== "group";
                  const shown = inFilter(n) && inFilter(p);
                  return (
                    <motion.path
                      key={`e-${n.id}`}
                      d={edge(p, n)}
                      fill="none"
                      stroke={on ? "#D4AF37" : "#0A1F44"}
                      strokeWidth={on ? 1.8 : 1}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1.1, ease: EASE, delay: n.col === 1 ? 0.1 : 0.5 }}
                      style={{ opacity: !shown ? 0.05 : on ? 0.95 : 0.18, transition: "opacity .3s ease" }}
                    />
                  );
                })}

                {NODES.map((n) => {
                  const s = STYLE[n.kind];
                  const c = COLS[n.col];
                  const active = focusId === n.id;
                  const opacity = !inFilter(n) ? 0.25 : focusId === "group" || rel.has(n.id) ? 1 : 0.45;
                  return (
                    <g
                      key={n.id}
                      onMouseEnter={() => setHover(n.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setSelected(n.id)}
                      className="cursor-pointer"
                      style={{ opacity, transition: "opacity .3s ease" }}
                    >
                      <rect
                        x={c.x}
                        y={n.y - NODE_H / 2}
                        width={c.w}
                        height={NODE_H}
                        rx={12}
                        fill={s.fill}
                        stroke={active ? "#D4AF37" : s.stroke}
                        strokeWidth={active ? 2.2 : 1.2}
                        strokeDasharray={active ? undefined : s.dash}
                        style={{ transition: "stroke .25s ease, stroke-width .25s ease" }}
                      />
                      <circle cx={c.x + 18} cy={n.y} r={4} fill={s.dot} />
                      <text
                        x={c.x + 32}
                        y={n.y + 5}
                        fontSize={n.kind === "group" ? 15 : 14}
                        fontWeight={600}
                        fill={s.text}
                        letterSpacing={n.kind === "group" ? "0.08em" : undefined}
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Detail panel */}
            <div className="mt-5 min-h-[168px] rounded-[24px] border border-rule bg-white p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                  <div className="max-w-2xl">
                    <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-gold-dark">{current.detail.eyebrow}</p>
                    <h3 className="mt-2 font-serif text-[28px] font-medium leading-tight text-navy">{current.detail.title}</h3>
                    <p className="mt-3 text-[15.5px] leading-relaxed">{current.detail.text}</p>
                    {current.detail.relation && <p className="mt-2 text-[13.5px] text-muted">{current.detail.relation}</p>}
                  </div>
                  <PillLink href={current.detail.href} external={!!current.detail.external} variant="secondary" size="sm" arrow>
                    {current.detail.cta}
                  </PillLink>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* ---------- List (phones/tablets; screen-reader alternative on desktop) ---------- */}
          <Reveal delay={0.05} className="mt-10 lg:sr-only">
            <div className="relative overflow-hidden rounded-[20px] bg-navy p-5 text-white sm:p-6">
              <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-gold/20" />
              <p className="text-[11.5px] font-semibold uppercase tracking-[.12em] text-gold">{GROUP_DETAIL.eyebrow}</p>
              <h3 className="mt-1.5 text-[18px] font-semibold">{GROUP_DETAIL.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{GROUP_DETAIL.text}</p>
            </div>

            <ul className="mt-3 space-y-3">
              {MIDS.map((m) => {
                const kids = childrenOf(m.id);
                return (
                  <li key={m.id}>
                    <details className="group/d rounded-[20px] border border-rule bg-white transition-shadow open:shadow-[0_20px_40px_-28px_rgba(10,31,68,.4)]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0">
                          <span className="block text-[11.5px] font-semibold uppercase tracking-[.12em] text-gold-dark">
                            {KIND_LABEL[m.kind]}
                            {kids.length > 0 ? ` · ${kids.length} ${kids.length === 1 ? "item" : "items"}` : ""}
                          </span>
                          <span className="mt-1 block text-[16px] font-semibold leading-snug text-navy">{m.detail.title}</span>
                        </span>
                        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rule text-lg leading-none text-navy transition-transform duration-300 group-open/d:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="border-t border-rule px-5 pb-5 pt-4">
                        <p className="text-[15px] leading-relaxed">{m.detail.text}</p>
                        {m.detail.relation && <p className="mt-1 text-[13px] text-muted">{m.detail.relation}</p>}
                        <DetailLink d={m.detail} />
                        {kids.length > 0 && (
                          <ul className="mt-5 space-y-2.5">
                            {kids.map((k) => (
                              <li key={k.id} className="rounded-2xl bg-mist p-4">
                                <p className="text-[11.5px] font-semibold uppercase tracking-[.1em] text-gold-dark">{k.detail.eyebrow}</p>
                                <p className="mt-1 text-[15.5px] font-semibold text-navy">{k.detail.title}</p>
                                <p className="mt-1 text-[14.5px] leading-relaxed">{k.detail.text}</p>
                                <DetailLink d={k.detail} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}