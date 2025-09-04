import { createVitestConfig } from "../../vitest.config.shared";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default createVitestConfig(__dirname);
