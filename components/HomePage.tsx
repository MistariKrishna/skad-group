import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Companies from "@/components/sections/Companies";
import Brands from "@/components/sections/Brands";
import Platforms from "@/components/sections/Platforms";
import Approach from "@/components/sections/Approach";
import Industries from "@/components/sections/Industries";
import Ecosystem from "@/components/sections/Ecosystem";
import Capabilities from "@/components/sections/Capabilities";
import Markets from "@/components/sections/Markets";
import People from "@/components/sections/People";
import Foundation from "@/components/sections/Foundation";
import Ventures from "@/components/sections/Ventures";
import Insights from "@/components/sections/Insights";
import Newsroom from "@/components/sections/Newsroom";
import Partners from "@/components/sections/Partners";
import Careers from "@/components/sections/Careers";
import Contact from "@/components/sections/Contact";
import WorldNetwork from "@/components/ui/WorldNetwork";
import { CONTACT_DETAILS, SITE } from "@/lib/data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${SITE.logo}`,
      description: SITE_DESCRIPTION,
      ...(CONTACT_DETAILS.email ? { email: CONTACT_DETAILS.email } : {}),
      ...(CONTACT_DETAILS.phone ? { telephone: CONTACT_DETAILS.phone } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Companies />
        <Brands />
        <Platforms />
        <Approach />
        <Industries />
        <Ecosystem />
        <Capabilities />
        <Markets map={<WorldNetwork />} />
        <People />
        <Foundation />
        <Ventures />
        <Insights />
        <Newsroom />
        <Partners />
        <Careers />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}