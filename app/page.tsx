import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Companies from "@/components/sections/Companies";
import Brands from "@/components/sections/Brands";
import Platforms from "@/components/sections/Platforms";
import Approach from "@/components/sections/Approach";
import Leadership from "@/components/sections/Leadership";
import Foundation from "@/components/sections/Foundation";
import Partners from "@/components/sections/Partners";
import NewsCareers from "@/components/sections/NewsCareers";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Companies />
        <Brands />
        <Platforms />
        <Approach />
        <Leadership />
        <Foundation />
        <Partners />
        <NewsCareers />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}