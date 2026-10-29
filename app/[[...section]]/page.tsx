import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/sections";

type Props = { params: { section?: string[] } };

/** Pre-builds /about, /platforms, /contact … at build time. */
export function generateStaticParams() {
  return SECTION_IDS.map((id) => ({ section: [id] }));
}

export function generateMetadata({ params }: Props): Metadata {
  const id = params.section?.[0];
  const title = id ? SECTION_TITLES[id] : undefined;
  return {
    ...(title ? { title } : {}),
    // All section URLs show the same page, so point Google to the homepage
    alternates: { canonical: "/" },
  };
}

export default function Page({ params }: Props) {
  const parts = params.section ?? [];
  // "/" or a known section → homepage; anything else → 404
  if (parts.length > 1 || (parts.length === 1 && !SECTION_IDS.includes(parts[0]))) notFound();
  return <HomePage />;
}