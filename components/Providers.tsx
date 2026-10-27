"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ContactProvider } from "@/components/providers/ContactProvider";
import { onHomePage, scrollToSection, setSectionUrl, targetId } from "@/lib/scroll";
import { SECTION_IDS, isSectionId } from "@/lib/sections";

/** Clean section URLs (/platforms) for the one-page homepage. */
function useSectionUrls() {
  // 1. Opening /platforms (or an old /#platforms link): jump to that section
  useEffect(() => {
    if (!onHomePage()) return;
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

    const hash = window.location.hash.slice(1);
    const id = hash || targetId(window.location.pathname);
    if (id === "top") return;

    let landedAt = -1;
    const run = () => {
      if (scrollToSection(id, { smooth: false, history: "replace" })) landedAt = window.scrollY;
    };
    const t = window.setTimeout(run, 60);
    // Re-align once images have loaded, unless the visitor has already scrolled away
    const onLoad = () => {
      if (landedAt < 0 || Math.abs(window.scrollY - landedAt) < 4) run();
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // 2. Clicks on /section or #section links: smooth scroll + /section URL, no reload
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      if (!onHomePage()) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const path = url.pathname.replace(/\/+$/, "") || "/";
      const homeLike = path === "/" || isSectionId(path.slice(1));
      let id: string | null = null;
      if (url.hash && homeLike) id = url.hash.slice(1);
      else if (path === "/") id = "top";
      else if (isSectionId(path.slice(1))) id = path.slice(1);
      if (!id) return; // e.g. /legal/privacy → normal navigation

      const trackable = id === "top" || isSectionId(id);
      if (scrollToSection(id, { focus: id !== "top", history: trackable ? "push" : "none" })) {
        e.preventDefault();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 3. Back / forward buttons
  useEffect(() => {
    const onPop = () => {
      if (!onHomePage()) return;
      scrollToSection(window.location.hash.slice(1) || targetId(window.location.pathname), { history: "none" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // 4. Keep the URL in step with the section being read
  useEffect(() => {
    if (!onHomePage()) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const first = els[0];
    let current = "";

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            if (current !== en.target.id) {
              current = en.target.id;
              setSectionUrl(current, "replace");
            }
          } else if (en.target === first && en.boundingClientRect.top > 0 && current !== "top") {
            current = "top"; // back above the first section (hero)
            setSectionUrl("top", "replace");
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Providers({ children }: { children: ReactNode }) {
  useSectionUrls();
  return (
    <MotionConfig reducedMotion="user">
      <ContactProvider>{children}</ContactProvider>
    </MotionConfig>
  );
}