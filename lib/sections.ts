import { MARKETS, PEOPLE } from "@/lib/data";

type SectionMeta = { title: string; description: string };

/** Homepage sections that get their own URL (/about, /platforms …), in page order. */
export const SECTIONS: Record<string, SectionMeta> = {
  about: {
    title: "About the Group",
    description: "SKAD GROUP is a diversified business group building companies, brands, technology platforms and ventures across markets. Build, connect, scale.",
  },
  companies: {
    title: "Our Companies",
    description: "The companies of SKAD GROUP: SKAD Jewels India, Luxora Glow Essentials, DETARA Ltd (London) and SKAD Diatech Exports.",
  },
  brands: {
    title: "Our Brands",
    description: "Brands of SKAD GROUP: DETARA fine jewellery, LUXORA GLOW beauty, BENAVI silver jewellery, RUPAARI sarees, CASE SUNO legal tech and ZEMO fashion.",
  },
  platforms: {
    title: "Platforms & Ventures",
    description: "SKAD CommerceOS and SKAD Commerce Lab: technology, commerce infrastructure and AI-plus-human execution for building and growing businesses.",
  },
  approach: {
    title: "How We Build",
    description: "How SKAD GROUP builds businesses: discover, define, build, launch, grow and scale, from market research to international expansion.",
  },
  industries: {
    title: "Industries",
    description: "SKAD GROUP works across jewellery and diamonds, manufacturing, international trade, beauty, fashion, legal technology and commerce technology.",
  },
  ecosystem: {
    title: "The SKAD Ecosystem",
    description: "Explore how SKAD GROUP’s companies, brands and platforms connect, and the Kalla Rudra Foundation, the group’s impact entity.",
  },
  capabilities: {
    title: "Capabilities",
    description: "Capabilities across SKAD GROUP: product, brand, technology, commerce, manufacturing, trade, AI and growth.",
  },
  markets: {
    title: "Global Markets",
    description: "Where SKAD GROUP works: our presence and official partner countries across India, Europe, Asia and North America.",
  },
  people: {
    title: "Our People",
    description: "Meet the founder, leadership and team behind SKAD GROUP’s companies, brands and platforms.",
  },
  foundation: {
    title: "Kalla Rudra Foundation",
    description: "The Kalla Rudra Foundation is SKAD GROUP’s impact entity, supporting community programmes and initiatives.",
  },
  ventures: {
    title: "Future Ventures",
    description: "New businesses, brands, technologies and markets. Submit a founder proposal, partnership or business opportunity to SKAD GROUP.",
  },
  insights: {
    title: "Insights",
    description: "Perspectives from SKAD GROUP on business, markets, technology, AI, commerce, jewellery, trade and brand building.",
  },
  partners: {
    title: "Partner with SKAD",
    description: "Partner with SKAD GROUP as a strategic partner, supplier, manufacturer, distributor, technology partner or founder.",
  },
  careers: {
    title: "Careers",
    description: "Careers at SKAD GROUP: open positions in technology, beauty and more across the group. Apply or share your LinkedIn profile.",
  },
  contact: {
    title: "Contact Us",
    description: "Contact SKAD GROUP for partnerships, diamond trading, international trade, careers, media and general enquiries.",
  },
};

/** Kept for existing imports: section id → title. */
export const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(SECTIONS).map(([id, s]) => [id, s.title]),
);

// Sections that are hidden while their data is empty don't get a URL either
const HIDDEN = new Set<string>([
  ...(PEOPLE.length === 0 ? ["people"] : []),
  ...(MARKETS.length === 0 ? ["markets"] : []),
]);

export const SECTION_IDS: string[] = Object.keys(SECTIONS).filter((id) => !HIDDEN.has(id));

export const isSectionId = (id: string): boolean => SECTION_IDS.includes(id);