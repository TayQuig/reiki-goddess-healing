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
    },
  },
  plugins: [],
};
