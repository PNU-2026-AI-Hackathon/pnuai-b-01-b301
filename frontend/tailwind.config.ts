import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // FarmFi 디자인 시안 팔레트 (farm/generated_designs/farmfi-plan)
        cream: {
          50: "#FAF9F4",
          100: "#F6F5EE",
          200: "#EFEDE2",
          300: "#E5E2D3",
        },
        forest: {
          50: "#EDF5EF",
          100: "#D8EADD",
          200: "#AFD4BA",
          300: "#7BB68D",
          400: "#4C9663",
          500: "#2F7D4B",
          600: "#1F6B3C",
          700: "#1B5731",
          800: "#173F27",
          900: "#12301F",
        },
        leaf: {
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
        },
        ink: {
          900: "#1A1F1B",
          700: "#3C443E",
          500: "#6B7268",
          400: "#8B9088",
        },
        line: "#E6E3D6",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,40,25,0.04), 0 8px 24px rgba(20,40,25,0.06)",
        hero: "0 24px 60px rgba(18,48,31,0.14)",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
