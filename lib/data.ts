export const pad = (n: number): string => String(n).padStart(2, "0");

/* =====================================================================
   SITE & CONTACT — fill these in. Empty values are hidden automatically.
   Put images in /public/images/ and reference them as "/images/file.jpg".
   ===================================================================== */
export const SITE = {
  logo: "/images/skad-group-logo.svg", //       e.g. "/images/skad-group-logo.svg"  (dark version, for white backgrounds)
  logoLight: "/images/skad-group-logo-white.svg", //  e.g. "/images/skad-group-logo-white.svg" (for the navy footer)
};

export const CONTACT_DETAILS = {
  address: [] as string[], // e.g. ["Registered Office", "Building, Street", "Surat, Gujarat 395000", "India"]
  email: "", //              e.g. "info@skadgroup.com"
  phone: "", //              e.g. "+91 00000 00000"
  hours: "", //              e.g. "Monday to Saturday, 10:00–19:00 IST"
};

export const HERO = {
  image: "/images/hero.webp",
  imageAlt: "SKAD GROUP manufacturing facility",
  imageLabel: "Hero photograph",
};

/* ---------------- Navigation ---------------- */
export type MegaKey = "group" | "companies" | "brands" | "platforms";

export const NAV: { label: string; href: string; mega?: MegaKey }[] = [
  { label: "Group", href: "#about", mega: "group" },
  { label: "Companies", href: "#companies", mega: "companies" },
  { label: "Brands", href: "#brands", mega: "brands" },
  { label: "Platforms & Ventures", href: "#platforms", mega: "platforms" },
  { label: "Foundation", href: "#foundation" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

/* ---------------- Group facts (from the group structure) ---------------- */
export const FACTS = [
  { value: "4", label: "Operating companies" },
  { value: "6", label: "Consumer brands" },
  { value: "2", label: "Technology platforms" },
  { value: "India & UK", label: "Where our companies are based" },
];

export const VALUES = [
  { t: "Build", d: "We create companies, brands and platforms from the ground up." },
  { t: "Connect", d: "We link businesses, capabilities and markets across the group." },
  { t: "Scale", d: "We grow what works into new markets and categories." },
];

/* ---------------- Companies ---------------- */
export type Company = {
  key: string;
  name: string;
  short: string;
  sector: string;
  location: string;
  description: string;
  brands: string[];
  regNo: string; //   CIN (India) or Companies House number (UK)
  website: string;
  image: string;
  imageLabel: string;
  route: string;
};

export const COMPANIES: Company[] = [
  {
    key: "jewels", name: "SKAD JEWELS INDIA PRIVATE LIMITED", short: "SKAD Jewels",
    sector: "Manufacturing · Diamond trading", location: "India",
    description: "Manufacturing and diamond trading (natural and lab-grown), sourcing, B2B supply and international commerce.",
    brands: ["BENAVI"], regNo: "", website: "", image: "/images/benavi-img.webp", imageLabel: "Diamond manufacturing photograph", route: "Diamond Trading",
  },
  {
    key: "luxora", name: "LUXORA GLOW ESSENTIALS PRIVATE LIMITED", short: "Luxora Glow Essentials",
    sector: "Beauty · Personal care", location: "",
    description: "Premium beauty, hair, skin and personal care. The company behind LUXORA GLOW.",
    brands: ["LUXORA GLOW"], regNo: "", website: "", image: "/images/luxora-glow-img.webp", imageLabel: "Beauty studio photograph", route: "Business Partnership",
  },
  {
    key: "detara", name: "DETARA LTD", short: "DETARA LTD",
    sector: "Fine jewellery", location: "London, United Kingdom",
    description: "Fine diamond jewellery and engagement rings. The company behind DETARA.",
    brands: ["DETARA"], regNo: "", website: "https://www.detara.store/", image: "/images/detara-img.webp", imageLabel: "Fine jewellery photograph", route: "Business Partnership",
  },
  {
    key: "diatech", name: "SKAD DIATECH EXPORTS", short: "SKAD Diatech Exports",
    sector: "Global commerce · Trade", location: "",
    description: "Global commerce, trade and digital infrastructure. The ecosystem home of SKAD CommerceOS and SKAD Commerce Lab.",
    brands: [], regNo: "", website: "", image: "/images/skad-diatech-export-img.webp", imageLabel: "Trade and logistics photograph", route: "International Trade",
  },
];

/* ---------------- Brands ---------------- */
export type BrandKey = "detara" | "luxora" | "benavi" | "rupaari" | "casesuno" | "zemo";
export type Brand = {
  key: BrandKey; name: string; category: string; tagline: string; company: string;
  badge?: string; url: string; logo: string; image: string; route: string;
};

export const BRANDS: Brand[] = [
  { key: "detara", name: "DETARA", category: "Fine jewellery", tagline: "Fine Diamond Jewellery & Engagement Rings",
    company: "Brand of DETARA LTD, London", url: "https://www.detara.store/", logo: "/images/detara-logo.svg", image: "", route: "General" },
  { key: "luxora", name: "LUXORA GLOW", category: "Beauty", tagline: "Hair, Skin & Beauty Studio",
    company: "Brand of LUXORA GLOW ESSENTIALS PRIVATE LIMITED", url: "", logo: "/images/luxora-glow-logo.svg", image: "", route: "General" },
  { key: "benavi", name: "BENAVI", category: "Silver jewellery", tagline: "Crafting Dreams in Silver: Your Story, Your Jewel.",
    company: "Brand of SKAD JEWELS INDIA PRIVATE LIMITED", badge: "India only", url: "https://benavi.in/", logo: "/images/benavi-logo.svg", image: "", route: "General" },
  { key: "rupaari", name: "RUPAARI", category: "Sarees · Indian fashion", tagline: "Sarees and Indian fashion, heritage with a contemporary eye.",
    company: "Part of SKAD GROUP", url: "", logo: "/images/rupaari-logo.svg", image: "", route: "General" },
  { key: "casesuno", name: "CASE SUNO", category: "Legal technology", tagline: "Legal technology.",
    company: "Part of SKAD GROUP", url: "https://case-suno.vercel.app/", logo: "/images/case-suno-logo.svg", image: "", route: "Technology" },
  { key: "zemo", name: "ZEMO", category: "New-gen fashion", tagline: "Wear your way. Custom, streetwear and innerwear.",
    company: "Part of SKAD GROUP", url: "", logo: "", image: "", route: "General" },
];

/* ---------------- Platforms ---------------- */
export const PLATFORMS = [
  {
    key: "os", label: "Infrastructure", name: "SKAD CommerceOS", tagline: "Build • Launch • Grow",
    description: "Technology and commerce infrastructure for building, launching and growing businesses.",
    items: ["Market Intelligence", "Brand Infrastructure", "Product", "E-commerce", "AI", "Content", "SEO/GEO", "Marketing", "CRM", "Automation", "Analytics", "Operations"],
  },
  {
    key: "lab", label: "Execution", name: "SKAD Commerce Lab", tagline: "AI + Human Execution",
    description: "Execution and services that put the platform to work for each business, delivered through fifteen service capabilities. Details are shared on request.",
    items: [] as string[],
  },
];

/* ---------------- Approach ---------------- */
export const APPROACH = [
  { t: "Discover", k: "Research, opportunity, market", d: "Market intelligence, customer need, opportunity, category and competitive landscape." },
  { t: "Define", k: "Strategy, positioning, brand", d: "Strategy, proposition, business model, brand direction, product architecture and operating requirements." },
  { t: "Build", k: "Product, technology, infrastructure", d: "Product, sourcing, manufacturing, brand identity, technology, e-commerce, content and systems." },
  { t: "Launch", k: "Commerce, distribution, marketing", d: "Go-to-market, distribution, digital presence, creative, campaigns and operational readiness." },
  { t: "Grow", k: "Customers, markets, systems", d: "Demand generation, CRM, analytics, SEO/GEO, retention, optimisation and partnerships." },
  { t: "Scale", k: "Technology, operations, international expansion", d: "Systems, automation, markets, distribution, capabilities and organisational maturity." },
];

/* ---------------- Leadership (section stays hidden while empty) ---------------- */
export type Person = { name: string; title: string; bio: string; image: string };
export const LEADERSHIP: Person[] = [
  // { name: "Full Name", title: "Founder & Chairman", bio: "Two-line biography.", image: "/images/people/name.jpg" },
];

/* ---------------- Foundation ---------------- */
export const FOUNDATION = {
  image: "",
  imageLabel: "Community programme photograph",
  areas: ["Mission", "Initiatives", "Community", "Programmes", "Volunteers", "Partnerships"],
};

/* ---------------- Partnerships & enquiries ---------------- */
export const PATHWAYS = [
  { t: "Strategic partners", d: "Long-term partnerships across the group.", route: "Strategic Partner" },
  { t: "Investors", d: "Investment and venture discussions.", route: "Investment / Ventures" },
  { t: "Suppliers", d: "Materials, products and services.", route: "Supplier" },
  { t: "Manufacturers", d: "Production and manufacturing partnerships.", route: "Manufacturing" },
  { t: "Distributors", d: "Distribution of our brands and products.", route: "Distributor" },
  { t: "Technology partners", d: "Platforms, systems and integrations.", route: "Technology" },
  { t: "Brand partners", d: "Collaborations with our consumer brands.", route: "Business Partnership" },
  { t: "Founders", d: "New business opportunities.", route: "Founder" },
  { t: "International partners", d: "Trade and market development.", route: "International Trade" },
];

export const ENQUIRY_TYPES = [
  "General", "Business Partnership", "Investment / Ventures", "Supplier", "Manufacturing", "Diamond Trading",
  "International Trade", "Technology", "Media", "Careers", "Foundation", "Strategic Partner", "Distributor",
  "Founder", "Business Opportunity", "Other",
];
export const PARTNER_ROUTES = [
  "Business Partnership", "Investment / Ventures", "Supplier", "Manufacturing", "Diamond Trading",
  "International Trade", "Strategic Partner", "Distributor", "Founder", "Business Opportunity",
];

export const COUNTRIES = ["India", "United Kingdom", "United States", "United Arab Emirates", "Singapore", "Hong Kong", "Belgium", "Israel", "Germany", "France", "Italy", "Netherlands", "Switzerland", "Spain", "Canada", "Australia", "Japan", "South Korea", "China", "Thailand", "Malaysia", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "South Africa", "Kenya", "Turkey", "Sri Lanka", "Bangladesh", "Nepal", "Ireland", "Sweden", "Poland", "Portugal", "Austria"];

/* ---------------- Mega menu (keep at the end — uses the data above) ---------------- */
export type MegaLink = { t: string; s?: string; href: string };
export type MegaPanel = {
  label: string;
  intro: string;
  links: MegaLink[];
  featured: { title: string; href: string; route?: string };
  all: string;
};

export const MEGA: Record<MegaKey, MegaPanel> = {
  group: {
    label: "Group",
    intro: "One group bringing together companies, brands, platforms and ventures.",
    links: [
      { t: "About the group", s: "Who we are", href: "#about" },
      { t: "How we build", s: "From idea to scale", href: "#approach" },
      ...(LEADERSHIP.length > 0 ? [{ t: "Leadership", s: "The people leading the group", href: "#leadership" }] : []),
      { t: "Kalla Rudra Foundation", s: "Beyond business", href: "#foundation" },
      { t: "News", s: "Announcements", href: "#news" },
      { t: "Careers", s: "Build your future with SKAD", href: "#careers" },
    ],
    featured: { title: "From idea to scale: how SKAD builds", href: "#approach" },
    all: "#about",
  },
  companies: {
    label: "Companies",
    intro: "The operating companies behind the group.",
    links: COMPANIES.map((c) => ({ t: c.name, s: c.sector.toLowerCase(), href: "#companies" })),
    featured: { title: "Work with our companies", href: "#partners" },
    all: "#companies",
  },
  brands: {
    label: "Brands",
    intro: "Brands built for their own markets.",
    links: BRANDS.map((b) => ({ t: b.name, s: b.badge ? `${b.category} · ${b.badge}` : b.category, href: "#brands" })),
    featured: { title: "Each brand, its own visual language", href: "#brands" },
    all: "#brands",
  },
  platforms: {
    label: "Platforms & Ventures",
    intro: "Building what comes next.",
    links: [
      ...PLATFORMS.map((p) => ({ t: p.name, s: p.tagline, href: "#platforms" })),
      { t: "Work with us", s: "Partners, investors, suppliers and founders", href: "#partners" },
    ],
    featured: { title: "Submit a business opportunity", href: "#contact", route: "Business Opportunity" },
    all: "#platforms",
  },
};