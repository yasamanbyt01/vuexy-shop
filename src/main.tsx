import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./assets/css/demo.css";
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/pages/front-page.css";
import "./assets/vendor/libs/node-waves/node-waves.js";
import "./assets/vendor/js/helpers.js";
import "./assets/js/config.js";
import "./assets/vendor/js/bootstrap.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
