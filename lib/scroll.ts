import { isSectionId } from "@/lib/sections";

export const HEADER_OFFSET = 88;

type HistoryMode = "push" | "replace" | "none";
type Options = { focus?: boolean; smooth?: boolean; history?: HistoryMode };

/** "/platforms", "#platforms", "/#platforms", "platforms" → "platforms"; "/" or "#" → "top". */
export function targetId(input: string): string {
  const clean = input.split("?")[0].replace(/^\/+|\/+$/g, "").replace(/^#/, "");
  return decodeURIComponent(clean) || "top";
}

export const pathForSection = (id: string): string => (id === "top" ? "/" : `/${id}`);

/** True when the current page is the homepage or one of its section URLs. */
export function onHomePage(): boolean {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  return p === "/" || isSectionId(p.slice(1));
}

/** Writes /section to the address bar (no reload). */
export function setSectionUrl(id: string, mode: HistoryMode): void {
  if (typeof window === "undefined" || mode === "none") return;
  if (id !== "top" && !isSectionId(id)) return;
  const path = pathForSection(id);
  const samePath = window.location.pathname === path;
  if (samePath && !window.location.hash) return;
  const url = path + window.location.search;
  if (mode === "push" && !samePath) window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

/** Scrolls to a section and (by default) updates the URL to /section. Returns false if not found. */
export function scrollToSection(input: string, opts: Options = {}): boolean {
  if (typeof window === "undefined") return false;
  const id = targetId(input);
  const el = id === "top" ? null : document.getElementById(id);
  if (id !== "top" && !el) return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smooth = (opts.smooth ?? true) && !reduced;
  const top = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0;

  window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "instant" });
  setSectionUrl(id, opts.history ?? "push");

  if (opts.focus && el) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  return true;
}

/** Kept for existing callers (ContactProvider, Header). Accepts "#id" or "/id". */
export function scrollToHash(hash: string, opts?: Options): void {
  scrollToSection(hash, opts);
}