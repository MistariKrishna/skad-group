"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { PillRoute } from "@/components/ui/Pill";
import { MARKETS, MARKET_STATUS, type Market } from "@/lib/data";
import { MAP_H, MAP_W, project } from "@/lib/geo";
import { BOUNCE, EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Layout maths (runs once, identical on server and client)            */
/* ------------------------------------------------------------------ */
type Align = "start" | "center" | "end";
type Placed = Market & { x: number; y: number; align: Align; below: boolean };
type SetActive = (key: string | null) => void;

const BASE = MARKETS.map((m) => ({ ...m, ...project(m.lon, m.lat) }));

/** Region shown on small screens: our markets plus breathing room for pins and tooltips. */
function computeCrop() {
  if (BASE.length === 0) return { x: 0, y: 0, w: MAP_W, h: MAP_H };
  const PAD_X = 45;
  const PAD_TOP = 55;
  const PAD_BOTTOM = 35;
  const MIN_W = 320;
  const MAX_RATIO = 2.1;

  let x0 = Math.min(...BASE.map((m) => m.x)) - PAD_X;
  let x1 = Math.max(...BASE.map((m) => m.x)) + PAD_X;
  let y0 = Math.min(...BASE.map((m) => m.y)) - PAD_TOP;
  let y1 = Math.max(...BASE.map((m) => m.y)) + PAD_BOTTOM;

  if (x1 - x0 < MIN_W) {
    const c = (x0 + x1) / 2;
    x0 = c - MIN_W / 2;
    x1 = c + MIN_W / 2;
  }
  if ((x1 - x0) / (y1 - y0) > MAX_RATIO) {
    const need = (x1 - x0) / MAX_RATIO;
    const c = (y0 + y1) / 2;
    y0 = c - need / 2;
    y1 = c + need / 2;
  }

  const w = Math.min(x1 - x0, MAP_W);
  const h = Math.min(y1 - y0, MAP_H);
  return {
    x: Math.max(0, Math.min(x0, MAP_W - w)),
    y: Math.max(0, Math.min(y0, MAP_H - h)),
    w,
    h,
  };
}

const CROP = computeCrop();

const PLACED: Placed[] = BASE.map((m) => {
  // Position inside the zoomed view decides where the tooltip opens (also works for the full map)
  const fx = (m.x - CROP.x) / CROP.w;
  const fy = (m.y - CROP.y) / CROP.h;
  const align: Align = fx < 0.28 ? "start" : fx > 0.72 ? "end" : "center";
  return { ...m, align, below: fy < 0.5 };
});

const HUB = PLACED.find((m) => m.hub) ?? PLACED.find((m) => m.status === "presence");

/** CSS variables: mobile shows the crop, md+ shows the full world. */
const VIEW_VARS = {
  "--ma": `${CROP.w} / ${CROP.h}`,
  "--da": `${MAP_W} / ${MAP_H}`,
  "--mw": `${(MAP_W / CROP.w) * 100}%`,
  "--mh": `${(MAP_H / CROP.h) * 100}%`,
  "--ml": `${(-CROP.x / CROP.w) * 100}%`,
  "--mt": `${(-CROP.y / CROP.h) * 100}%`,
} as CSSProperties;

/** Curved connection that arcs upward between two points. */
function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  return `M ${a.x} ${a.y} Q ${mx} ${my - dist * 0.3} ${b.x} ${b.y}`;
}

/* ------------------------------------------------------------------ */
/* Pin                                                                 */
/* ------------------------------------------------------------------ */
const PIN_PATH = "M12 0C5.37 0 0 5.3 0 11.86 0 20.75 12 32 12 32s12-11.25 12-20.14C24 5.3 18.63 0 12 0z";

function PinShape({ presence, hub }: { presence: boolean; hub: boolean }) {
  const fill = presence ? "#D4AF37" : "#FFFFFF";
  return (
    <svg
      viewBox="0 0 24 32"
      aria-hidden="true"
      className={clsx(
        "block drop-shadow-[0_6px_10px_rgba(0,0,0,.5)]",
        hub ? "h-[29px] w-[22px] sm:h-[42px] sm:w-8" : "h-[21px] w-4 sm:h-8 sm:w-6",
      )}
    >
      <path d={PIN_PATH} fill={fill} />
      <circle cx="12" cy="12" r={hub ? 5.2 : 4.4} fill="#07152F" />
      {hub && <circle cx="12" cy="12" r="2" fill={fill} />}
    </svg>
  );
}

const ALIGN_CLASS: Record<Align, string> = {
  start: "-translate-x-4",
  center: "-translate-x-1/2",
  end: "-translate-x-[calc(100%-16px)]",
};

function Pin({ m, index, active, setActive }: { m: Placed; index: number; active: string | null; setActive: SetActive }) {
  const on = active === m.key;
  const isHub = HUB?.key === m.key;
  const presence = m.status === "presence";

  return (
    <div
      className="absolute h-0 w-0"
      style={{ left: `${(m.x / MAP_W) * 100}%`, top: `${(m.y / MAP_H) * 100}%`, zIndex: on ? 30 : isHub ? 20 : 10 }}
    >
      {presence && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold/50 [animation-duration:2.6s] sm:h-3 sm:w-3"
        />
      )}

      {/* Anchor: the pin tip sits exactly on the location */}
      <div className="absolute bottom-0 left-0 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 420, damping: 15, delay: 0.45 + index * 0.08 }}
        >
          <motion.button
            type="button"
            aria-label={`${m.country}: ${MARKET_STATUS[m.status].label}${m.note ? `, ${m.note}` : ""}`}
            aria-pressed={on}
            onMouseEnter={() => setActive(m.key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(m.key)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(on ? null : m.key)}
            animate={{ y: on ? -4 : 0, scale: on ? 1.12 : 1 }}
            whileTap={{ scale: 0.92 }}
            transition={BOUNCE}
            style={{ transformOrigin: "50% 100%" }}
            className="relative block rounded-full before:absolute before:-inset-2 before:content-['']"
          >
            <PinShape presence={presence} hub={isHub} />
          </motion.button>
        </motion.div>
      </div>

      {/* Tooltip (outer div positions, inner div animates) */}
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute left-0",
          ALIGN_CLASS[m.align],
          m.below ? "top-2.5" : isHub ? "bottom-9 sm:bottom-[54px]" : "bottom-7 sm:bottom-11",
        )}
      >
        <AnimatePresence>
          {on && (
            <motion.div
              initial={{ opacity: 0, y: m.below ? -6 : 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: m.below ? -6 : 6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="w-max max-w-[210px] rounded-xl bg-white px-3 py-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,.6)] sm:max-w-none sm:px-3.5 sm:py-2.5"
            >
              <p className="text-[13px] font-semibold leading-snug text-navy sm:text-[14px]">{m.country}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted sm:text-[12px]">
                <span className={clsx("h-2 w-2 shrink-0 rounded-full", presence ? "bg-gold" : "border-[1.5px] border-navy")} />
                {MARKET_STATUS[m.status].label}
              </p>
              {m.note && <p className="mt-1 text-[11.5px] leading-snug text-body sm:whitespace-nowrap sm:text-[12px]">{m.note}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* List (also the accessible alternative to the map)                   */
/* ------------------------------------------------------------------ */
function MarketItem({ m, active, setActive, onSelect }: { m: Placed; active: string | null; setActive: SetActive; onSelect: (m: Placed) => void }) {
  const on = active === m.key;
  const presence = m.status === "presence";
  return (
    <li>
      <motion.button
        type="button"
        aria-pressed={on}
        onMouseEnter={() => setActive(m.key)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(m.key)}
        onBlur={() => setActive(null)}
        onClick={() => onSelect(m)}
        animate={{ x: on ? 4 : 0 }}
        transition={BOUNCE}
        className={clsx(
          "flex w-full items-center gap-3.5 rounded-2xl border p-3 text-left transition-colors duration-300 sm:gap-4 sm:p-3.5",
          on ? "border-gold/50 bg-white/[0.08]" : "border-white/10 bg-white/[0.03] hover:border-white/20",
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[12.5px] font-semibold tracking-[.08em] sm:h-11 sm:w-11 sm:text-[13px]",
            presence ? "bg-gold text-navy-deep" : "border border-white/25 text-white",
          )}
        >
          {m.code}
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-medium text-white sm:text-[16px]">{m.country}</span>
          <span className="mt-0.5 block truncate text-[12.5px] leading-snug text-white/55 sm:text-[13px]">
            {m.note || MARKET_STATUS[m.status].label}
          </span>
        </span>
      </motion.button>
    </li>
  );
}

function MarketGroup({ title, items, active, setActive, onSelect }: { title: string; items: Placed[]; active: string | null; setActive: SetActive; onSelect: (m: Placed) => void }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold">{title}</h3>
        <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[12px] text-white/60">{items.length}</span>
      </div>
      <ul className="mt-4 grid gap-2.5 min-[480px]:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {items.map((m) => (
          <MarketItem key={m.key} m={m} active={active} setActive={setActive} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}

function LegendPin({ presence }: { presence: boolean }) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden="true" className="h-4 w-3 shrink-0">
      <path d={PIN_PATH} fill={presence ? "#D4AF37" : "#FFFFFF"} />
      <circle cx="12" cy="12" r="4.4" fill="#07152F" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Markets({ map }: { map?: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  if (PLACED.length === 0) return null;

  const presence = PLACED.filter((m) => m.status === "presence");
  const partners = PLACED.filter((m) => m.status === "partner");

  // Touch devices: tapping a list item brings the map into view with that pin's tooltip open
  const select = (m: Placed) => {
    setActive(m.key);
    if (!window.matchMedia("(hover: none)").matches) return;
    const el = mapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: Math.max(0, window.scrollY + r.top - Math.max(96, (window.innerHeight - r.height) / 2)),
        behavior: reduced ? "auto" : "smooth",
      });
    }
  };

  return (
    <section id="markets" aria-labelledby="mk-h" className="px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[24px] bg-navy-deep py-16 sm:rounded-[28px] md:py-28">
        <span aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-gold/10" />
        <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border border-gold/15" />

        <div className="container-x relative">
          <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionHeading
                id="mk-h"
                light
                eyebrow="Global markets"
                title="Where we work"
                intro="Our presence across markets, and the countries where we work with official partners."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <PillRoute route="International Trade" variant="light" arrow>Discuss international trade</PillRoute>
            </Reveal>
          </div>

          {/* Map card */}
          <Reveal delay={0.05} className="mt-10 md:mt-14">
            <div
              ref={mapRef}
              className="overflow-hidden rounded-[20px] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(22,48,92,.55),rgba(7,21,47,0)_70%)] sm:rounded-[24px]"
            >
              <div className="px-2 py-5 sm:px-5 sm:py-8 md:px-8 md:py-12">
                {/* Viewport: cropped on mobile, full world from md */}
                <div
                  style={VIEW_VARS}
                  className="relative w-full overflow-hidden aspect-[var(--ma)] md:overflow-visible md:aspect-[var(--da)]"
                >
                  <div className="absolute left-[var(--ml)] top-[var(--mt)] h-[var(--mh)] w-[var(--mw)] md:left-0 md:top-0 md:h-full md:w-full">
                    {/* World network (server-rendered SVG) */}
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 1.2, ease: EASE }}
                    >
                      {map}
                    </motion.div>

                    {/* Connections from the hub */}
                    {HUB && (
                      <svg
                        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 h-full w-full"
                      >
                        {PLACED.filter((m) => m.key !== HUB.key).map((m, i) => {
                          const on = active === m.key || active === HUB.key;
                          const presenceArc = m.status === "presence";
                          return (
                            <motion.path
                              key={`arc-${m.key}`}
                              d={arc(HUB, m)}
                              fill="none"
                              stroke={presenceArc ? "#D4AF37" : "#FFFFFF"}
                              strokeWidth={on ? 2 : 1.3}
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              viewport={{ once: true, amount: 0.2 }}
                              transition={{ duration: 1.6, ease: EASE, delay: 0.4 + i * 0.12 }}
                              style={{ opacity: on ? 1 : presenceArc ? 0.65 : 0.4, transition: "opacity .3s ease" }}
                            />
                          );
                        })}
                      </svg>
                    )}

                    {/* Pins */}
                    {PLACED.map((m, i) => (
                      <Pin key={m.key} m={m} index={i} active={active} setActive={setActive} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 px-4 py-3.5 text-[12.5px] text-white/65 sm:px-5 sm:py-4 sm:text-[13px] md:px-8">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="inline-flex items-center gap-2"><LegendPin presence />{MARKET_STATUS.presence.plural}</span>
                  <span className="inline-flex items-center gap-2"><LegendPin presence={false} />{MARKET_STATUS.partner.plural}</span>
                </div>
                <p className="text-white/45 md:hidden">Tap a pin for details</p>
              </div>
            </div>
          </Reveal>

          {/* Lists */}
          <Reveal delay={0.1} className="mt-8 grid gap-8 md:grid-cols-2">
            <MarketGroup title={MARKET_STATUS.presence.plural} items={presence} active={active} setActive={setActive} onSelect={select} />
            <MarketGroup title={MARKET_STATUS.partner.plural} items={partners} active={active} setActive={setActive} onSelect={select} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}