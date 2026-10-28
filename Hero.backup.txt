"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import Media from "@/components/ui/Media";
import { BRANDS, FACTS, HERO, type BrandKey } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BOUNCE = { type: "spring" as const, stiffness: 520, damping: 14 };
const LINES = ["Building businesses.", "Creating brands.", "Shaping the future."];

const BRAND_FONT: Record<BrandKey, string> = {
  detara: "font-bodoni tracking-[.2em]",
  luxora: "font-display italic text-[24px]",
  benavi: "font-light tracking-[.26em]",
  rupaari: "font-display font-semibold tracking-[.06em] text-[24px]",
  casesuno: "font-mono text-[17px]",
  zemo: "font-archivo tracking-[-.02em]",
};
const BRAND_LABEL: Partial<Record<BrandKey, string>> = { luxora: "Luxora Glow", casesuno: "CASE_SUNO" };

/* ---------- Count-up for numeric facts ---------- */
function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const target = Number.parseInt(value, 10);
  const isNumber = !Number.isNaN(target) && String(target) === value;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isNumber || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(target);
      return;
    }
    const ctrl = animate(0, target, { duration: 1.2, delay, ease: EASE, onUpdate: (v) => setCurrent(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, isNumber, target, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {isNumber ? current : value}
    </span>
  );
}

/* ---------- Floating info card ---------- */
function InfoCard({ icon, title, text, className, delay }: { icon: "building" | "spark"; title: string; text: string; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
      className={clsx("absolute z-10 hidden sm:block", className)}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
        whileHover={{ scale: 1.04 }}
        className="flex items-center gap-3 rounded-2xl border border-rule bg-white/95 py-3 pl-3 pr-5 shadow-[0_24px_48px_-24px_rgba(10,31,68,.45)] backdrop-blur"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
          {icon === "building" ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 21V5l8-3 8 3v16" />
              <path d="M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />
            </svg>
          )}
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-navy">{title}</span>
          <span className="block text-[12.5px] text-muted">{text}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <>
      <section ref={ref} id="top" aria-labelledby="hero-h" className="px-3 pt-3 sm:px-4">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-mist">
          {/* Subtle dot texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(10,31,68,.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
          />

          <div className="relative grid gap-12 px-6 pb-8 pt-12 sm:px-10 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pb-10 lg:pt-20">
            {/* ---------- Text ---------- */}
            <motion.div style={{ y: textY }} className="flex flex-col justify-center lg:col-span-6 lg:pr-8">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 }}
                className="inline-flex items-center gap-2.5 self-start rounded-full border border-rule bg-white px-3.5 py-1.5 text-[13px] font-medium text-navy shadow-[0_6px_16px_-10px_rgba(10,31,68,.35)]"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                A diversified business group
              </motion.span>

              <h1 id="hero-h" className="mt-7 font-serif text-[clamp(40px,5.2vw,68px)] font-medium leading-[1.05] tracking-[-0.01em] text-navy">
                {LINES.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.08em]">
                    <motion.span
                      className="relative inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.15 + i * 0.1 }}
                    >
                      {line}
                      {i === LINES.length - 1 && (
                        <motion.span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gold"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
                        />
                      )}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
                className="mt-7 max-w-xl text-lg leading-relaxed text-body"
              >
                SKAD GROUP is a diversified business group building companies, brands, technology platforms and ventures across markets.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <motion.a
                  href="#companies"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={BOUNCE}
                  className="group inline-flex items-center gap-3 rounded-full bg-navy py-2.5 pl-6 pr-2.5 text-[15px] font-medium text-white shadow-[0_16px_32px_-16px_rgba(10,31,68,.7)] transition-colors hover:bg-navy-soft"
                >
                  Explore the group
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </motion.a>
                <motion.a
                  href="#partners"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={BOUNCE}
                  className="inline-flex items-center rounded-full border border-navy/15 bg-white px-6 py-3.5 text-[15px] font-medium text-navy transition-colors hover:border-navy/40"
                >
                  Partner with SKAD
                </motion.a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.85 }}
                className="mt-8 flex items-center gap-2.5 text-[14px] text-muted"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Group companies registered in India and the United Kingdom
              </motion.p>
            </motion.div>

            {/* ---------- Image ---------- */}
            <div className="relative lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 110, damping: 20, delay: 0.15 }}
                className="relative aspect-[4/3] overflow-hidden rounded-[22px] shadow-[0_40px_80px_-40px_rgba(10,31,68,.5)] lg:aspect-auto lg:h-full lg:min-h-[540px]"
              >
                <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-x-0 -inset-y-12">
                  <Media src={HERO.image} alt={HERO.imageAlt} label={HERO.imageLabel} priority className="h-full w-full" />
                </motion.div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/30 to-transparent" />
              </motion.div>

              <InfoCard
                icon="building"
                title="4 operating companies"
                text="India & United Kingdom"
                className="-left-6 bottom-10 lg:-left-12"
                delay={0.9}
              />
              <InfoCard
                icon="spark"
                title="6 consumer brands"
                text="Jewellery · Beauty · Fashion · Legal tech"
                className="-right-3 top-8 lg:-right-6"
                delay={1.05}
              />
            </div>
          </div>

          {/* ---------- Fact cards ---------- */}
          <ul className="relative grid grid-cols-2 gap-3 px-6 pb-6 sm:px-10 md:grid-cols-4 lg:px-14 lg:pb-12">
            {FACTS.map((f, i) => (
              <motion.li
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 + i * 0.08 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={BOUNCE}
                  className="h-full rounded-2xl border border-rule bg-white p-5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(10,31,68,.35)]"
                >
                  <p className="font-serif text-[34px] font-medium leading-none text-navy md:text-[38px]">
                    <CountUp value={f.value} delay={0.8 + i * 0.08} />
                  </p>
                  <p className="mt-2 text-[13.5px] text-muted">{f.label}</p>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Brands strip ---------- */}
      <section aria-label="Brands of the group" className="py-10 md:py-12">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <p className="shrink-0 text-[12.5px] font-semibold uppercase tracking-[.14em] text-muted">Brands of the group</p>
          <ul className="flex flex-wrap items-center gap-x-9 gap-y-4 md:justify-end">
            {BRANDS.map((b, i) => (
              <motion.li
                key={b.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 22, delay: i * 0.06 }}
              >
                <motion.a href="#brands" aria-label={b.name} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} transition={BOUNCE} className="block">
                  {b.logo ? (
                    <Image
                      src={b.logo}
                      alt={b.name}
                      width={120}
                      height={40}
                      className="h-8 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                    />
                  ) : (
                    <span className={clsx("block text-[21px] leading-none text-[#8A93A2] transition-colors duration-300 hover:text-navy", BRAND_FONT[b.key])}>
                      {BRAND_LABEL[b.key] ?? b.name}
                    </span>
                  )}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}