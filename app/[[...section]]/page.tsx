import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { SECTIONS, SECTION_IDS } from "@/lib/sections";
import { SITE_NAME } from "@/lib/site";

type Props = { params: { section?: string[] } };

/** Pre-builds /about, /platforms, /contact … at build time. */
export function generateStaticParams() {
  return SECTION_IDS.map((id) => ({ section: [id] }));
}

export function generateMetadata({ params }: Props): Metadata {
  const id = params.section?.[0];
  const meta = id ? SECTIONS[id] : undefined;

  // Homepage: title & description come from app/layout.tsx
  if (!meta) return { alternates: { canonical: "/" } };

  const fullTitle = `${meta.title} | ${SITE_NAME}`;
  return {
    title: meta.title, // layout template adds " | SKAD GROUP"
    description: meta.description,
    // All section URLs show the same one-page site, so Google is pointed to the homepage as the main version
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: `/${id}`,
      siteName: SITE_NAME,
      title: fullTitle,
      description: meta.description,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: meta.description,
    },
  };
}

export default function Page({ params }: Props) {
  const parts = params.section ?? [];
  // "/" or a known section → homepage; anything else → 404
  if (parts.length > 1 || (parts.length === 1 && !SECTION_IDS.includes(parts[0]))) notFound();
  return <HomePage />;
}