import type { Config } from "tailwindcss";
import { colors } from "./colors";
import { fontFamilies, fontSizes, fontWeights } from "./typography";

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        ...colors,
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
      fontFamily: fontFamilies,
      fontSize: fontSizes,
      fontWeight: fontWeights,
    },
  },
  plugins: [],
};

export default config;