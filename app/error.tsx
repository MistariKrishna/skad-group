"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold-dark">Something went wrong</p>
        <h1 className="mt-4 font-serif text-[clamp(32px,4vw,48px)] font-medium leading-tight text-navy">We couldn’t load this page</h1>
        <p className="mt-4 text-[16px] leading-relaxed">Please try again. If the problem continues, return to the homepage.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-secondary">Go to homepage</Link>
        </div>
      </div>
    </main>
  );
}