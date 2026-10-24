import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/ui/Logo";

const PAGES: Record<string, { title: string; intro: string }> = {
  privacy: { title: "Privacy Policy", intro: "This policy explains how SKAD GROUP collects and processes personal information submitted through this website." },
  cookies: { title: "Cookies", intro: "This page explains which cookies this website uses and how you can manage your preferences." },
  terms: { title: "Terms of Use", intro: "These terms govern your use of the SKAD GROUP corporate website." },
  accessibility: { title: "Accessibility", intro: "SKAD GROUP aims for this website to meet WCAG 2.2 AA. Tell us if anything prevents you from using it." },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  return { title: page ? `${page.title} | SKAD GROUP` : "SKAD GROUP" };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-rule">
        <div className="container-x flex h-20 items-center">
          <Link href="/" aria-label="SKAD GROUP home"><Logo /></Link>
        </div>
      </div>
      <article className="container-x max-w-3xl py-16 md:py-24">
        <p className="text-[13px] font-semibold uppercase tracking-[.14em] text-gold-dark">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-navy md:text-5xl">{page.title}</h1>
        <p className="mt-6 text-lg leading-relaxed">{page.intro}</p>
        <div className="mt-10 border-l-2 border-gold bg-mist p-6 text-muted">
          The approved text for this page is being finalised and will be published here.
        </div>
        <Link href="/#contact" className="btn btn-primary mt-10">Contact SKAD GROUP</Link>
      </article>
    </main>
  );
}