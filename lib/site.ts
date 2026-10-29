/** Site-wide settings. NEXT_PUBLIC_SITE_URL can override the domain (e.g. http://localhost:3000 in .env.local for local dev). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.skadgroup.org").replace(/\/$/, "");
export const SITE_NAME = "SKAD GROUP";

/** Homepage title shown in Google and browser tabs (keep under ~60 characters). */
export const SITE_TITLE = "SKAD GROUP | Diversified Business Group in India & UK";

/** Homepage description shown under the title in Google (keep under ~155 characters). */
export const SITE_DESCRIPTION =
  "SKAD GROUP builds companies, brands and technology platforms across jewellery and diamonds, beauty, fashion, legal tech and international trade.";

/** Group line from the brand spec — for share images and structured data. */
export const SITE_TAGLINE = "Building businesses. Creating brands. Shaping the future.";