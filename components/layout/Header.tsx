"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, type Variants } from "framer-motion";
import clsx from "clsx";
import Logo from "@/components/ui/Logo";
import { useContact } from "@/components/providers/ContactProvider";
import { CONTACT_DETAILS, MEGA, NAV, type MegaKey } from "@/lib/data";
import { scrollToHash } from "@/lib/scroll";
import { useFocusTrap } from "@/lib/useFocusTrap";

/* ---------- Tuning ---------- */
const FLOAT_MAX_WIDTH = 1280; // max width of the floating bar (px)
const FLOAT_SIDE_GAP = 12; //    gap from screen edges when floating (px)
const FLOAT_TOP_GAP = 12; //     gap from top when floating (px)
const FLOAT_RADIUS = 18; //      corner radius when floating (px)
const UTILITY_HEIGHT = 36; //    utility bar height (px)
const SCROLL_ON = 16; //         start floating after this scroll (px)
const SCROLL_OFF = 4; //         stop floating below this (px) – prevents flicker

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** One shared timing for everything that changes on scroll, so it all moves together. */
const SHAPE = { duration: 0.5, ease: EASE };
const BOUNCE = { type: "spring" as const, stiffness: 520, damping: 14 };
const GLIDE = { type: "spring" as const, stiffness: 480, damping: 22 };

const MEGA_ORDER: MegaKey[] = ["group", "companies", "brands", "platforms"];
const UTILITY = [
  { label: "Careers", href: "/careers" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];
const slide: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE } },
  exit: (d: number) => ({ opacity: 0, x: d * -28, transition: { duration: 0.18, ease: EASE } }),
};

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      animate={{ rotate: open ? 180 : 0 }}
      transition={BOUNCE}
      className={clsx("h-3 w-3", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 4.5L6 7.5L9 4.5" />
    </motion.svg>
  );
}

export default function Header() {
  const { startRoute } = useContact();
  const { email, phone } = CONTACT_DETAILS;

  const [scrolled, setScrolled] = useState(false);
  const [vw, setVw] = useState<number | null>(null);
  const [menu, setMenu] = useState<MegaKey | null>(null);
  const [dir, setDir] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const trap = useFocusTrap(panelRef);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  /* ---------- Viewport width (measured before paint → no jump) ---------- */
  useIsoLayoutEffect(() => {
    const onResize = () => setVw(document.documentElement.clientWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------- Scroll behaviour (with hysteresis) ---------- */
  useIsoLayoutEffect(() => {
    setScrolled(window.scrollY > SCROLL_ON);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled((prev) => (prev ? y > SCROLL_OFF : y > SCROLL_ON));
  });

  /* ---------- Active section ---------- */
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.href.slice(1))).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ---------- Keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Close drawer if resized to desktop ---------- */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ---------- Mobile drawer lock & focus (always cleaned up) ---------- */
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      body.style.overflow = "";
      body.style.paddingRight = "";
      burgerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  /* ---------- Mega menu helpers ---------- */
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };
  const openMenu = (key: MegaKey | null) => {
    cancelClose();
    if (key && menu && key !== menu) {
      setDir(Math.sign(MEGA_ORDER.indexOf(key) - MEGA_ORDER.indexOf(menu)));
    } else if (key && !menu) {
      setDir(0);
    }
    setMenu(key);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setMenu(null);
      setHover(null);
    }, 180);
  };
  const closeMenu = () => {
    cancelClose();
    setMenu(null);
    setHover(null);
  };
  const go = (href: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToHash(href), 60);
  };

  const panel = menu ? MEGA[menu] : null;
  const floating = scrolled;

  const barShape =
    vw === null
      ? undefined
      : {
          maxWidth: floating ? Math.min(FLOAT_MAX_WIDTH, vw - FLOAT_SIDE_GAP * 2) : vw,
          marginTop: floating ? FLOAT_TOP_GAP : 0,
          borderRadius: floating ? FLOAT_RADIUS : 0,
        };

  return (
    <>
      <a href="#main" className="fixed left-4 top-[-100px] z-[100] bg-navy px-4 py-3 text-sm font-medium text-white focus:top-4">
        Skip to content
      </a>

      {/* Spacer: keeps page content below the fixed header */}
      <div aria-hidden="true" className="h-[76px] xl:h-[112px]" />

      <motion.header
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMenu();
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* ---------- Utility bar (desktop) ---------- */}
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : UTILITY_HEIGHT, opacity: scrolled ? 0 : 1 }}
          transition={SHAPE}
          className="hidden overflow-hidden bg-navy-deep text-[12.5px] text-white/70 xl:block"
        >
          <div className="container-x flex h-9 items-center justify-between">
            <p className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
              A diversified business group
            </p>
            <div className="flex items-center gap-6">
              {email && (
                <a href={`mailto:${email}`} tabIndex={scrolled ? -1 : 0} className="transition-colors hover:text-white">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, "")}`} tabIndex={scrolled ? -1 : 0} className="transition-colors hover:text-white">
                  {phone}
                </a>
              )}
              {(email || phone) && <span aria-hidden="true" className="h-3 w-px bg-white/20" />}
              {UTILITY.map((u) => (
                <a key={u.href} href={u.href} tabIndex={scrolled ? -1 : 0} className="transition-colors hover:text-white">
                  {u.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---------- Main bar (full width → floating rounded) ---------- */}
        <motion.div
          initial={false}
          animate={barShape}
          transition={SHAPE}
          style={{ maxWidth: "100%" }}
          className={clsx(
            "relative mx-auto border backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            floating
              ? "border-rule bg-white/85 shadow-[0_18px_40px_-22px_rgba(10,31,68,.4)]"
              : "border-transparent border-b-rule bg-white shadow-[0_18px_40px_-22px_rgba(10,31,68,0)]",
          )}
        >
          <div
            className={clsx(
              "mx-auto flex items-center justify-between gap-6 transition-[height,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              floating ? "h-16 max-w-none px-4 sm:px-6" : "h-[76px] max-w-content px-5 sm:px-8",
            )}
          >
            <a href="#top" aria-label="SKAD GROUP home" onClick={closeMenu} className="shrink-0">
              <Logo />
            </a>

            <nav aria-label="Primary" className="hidden h-full xl:block">
              <ul className="flex h-full items-center gap-0.5" onMouseLeave={() => !menu && setHover(null)}>
                {NAV.map((n) => {
                  const isOpen = n.mega !== undefined && menu === n.mega;
                  const isActive = active === n.href;
                  return (
                    <li key={n.href} className="relative flex h-full items-center">
                      {/* Sliding highlight – only animates on hover changes, not while the bar resizes */}
                      {hover === n.href && (
                        <motion.span
                          layoutId="nav-hover"
                          layoutDependency={hover}
                          className="absolute inset-x-0 top-[calc(50%-18px)] h-9 rounded-full bg-navy/[0.07]"
                          transition={GLIDE}
                        />
                      )}
                      <motion.a
                        href={n.href}
                        onMouseEnter={() => {
                          setHover(n.href);
                          openMenu(n.mega ?? null);
                        }}
                        onFocus={() => {
                          setHover(n.href);
                          openMenu(n.mega ?? null);
                        }}
                        onClick={closeMenu}
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.93 }}
                        transition={BOUNCE}
                        aria-expanded={n.mega ? isOpen : undefined}
                        aria-haspopup={n.mega ? "true" : undefined}
                        aria-current={isActive ? "true" : undefined}
                        className={clsx(
                          "relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-200",
                          isOpen || isActive ? "text-navy" : "text-body hover:text-navy",
                        )}
                      >
                        {n.label}
                        {n.mega && <Chevron open={isOpen} className="text-muted" />}
                      </motion.a>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          layoutDependency={active}
                          className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-gold"
                          transition={GLIDE}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <motion.a
                href="#partners"
                onClick={closeMenu}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={BOUNCE}
                className={clsx(
                  "btn btn-primary hidden gap-3 py-2.5 pl-5 pr-2.5 transition-[border-radius] duration-500 xl:inline-flex",
                  floating && "rounded-full",
                )}
              >
                Partner with SKAD
                <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm">
                  →
                </span>
              </motion.a>
              <motion.button
                ref={burgerRef}
                type="button"
                onClick={() => setOpen(true)}
                whileTap={{ scale: 0.9 }}
                transition={BOUNCE}
                aria-label="Open menu"
                aria-expanded={open}
                className="group flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-rule transition-colors hover:border-navy/30 hover:bg-mist xl:hidden"
              >
                <span className="block h-[1.5px] w-5 bg-navy transition-all duration-300 group-hover:w-4" />
                <span className="block h-[1.5px] w-5 bg-navy" />
                <span className="block h-[1.5px] w-5 bg-navy transition-all duration-300 group-hover:w-3" />
              </motion.button>
            </div>
          </div>

          {/* Scroll progress (clipped to the rounded corners) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
            <motion.div className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold" style={{ scaleX: progress }} />
          </div>

          {/* ---------- Mega menu ---------- */}
          <AnimatePresence>
            {panel && menu && (
              <motion.div
                key="mega"
                initial={{ opacity: 0, y: -8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.985 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{ transformOrigin: "top center" }}
                // pt-2 = invisible hover bridge so the menu doesn't close when moving the mouse into it
                className={clsx("absolute inset-x-0 top-full hidden xl:block", floating && "pt-2")}
              >
                <div
                  className={clsx(
                    "overflow-hidden bg-white",
                    floating
                      ? "rounded-[18px] border border-rule shadow-[0_30px_60px_-30px_rgba(10,31,68,.45)]"
                      : "border-b border-rule shadow-[0_40px_60px_-40px_rgba(10,31,68,.4)]",
                  )}
                >
                  <div className="mx-auto max-w-content overflow-hidden px-8 py-10">
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={menu}
                        custom={dir}
                        variants={slide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-10"
                      >
                        {/* Intro */}
                        <div className="flex flex-col">
                          <p className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold-dark">{panel.label}</p>
                          <p className="mt-3 font-serif text-[24px] leading-snug text-navy">{panel.intro}</p>
                          <a href={panel.all} onClick={closeMenu} className="link-arrow mt-6 self-start text-[14px]">
                            View all <span aria-hidden="true">→</span>
                          </a>
                        </div>

                        {/* Links */}
                        <motion.ul
                          initial="hidden"
                          animate="show"
                          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
                          className="grid grid-cols-2 content-start gap-x-3 gap-y-1"
                        >
                          {panel.links.map((l) => (
                            <motion.li
                              key={`${l.href}-${l.t}`}
                              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 24 } } }}
                            >
                              <motion.a
                                href={l.href}
                                onClick={closeMenu}
                                whileHover={{ x: 4 }}
                                transition={BOUNCE}
                                className="group/link flex items-start justify-between gap-3 rounded-[10px] px-3.5 py-3 transition-colors duration-200 hover:bg-mist"
                              >
                                <span>
                                  <span className="block text-[15px] font-medium text-navy">{l.t}</span>
                                  {l.s && <span className="mt-0.5 block text-[13px] text-muted">{l.s}</span>}
                                </span>
                                <span
                                  aria-hidden="true"
                                  className="mt-0.5 -translate-x-1 text-gold-dark opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                >
                                  →
                                </span>
                              </motion.a>
                            </motion.li>
                          ))}
                        </motion.ul>

                        {/* Featured */}
                        <motion.div
                          whileHover={{ y: -4 }}
                          transition={BOUNCE}
                          className="group/feat relative flex flex-col justify-between gap-8 overflow-hidden rounded-[12px] bg-navy p-6 text-white"
                        >
                          <span aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-gold/20 transition-transform duration-500 group-hover/feat:scale-110" />
                          <span aria-hidden="true" className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-gold/30 transition-transform duration-500 group-hover/feat:scale-125" />
                          <div className="relative">
                            <p className="text-[12px] font-semibold uppercase tracking-[.14em] text-gold">Featured</p>
                            <p className="mt-3 font-serif text-[21px] leading-snug">{panel.featured.title}</p>
                          </div>
                          {panel.featured.route ? (
                            <button
                              type="button"
                              onClick={() => {
                                closeMenu();
                                startRoute(panel.featured.route ?? "General");
                              }}
                              className="relative inline-flex items-center gap-2 self-start text-[14px] font-medium text-white"
                            >
                              Get started
                              <span aria-hidden="true" className="transition-transform duration-300 group-hover/feat:translate-x-1">→</span>
                            </button>
                          ) : (
                            <a href={panel.featured.href} onClick={closeMenu} className="relative inline-flex items-center gap-2 self-start text-[14px] font-medium text-white">
                              Explore
                              <span aria-hidden="true" className="transition-transform duration-300 group-hover/feat:translate-x-1">→</span>
                            </a>
                          )}
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

      {/* Dim the page while a mega menu is open */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key="mega-overlay"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 hidden bg-navy-deep/20 backdrop-blur-[2px] xl:block"
          />
        )}
      </AnimatePresence>

      {/* ---------- Mobile drawer ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div key="drawer" className="fixed inset-0 z-[60] xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="absolute inset-0 bg-navy-deep/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              onKeyDown={trap}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl"
            >
              <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-rule px-6">
                <Logo />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-2xl leading-none text-navy transition-transform duration-300 hover:rotate-90"
                >
                  ×
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-2">
                <ul>
                  {NAV.map((n) => {
                    const sub = n.mega ? MEGA[n.mega].links : null;
                    const isOpen = openGroup === n.href;
                    return (
                      <li key={n.href} className="border-b border-rule">
                        {sub ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setOpenGroup(isOpen ? null : n.href)}
                              aria-expanded={isOpen}
                              className="flex min-h-[58px] w-full items-center justify-between text-left text-[17px] font-medium text-navy"
                            >
                              {n.label}
                              <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full border border-rule transition-colors", isOpen && "bg-mist")}>
                                <Chevron open={isOpen} />
                              </span>
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  key="sub"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col pb-4">
                                    {[{ t: "Overview", href: n.href }, ...sub].map((l) => (
                                      <a
                                        key={`${l.href}-${l.t}`}
                                        href={l.href}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          go(l.href);
                                        }}
                                        className="flex min-h-[44px] items-center rounded-[8px] px-3 text-[15px] text-body transition-colors hover:bg-mist hover:text-navy"
                                      >
                                        {l.t}
                                      </a>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <a
                            href={n.href}
                            onClick={(e) => {
                              e.preventDefault();
                              go(n.href);
                            }}
                            className="flex min-h-[58px] items-center justify-between text-[17px] font-medium text-navy"
                          >
                            {n.label}
                            <span aria-hidden="true" className="text-muted">→</span>
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="space-y-4 border-t border-rule p-6">
                <a
                  href="#partners"
                  onClick={(e) => {
                    e.preventDefault();
                    go("#partners");
                  }}
                  className="btn btn-primary w-full"
                >
                  Partner with SKAD <span aria-hidden="true">→</span>
                </a>
                {(email || phone) && (
                  <div className="space-y-1 text-center text-[14px] text-muted">
                    {email && <a href={`mailto:${email}`} className="block hover:text-navy">{email}</a>}
                    {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="block hover:text-navy">{phone}</a>}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}