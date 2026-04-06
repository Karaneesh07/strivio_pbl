/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#121212",
        darkCard: "#1e1e1e",
        primary: "#bb86fc",
        secondary: "#03dac6",
        error: "#cf6679",
        success: "#4caf50"
      }
    },
  },
  plugins: [],
}
