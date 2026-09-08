import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anthracite: {
          DEFAULT: "#26292E",
          50: "#F4F4F5",
          100: "#E4E5E6",
          200: "#C3C5C8",
          300: "#9A9DA3",
          400: "#6C6F76",
          500: "#494C52",
          600: "#3A3D43",
          700: "#26292E",
          800: "#1B1D21",
          900: "#101215",
        },
        copper: {
          DEFAULT: "#B57544",
          50: "#FBF3EC",
          100: "#F4E1D0",
          200: "#E7C3A2",
          300: "#DAA574",
          400: "#C68C57",
          500: "#B57544",
          600: "#96603A",
          700: "#754A2E",
          800: "#553622",
          900: "#392416",
        },
        offwhite: {
          DEFAULT: "#F2F1EF",
          100: "#FFFFFF",
          200: "#F2F1EF",
          300: "#E7E5E1",
          400: "#D8D5CE",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(38, 41, 46, 0.25)",
        card: "0 2px 20px -4px rgba(38, 41, 46, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
