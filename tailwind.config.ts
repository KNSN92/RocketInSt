import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        "main-content": "calc(100vh - var(--header-height))"
      },
      borderWidth: {
        1: "1px"
      },
      colors: {
        "light": "var(--color-light)",
        "dark": "var(--color-dark)",
        "bgcolor": "var(--bg-color)",
        "bgcolorinverse": "var(--bg-color-inverse)",
      }
    },
  },
  plugins: [],
  darkMode: "class"
} satisfies Config;
