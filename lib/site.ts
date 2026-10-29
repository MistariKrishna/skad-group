/** Site-wide settings. NEXT_PUBLIC_SITE_URL can override the domain (e.g. http://localhost:3000 in .env.local for local dev). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.skadgroup.org").replace(/\/$/, "");
export const SITE_NAME = "SKAD GROUP";
export const SITE_TITLE = "SKAD GROUP | Building Businesses. Creating Brands. Shaping the Future.";
export const SITE_DESCRIPTION =
  "SKAD GROUP is a diversified business group building companies, brands, technology platforms and entrepreneurial ventures across markets.";