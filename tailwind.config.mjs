/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "hippy-blue": {
          50: "#f1f8fa",
          100: "#dcecf1",
          200: "#bedbe3",
          300: "#90c0d0",
          400: "#579bb2",
          500: "#40829a",
          600: "#386b82",
          700: "#33586b",
          800: "#304b5a",
          900: "#2c404d",
          950: "#192933",
        },
      },
    },
  },
  plugins: [],
};
