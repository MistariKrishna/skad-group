import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { PillLink, PillRoute } from "@/components/ui/Pill";
import { BRANDS, COMPANIES, CONTACT_DETAILS, MARKETS, PEOPLE, PLATFORMS } from "@/lib/data";

type L = { t: string; href: string };

const GROUP_LINKS: L[] = [
  { t: "About", href: "#about" },
  { t: "How we build", href: "#approach" },
  { t: "Industries", href: "#industries" },
  { t: "Ecosystem", href: "#ecosystem" },
  ...(MARKETS.length > 0 ? [{ t: "Global markets", href: "#markets" }] : []),
  ...(PEOPLE.length > 0 ? [{ t: "People", href: "#people" }] : []),
];
const PLATFORM_LINKS: L[] = [
  ...PLATFORMS.map((p) => ({ t: p.name, href: "#platforms" })),
  { t: "Future ventures", href: "#ventures" },
  { t: "Capabilities", href: "#capabilities" },
];
const IMPACT_LINKS: L[] = [
  { t: "Kalla Rudra Foundation", href: "#foundation" },
  { t: "Insights", href: "#insights" },
  { t: "Newsroom", href: "#news" },
  { t: "Careers", href: "#careers" },
];
const CONNECT_LINKS: L[] = [
  { t: "Partner with SKAD", href: "#partners" },
  { t: "Submit an opportunity", href: "#ventures" },
  { t: "Contact", href: "#contact" },
];
const LEGAL: L[] = [
  { t: "Privacy Policy", href: "/legal/privacy" },
  { t: "Cookies", href: "/legal/cookies" },
  { t: "Terms", href: "/legal/terms" },
  { t: "Accessibility", href: "/legal/accessibility" },
];

function Column({ title, links }: { title: string; links: L[] }) {
  return (
    <div>
      <h3 className="text-[12.5px] font-semibold uppercase tracking-[.12em] text-white">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.t}>
            <a href={l.href} className="u-link text-[14.5px] transition-colors hover:text-white">{l.t}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { email, phone } = CONTACT_DETAILS;

  return (
    <footer className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[24px] bg-navy-deep text-white/65 sm:rounded-[28px]">
        {/* CTA band */}
        <div className="relative border-b border-white/10">
          <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-gold/10" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-gold/20" />
          <div className="container-x relative flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold">Get in touch</p>
              <h2 className="mt-3 max-w-xl font-serif text-[clamp(28px,3.6vw,44px)] font-medium leading-tight text-white">
                Let’s build something meaningful together.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillRoute route="General" variant="light" arrow>Start a conversation</PillRoute>
              <PillLink href="#partners" variant="outline-light">Partner with SKAD</PillLink>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(6,minmax(0,1fr))] lg:gap-8">
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
              A diversified business group building companies, brands, technology platforms and ventures across markets.
            </p>
            {(email || phone) && (
              <div className="mt-6 space-y-1.5 text-[15px]">
                {email && <a href={`mailto:${email}`} className="u-link block w-fit text-white">{email}</a>}
                {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="u-link block w-fit text-white">{phone}</a>}
              </div>
            )}
          </div>
          <Column title="Group" links={GROUP_LINKS} />
          <Column title="Companies" links={COMPANIES.map((c) => ({ t: c.short, href: "#companies" }))} />
          <Column title="Brands" links={BRANDS.map((b) => ({ t: b.name, href: "#brands" }))} />
          <Column title="Platforms" links={PLATFORM_LINKS} />
          <Column title="Impact & insights" links={IMPACT_LINKS} />
          <Column title="Connect" links={CONNECT_LINKS} />
        </div>

        <div className="border-t border-white/10">
          <div className="container-x py-6 text-[12.5px] leading-relaxed text-white/45">
            Group companies: {COMPANIES.map((c) => c.name).join(" · ")}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-x flex flex-col gap-4 py-6 text-[13px] md:flex-row md:items-center md:justify-between">
            <p>© 2026 SKAD GROUP. All rights reserved.</p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {LEGAL.map((l) => (
                  <li key={l.t}>
                    <Link href={l.href} className="u-link transition-colors hover:text-white">{l.t}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}