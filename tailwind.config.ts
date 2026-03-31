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
        blue: {
          DEFAULT: "var(--blue)",
          dark: "var(--blue-dark)",
          light: "var(--blue-light)",
          pale: "var(--blue-pale)",
        },
        green: {
          DEFAULT: "var(--green)",
          pale: "var(--green-pale)",
          light: "var(--green-light)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
