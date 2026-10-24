import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo_Black, Bodoni_Moda, Cormorant_Garamond, DM_Sans, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import Providers from "@/components/Providers";
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
  title: "SKAD GROUP | Building Businesses. Creating Brands. Shaping the Future.",
  description:
    "SKAD GROUP is a diversified business group building companies, brands, technology platforms and ventures across markets.",
  openGraph: {
    title: "SKAD GROUP",
    description: "A diversified business group building companies, brands, technology platforms and ventures across markets.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0A1F44" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${display.variable} ${bodoni.variable} ${archivo.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}