import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1F44", deep: "#07152F", soft: "#16305C" },
        gold: { DEFAULT: "#D4AF37", dark: "#8A6A1F" },
        body: "#3A4864",
        muted: "#5B6478",
        rule: "#E3E6EB",
        mist: "#F5F6F8",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
        bodoni: ["var(--font-bodoni)", "Georgia", "serif"],
        archivo: ["var(--font-archivo)", "Impact", "sans-serif"],
      },
      maxWidth: { content: "1240px" },
    },
  },
  plugins: [],
};

export default config;