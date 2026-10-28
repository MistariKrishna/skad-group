import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo_Black, Bodoni_Moda, Cormorant_Garamond, DM_Sans, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import Providers from "@/components/Providers";
import Preloader from "@/components/ui/Preloader";
import { PRELOADER_SCRIPT } from "@/lib/preloader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

// Brand wordmark fonts — remove once real brand logos are added
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const bodoni = Bodoni_Moda({
  subsets: ["latin"], variable: "--font-bodoni", display: "swap",
  adjustFontFallback: false, fallback: ["Didot", "Bodoni 72", "Georgia", "serif"],
});
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#07152F" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${display.variable} ${bodoni.variable} ${archivo.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
      </head>
      <body>
        <Preloader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}