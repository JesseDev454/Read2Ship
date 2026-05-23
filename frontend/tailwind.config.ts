import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-app": "#0A0A0B",
        "surface-main": "#121214",
        "surface-card": "#1A1A1D",
        "surface-elevated": "#212124",
        "surface-deep": "#110c16",
        "surface-panel": "#1f1924",
        "border-subtle": "#2D2D30",
        "text-primary": "#F5F5F7",
        "text-secondary": "#A1A1AA",
        "text-tertiary": "#71717A",
        primary: "#9333EA",
        secondary: "#06B6D4",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        glow: "0 0 24px rgba(147, 51, 234, 0.16)",
        cyan: "0 0 20px rgba(6, 182, 212, 0.18)"
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
