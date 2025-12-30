import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./assets/css/demo.css";
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/pages/front-page.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
