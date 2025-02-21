import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
        "dark": "var(--color-dark)"
      }
    },
  },
  plugins: [],
  darkMode: "class"
} satisfies Config;
