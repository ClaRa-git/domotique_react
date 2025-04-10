/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        loading: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "loading-bar": "loading 2s ease-in-out infinite",
      },
      colors: {
        hoomyDark: "#1c1a26",
        hoomyOrange: "#f2803e",
        hoomyLight: "#dfe4ea",
      },
    },
  },
  plugins: [],
};
