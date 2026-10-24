import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mist px-6 text-center">
      <Logo />
      <p className="mt-12 text-[13px] font-semibold uppercase tracking-[.14em] text-gold-dark">Page not found</p>
      <h1 className="mt-3 font-serif text-4xl font-medium text-navy md:text-5xl">This page does not exist</h1>
      <p className="mt-4 max-w-md text-lg">The page may have moved. Return to the homepage or contact us.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to homepage</Link>
        <Link href="/#contact" className="btn btn-secondary">Contact us</Link>
      </div>
    </main>
  );
}