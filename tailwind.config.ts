import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "#FAF7F2",
          card: "#FFFFFF",
          dark: "#1C1A14",
        },
        accent: {
          DEFAULT: "#B5530A",
          light: "#FAE8DA",
          mid: "#E07040",
        },
        text: {
          DEFAULT: "#1C1A14",
          muted: "#7A7060",
          light: "#B0A898",
        },
      },
      maxWidth: {
        mobile: "430px",
      },
    },
  },
  plugins: [],
};
export default config;
