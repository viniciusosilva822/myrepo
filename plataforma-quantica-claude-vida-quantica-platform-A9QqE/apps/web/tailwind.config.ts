import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
        display: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
      },
      colors: {
        cosmos: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#3b0764",
          950: "#1a0033",
        },
        aurora: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      backgroundImage: {
        "cosmos-gradient":
          "radial-gradient(circle at 20% 0%, #1a0033 0%, #0f0a1f 35%, #050208 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
