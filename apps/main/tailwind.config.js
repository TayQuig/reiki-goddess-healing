/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared-components/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "variable-collection-color-12": "var(--variable-collection-color-12)",
        "variable-collection-color-18": "var(--variable-collection-color-18)",
        "variable-collection-color": "var(--variable-collection-color)",
        "variable-collection-color-4": "var(--variable-collection-color-4)",
        "variable-collection-color-7": "var(--variable-collection-color-7)",
        "variable-collection-color-11": "var(--variable-collection-color-11)",
        "variable-collection-color-14": "var(--variable-collection-color-14)",
        "variable-collection-color-10": "var(--variable-collection-color-10)",
        "variable-collection-color-13": "var(--variable-collection-color-13)",
        "variable-collection-color-6": "var(--variable-collection-color-6)",
        "variable-collection-color-9": "var(--variable-collection-color-9)",
        "variable-collection-color-1": "var(--variable-collection-color-1)",
        "variable-collection-color-2": "var(--variable-collection-color-2)",
        "variable-collection-color-3": "var(--variable-collection-color-3)",
        "variable-collection-color-5": "var(--variable-collection-color-5)",
        "variable-collection-color-8": "var(--variable-collection-color-8)",
        "variable-collection-color-15": "var(--variable-collection-color-15)",
        "variable-collection-color-16": "var(--variable-collection-color-16)",
        "variable-collection-color-17": "var(--variable-collection-color-17)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.6s ease-out",
        fadeIn: "fadeIn 0.6s ease-out",
        slideInLeft: "slideInLeft 0.6s ease-out",
        slideInRight: "slideInRight 0.6s ease-out",
        scaleIn: "scaleIn 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
