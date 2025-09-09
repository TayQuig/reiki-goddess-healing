import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Contact } from "./screens/Contact/Contact";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Contact />
  </StrictMode>
);
