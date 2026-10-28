export const pad = (n: number): string => String(n).padStart(2, "0");

/* =====================================================================
   SITE & CONTACT — fill these in. Empty values are hidden automatically.
   Put images in /public/images/ and reference them as "/images/file.jpg".
   ===================================================================== */
export const SITE = {
  logo: "/images/skad-group-logo.svg", //       dark version, for white backgrounds
  logoLight: "/images/skad-group-logo-white.svg", //  for the navy footer
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

/* ---------------- Navigation (spec §4) ---------------- */
export type MegaKey = "group" | "companies" | "brands" | "platforms";

export const NAV: { label: string; href: string; mega?: MegaKey }[] = [
  { label: "Group", href: "/about", mega: "group" },
  { label: "Companies", href: "/companies", mega: "companies" },
  { label: "Brands", href: "/brands", mega: "brands" },
  { label: "Platforms", href: "/platforms", mega: "platforms" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Impact", href: "/foundation" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
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
  platforms?: string[]; // PLATFORMS keys that sit within this company's ecosystem
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
    brands: [], platforms: ["os", "lab"], regNo: "", website: "", image: "/images/skad-diatech-export-img.webp", imageLabel: "Trade and logistics photograph", route: "International Trade",
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
  { key: "casesuno", name: "CASE SUNO",  badge: "India only", category: "Legal technology", tagline: "Legal technology.",
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

/* ---------------- Industries (spec §13) ---------------- */
export const INDUSTRIES = [
  { t: "Jewellery & Diamonds", d: "Natural and lab-grown diamonds, fine diamond jewellery and silver jewellery.", entities: ["SKAD Jewels", "DETARA", "BENAVI"] },
  { t: "Manufacturing", d: "Jewellery manufacturing and supply.", entities: ["SKAD Jewels"] },
  { t: "International Trade", d: "Sourcing, export, import and distribution across markets.", entities: ["SKAD Diatech Exports"] },
  { t: "Beauty & Personal Care", d: "Hair, skin and beauty.", entities: ["LUXORA GLOW"] },
  { t: "Fashion & Lifestyle", d: "Sarees and Indian fashion; custom wear, streetwear and innerwear.", entities: ["RUPAARI", "ZEMO"] },
  { t: "Legal Technology", d: "Technology for legal services.", entities: ["CASE SUNO"] },
  { t: "Commerce Technology", d: "Infrastructure and execution for building, launching and growing businesses.", entities: ["SKAD CommerceOS", "SKAD Commerce Lab"] },
  { t: "AI & Automation", d: "AI and automation capabilities within our commerce platforms.", entities: ["SKAD CommerceOS", "SKAD Commerce Lab"] },
  { t: "Social Impact", d: "Community programmes and initiatives.", entities: ["Kalla Rudra Foundation"] },
];

/* ---------------- Capabilities (spec §15) ---------------- */
export const CAPABILITIES = [
  { t: "Product", d: "Research, development, sourcing, customisation and product architecture." },
  { t: "Brand", d: "Strategy, identity, positioning, storytelling and packaging." },
  { t: "Technology", d: "Web, e-commerce, platforms, integrations, data and systems." },
  { t: "Commerce", d: "Direct-to-consumer, B2B, marketplaces, conversion and operations." },
  { t: "Manufacturing", d: "Jewellery manufacturing and supply." },
  { t: "Trade", d: "Sourcing, export, import, distribution and international workflows." },
  { t: "AI", d: "AI-assisted research, creative, automation, analytics and workflow infrastructure." },
  { t: "Growth", d: "SEO/GEO, content, performance marketing, CRM, retention and analytics." },
];

/* ---------------- Global markets ----------------
   Only list markets that are verified. "presence" = where the group operates,
   "partner" = countries with an official partner.
   lat/lon place the pin on the map (country centre or a specific city).
   ------------------------------------------------ */
export type MarketStatus = "presence" | "partner";
export type Market = {
  key: string;
  country: string;
  short?: string; //   shorter name for tight spaces
  code: string; //     shown in the list badge
  status: MarketStatus;
  note?: string; //    e.g. related company or city — verified only
  lat: number;
  lon: number;
  label?: "left" | "right" | "top" | "bottom";
  hub?: boolean; //    connection lines are drawn from the hub
};

export const MARKET_STATUS: Record<MarketStatus, { label: string; plural: string }> = {
  presence: { label: "Our presence", plural: "Our presence" },
  partner: { label: "Official partner", plural: "Official partners" },
};

export const MARKETS: Market[] = [
  { key: "in", country: "India", code: "IN", status: "presence", note: "SKAD JEWELS INDIA PRIVATE LIMITED", lat: 21, lon: 78.9, hub: true },
  { key: "uk", country: "United Kingdom", short: "UK", code: "UK", status: "presence", note: "DETARA LTD · London", lat: 54, lon: -2 },
  { key: "no", country: "Norway", code: "NO", status: "presence", lat: 61, lon: 10 },
  { key: "es", country: "Spain", code: "ES", status: "partner", lat: 40.4, lon: -3.7 },
  { key: "vn", country: "Vietnam", code: "VN", status: "partner", lat: 16, lon: 106 },
  { key: "de", country: "Germany", code: "DE", status: "partner", lat: 51.2, lon: 10.4 },
  // ⚠ Confirm status: "partner" = official partner country, "presence" = SKAD company/office/team there
  { key: "us", country: "United States", short: "USA", code: "US", status: "presence", lat: 39.8, lon: -98.6 },
];

/* ---------------- People (section stays hidden while empty) ---------------- */
export type PeopleGroup =
  | "Founder" | "Leadership" | "Management" | "Business Heads"
  | "Technology" | "Creative" | "Operations" | "Advisors" | "Strategic Experts";

export const PEOPLE_GROUPS: PeopleGroup[] = [
  "Founder", "Leadership", "Management", "Business Heads",
  "Technology", "Creative", "Operations", "Advisors", "Strategic Experts",
];

export type Person = {
  name: string;
  title: string;
  group: PeopleGroup;
  company?: string;
  bio: string; //          approved biography; use "\n\n" for paragraph breaks
  image: string; //        "/images/people/name.webp" — empty shows initials
  expertise?: string[];
  linkedin?: string;
};

export const PEOPLE: Person[] = [
  // ⚠ PREVIEW ONLY — replace with approved people before launch
  { name: "Founder Name", title: "Founder & Chairman", group: "Founder", bio: "Preview biography. Replace with the approved founder biography.", image: "", expertise: ["Diamonds", "Manufacturing", "Brand building"], linkedin: "https://in.linkedin.com/in/suryakirankalla" },
  { name: "Leader One", title: "Managing Director", group: "Leadership", company: "SKAD JEWELS INDIA PRIVATE LIMITED", bio: "Preview biography.", image: "", expertise: ["Operations"] },
  { name: "Leader Two", title: "Head of Technology", group: "Technology", company: "SKAD DIATECH EXPORTS", bio: "Preview biography.", image: "", linkedin: "https://www.linkedin.com/" },
  { name: "Leader Three", title: "Creative Director", group: "Creative", bio: "Preview biography.", image: "" },
];

/* ---------------- Culture ---------------- */
export const CULTURE = [
  { t: "Ownership", d: "We treat every business we build as our own responsibility." },
  { t: "Long-term thinking", d: "We make decisions for durable value, not short-term noise." },
  { t: "Innovation", d: "We look for better ways to make, sell and operate." },
  { t: "Execution", d: "Ideas matter when they ship. We finish what we start." },
  { t: "Integrity", d: "We say what is true and do what we say." },
  { t: "One ecosystem", d: "Our companies and brands are stronger together." },
];

/* ---------------- Careers ---------------- */
export const CAREER_AREAS = [
  "Technology", "AI", "Commerce", "Creative", "Beauty", "Marketing", "Operations",
  "Finance", "Sales", "Manufacturing", "International Trade", "Internships",
] as const;
export type CareerArea = (typeof CAREER_AREAS)[number];

export type Job = {
  id: string;
  title: string;
  department: CareerArea;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  company?: string;
  summary: string;
  requirements: string[];
  status: "open" | "closed"; //  set to "closed" to hide a role without deleting it
  applyUrl?: string; //          external application link; empty = contact form
};

export const JOBS: Job[] = [
  // ⚠ Confirm location, type and requirements with HR before launch
  {
    id: "makeover-artist-luxora",
    title: "Makeover Artist",
    department: "Beauty",
    location: "India", //  ⚠ Confirm city / studio location
    type: "Full-time",
    company: "LUXORA GLOW ESSENTIALS PRIVATE LIMITED",
    summary:
      "Join the LUXORA GLOW studio team to deliver professional makeup and makeover services for bridal, party and everyday clients.",
    requirements: [
      "Professional experience as a makeup or makeover artist",
      "Skilled in bridal, party and occasion looks",
      "Strong knowledge of skin types, products and hygiene standards",
      "A portfolio of previous work",
      "Friendly, client-focused approach",
    ],
    status: "open",
  },
  // ⚠ Confirm location, type, company and requirements with HR before launch
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    department: "Technology",
    location: "India", //  ⚠ Confirm city / remote
    type: "Full-time",
    summary:
      "Build fast, accessible and polished websites and interfaces for the group’s companies, brands and commerce platforms.",
    requirements: [
      "Strong skills in React, Next.js and TypeScript",
      "Experience with Tailwind CSS and responsive, mobile-first design",
      "Understanding of web performance, accessibility and SEO",
      "Comfortable working with Git and design files",
      "A portfolio or GitHub showing recent work",
    ],
    status: "open",
  },
  // ⚠ Confirm location, type, company and requirements with HR before launch
  {
    id: "full-stack-developer",
    title: "Full-Stack Developer",
    department: "Technology",
    location: "India", //  ⚠ Confirm city / remote
    type: "Full-time",
    summary:
      "Develop and maintain the systems behind our e-commerce, CRM, automation and internal tools, from APIs and databases to the interface.",
    requirements: [
      "Experience with Node.js and TypeScript, plus React or Next.js",
      "Working knowledge of databases (SQL and/or NoSQL) and REST APIs",
      "Experience with e-commerce platforms or third-party integrations",
      "Familiarity with cloud hosting and deployment",
      "Able to own features from planning to release",
    ],
    status: "open",
  },
];

/* ---------------- Future ventures (spec §19) ----------------
   Add only real ventures. Do not imply an investment portfolio.
   ------------------------------------------------------------ */
export type Venture = {
  name: string;
  type: string; //         e.g. "New brand", "Technology", "Market"
  status: "Exploring" | "In development" | "Launched";
  description: string;
  related?: string; //     related company or brand
};
export const VENTURES: Venture[] = [];

export const FUTURE_AREAS = ["New businesses", "New brands", "New technologies", "New markets", "Strategic opportunities"];

export const OPPORTUNITY_TYPES = [
  { t: "Founder proposal", d: "Bring an idea or an early-stage business.", route: "Founder" },
  { t: "Strategic partnership", d: "Long-term collaboration across the group.", route: "Strategic Partner" },
  { t: "Supplier or manufacturer", d: "Materials, production and supply.", route: "Supplier" },
  { t: "Technology collaboration", d: "Platforms, systems and integrations.", route: "Technology" },
  { t: "Market opportunity", d: "Trade and development in new markets.", route: "International Trade" },
  { t: "Brand collaboration", d: "Partnerships with our consumer brands.", route: "Business Partnership" },
];

/* ---------------- Insights (spec §20) ---------------- */
export const INSIGHT_CATEGORIES = [
  "Business", "Markets", "Technology", "AI", "Commerce", "Jewellery",
  "Manufacturing", "International Trade", "Brand Building", "Entrepreneurship",
] as const;
export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export type Insight = {
  id: string;
  title: string;
  date: string; //         ISO, e.g. "2026-10-27"
  category: InsightCategory;
  author: string;
  readingTime?: string; // e.g. "6 min read"
  summary: string;
  image?: string;
  href?: string;
};
export const INSIGHTS: Insight[] = [
  // { id: "lab-grown-diamonds", title: "Article title", date: "2026-10-27", category: "Jewellery", author: "Author Name", readingTime: "5 min read", summary: "Two-line summary.", href: "" },
];

/* ---------------- Newsroom ---------------- */
// export const NEWS_CATEGORIES = [
//   "Company announcement", "New business", "Partnership", "Launch",
//   "Leadership", "Foundation", "Media coverage",
// ] as const;
// export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

// export type NewsItem = {
//   id: string;
//   title: string;
//   date: string;
//   category: NewsCategory;
//   summary: string;
//   entity?: string;
//   image?: string;
//   href?: string;
// };

// export const NEWS: NewsItem[] = [
//   // { id: "benavi-launch", title: "Announcement title", date: "2026-10-27", category: "Launch", summary: "Two-line approved summary.", entity: "BENAVI", image: "", href: "" },
// ];

export const MEDIA_KIT = { href: "" };

/* ---------------- Foundation ---------------- */
export const FOUNDATION = {
  image: "/images/foundation-img.webp",
  imageLabel: "Community programme photograph",
  areas: ["Mission", "Initiatives", "Community", "Programmes", "Volunteers", "Partnerships"],
  summary: "The group’s impact entity, kept separate from its commercial companies and brands.",
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

export const COUNTRIES = ["India", "United Kingdom", "United States", "United Arab Emirates", "Singapore", "Hong Kong", "Belgium", "Israel", "Germany", "France", "Italy", "Netherlands", "Switzerland", "Spain", "Canada", "Australia", "Japan", "South Korea", "China", "Thailand", "Malaysia", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "South Africa", "Kenya", "Turkey", "Sri Lanka", "Bangladesh", "Nepal", "Ireland", "Sweden", "Poland", "Portugal", "Austria", "Norway", "Vietnam"];

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
      { t: "About the group", s: "Who we are", href: "/about" },
      { t: "How we build", s: "From idea to scale", href: "/approach" },
      { t: "Industries", s: "Where the group works", href: "/industries" },
      { t: "SKAD ecosystem", s: "How it all connects", href: "/ecosystem" },
      ...(MARKETS.length > 0 ? [{ t: "Global markets", s: "Presence and official partners", href: "/markets" }] : []),
      ...(PEOPLE.length > 0 ? [{ t: "People", s: "Founder, leadership and teams", href: "/people" }] : []),
      { t: "Kalla Rudra Foundation", s: "Beyond business", href: "/foundation" },
      // { t: "Newsroom", s: "Announcements and media", href: "/news" },
      { t: "Careers", s: "Build your future with SKAD", href: "/careers" },
    ],
    featured: { title: "From idea to scale: how SKAD builds", href: "/approach" },
    all: "/about",
  },
  companies: {
    label: "Companies",
    intro: "The operating companies behind the group.",
    links: COMPANIES.map((c) => ({ t: c.name, s: c.sector.toLowerCase(), href: "/companies" })),
    featured: { title: "Work with our companies", href: "/partners" },
    all: "/companies",
  },
  brands: {
    label: "Brands",
    intro: "Brands built for their own markets.",
    links: BRANDS.map((b) => ({ t: b.name, s: b.badge ? `${b.category} · ${b.badge}` : b.category, href: "/brands" })),
    featured: { title: "Each brand, its own visual language", href: "/brands" },
    all: "/brands",
  },
  platforms: {
    label: "Platforms & Ventures",
    intro: "Building what comes next.",
    links: [
      ...PLATFORMS.map((p) => ({ t: p.name, s: p.tagline, href: "/platforms" })),
      { t: "Future ventures", s: "New businesses, brands and markets", href: "/ventures" },
      { t: "Capabilities", s: "What we bring to every business", href: "/capabilities" },
      { t: "Work with us", s: "Partners, suppliers and founders", href: "/partners" },
    ],
    featured: { title: "Submit a business opportunity", href: "/contact", route: "Business Opportunity" },
    all: "/platforms",
  },
};