// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust if your files live elsewhere
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f23",
        foreground: "#e2e8f0",
        primary: "#40e0d0",
        sponsorHeading: "#c3073f",
      },
    },
  },
  plugins: [],
};
