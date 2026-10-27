/** Site-wide settings. Set NEXT_PUBLIC_SITE_URL in .env.local to your real domain before launch. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "SKAD GROUP";
export const SITE_TITLE = "SKAD GROUP | Building Businesses. Creating Brands. Shaping the Future.";
export const SITE_DESCRIPTION =
  "SKAD GROUP is a diversified business group building companies, brands, technology platforms and entrepreneurial ventures across markets.";