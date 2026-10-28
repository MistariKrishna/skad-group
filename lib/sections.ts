import { MARKETS, PEOPLE } from "@/lib/data";

/** Homepage sections that get their own URL (/about, /platforms …), in page order. */
export const SECTION_TITLES: Record<string, string> = {
  about: "About the group",
  companies: "Companies",
  brands: "Brands",
  platforms: "Platforms & Ventures",
  approach: "How we build",
  industries: "Industries",
  ecosystem: "SKAD ecosystem",
  capabilities: "Capabilities",
  markets: "Global markets",
  people: "People",
  foundation: "Kalla Rudra Foundation",
  ventures: "Future ventures",
  insights: "Insights",
  partners: "Partner with SKAD",
  careers: "Careers",
  contact: "Contact",
};

// Sections that are hidden while their data is empty don't get a URL either
const HIDDEN = new Set<string>([
  ...(PEOPLE.length === 0 ? ["people"] : []),
  ...(MARKETS.length === 0 ? ["markets"] : []),
]);

export const SECTION_IDS: string[] = Object.keys(SECTION_TITLES).filter((id) => !HIDDEN.has(id));

export const isSectionId = (id: string): boolean => SECTION_IDS.includes(id);