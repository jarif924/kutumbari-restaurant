import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: "#006038",
            deep: "#073322",
            dark: "#052619",
            light: "#0e7747",
            surface: "#F0F7F4",
          },
          red: {
            DEFAULT: "#E50914",
            vibrant: "#E50914",
            hover: "#C7000B",
            deep: "#990008",
            light: "#FDF2F2",
          },
          orange: {
            DEFAULT: "#EA580C",
            warm: "#F97316",
            amber: "#D97706",
            soft: "#FFF7ED",
          },
          charcoal: {
            DEFAULT: "#1F2937",
            dark: "#111827",
            muted: "#4B5563",
            light: "#9CA3AF",
          },
          cream: "#FAF8F5",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        bengali: ["var(--font-hind-siliguri)", "Hind Siliguri", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.04)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        floating: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
        glow: "0 0 25px rgba(229, 9, 20, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.2s ease-out forwards",
        slideDown: "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideUp: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        scaleUp: "scaleUp 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
