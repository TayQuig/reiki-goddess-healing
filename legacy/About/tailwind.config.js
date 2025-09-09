/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "variable-collection-color": "var(--variable-collection-color)",
        "variable-collection-color-2": "var(--variable-collection-color-2)",
        "variable-collection-color-3": "var(--variable-collection-color-3)",
        "variable-collection-color-4": "var(--variable-collection-color-4)",
        "variable-collection-color-4-duplicate":
          "var(--variable-collection-color-4-duplicate)",
        "variable-collection-color-5": "var(--variable-collection-color-5)",
        "variable-collection-color-6": "var(--variable-collection-color-6)",
        "variable-collection-color-6-duplicate":
          "var(--variable-collection-color-6-duplicate)",
        "variable-collection-color-duplicate":
          "var(--variable-collection-color-duplicate)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
