/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#38e07b",
        "primary-hover": "#2ccb6a",
        "primary-dark": "#2ec268",
        "background-light": "#f6f8f7",
        "background-dark": "#111714", // Home/Login pages
        "background-dark-alt": "#122017", // Club Details/Events/Register pages
        "card-dark": "#1c2620",
        "border-dark": "#29382f",
        "border-dark-alt": "#3d5245", // Login page
        "text-secondary": "#9eb7a8",
        "text-muted": "#9eb7a8",
        "surface-dark": "#1c2620", // Login page
        "surface-dark-alt": "#1c2e24", // Club Details page
        "surface-dark-alt2": "#1a2b22", // Events page
        "surface-dark-alt3": "#1a2c22", // Register page
        "surface-light": "#ffffff",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
        body: ["Spline Sans", "sans-serif"],
        "noto": ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem", // Home/Events pages
        "lg-alt": "2rem", // Club Details/Login/Register pages
        xl: "2rem", // Home page
        "xl-alt": "3rem", // Club Details/Login/Register pages
        "2xl": "2.5rem", // Events page
        "2xl-alt": "3rem", // Home page
        "3xl": "3rem",
        full: "9999px"
      },
    },
  },
  plugins: [],
}
