import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: "#F0FAF4",
        forest: "#1A3C2E",
        emerald: "#10B981",
        mint: "#D1FAE5",
        "mint-deep": "#047857",
        muted: "#6B7280",
        line: "#D1FAE5",
        ink: "#1A3C2E",
        sub: "#7FA890",
        rail: "#BBD8C6",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "obisa-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: { pulseSoft: "obisa-pulse 1.6s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
