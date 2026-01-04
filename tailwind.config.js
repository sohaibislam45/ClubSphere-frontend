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
        "dashboard-primary": "#10b981", // Dashboard light mode primary
        "dashboard-primary-dark": "#059669", // Dashboard light mode primary dark
        "background-light": "#f6f8f7",
        "background-dark": "#111714", // Home/Login pages
        "background-dark-alt": "#122017", // Club Details/Events/Register pages
        "dashboard-background": "#f8fafc", // Dashboard light mode background
        "dashboard-sidebar": "#ffffff", // Dashboard light mode sidebar
        "dashboard-surface": "#ffffff", // Dashboard light mode surface
        "dashboard-surface-hover": "#f1f5f9", // Dashboard light mode surface hover
        "dashboard-text-main": "#0f172a", // Dashboard light mode text main
        "card-dark": "#1c2620",
        "card-light": "#ffffff",
        "border-dark": "#29382f",
        "border-light": "#e2e8f0",
        "dashboard-border": "#e2e8f0", // Dashboard light mode border
        "border-dark-alt": "#3d5245", // Login page
        "text-main": "#111714", // Light mode primary text
        "text-secondary": "#9eb7a8", // Dark mode secondary text
        "text-muted": "#64748b", // Light mode muted text (dark mode uses text-secondary)
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
