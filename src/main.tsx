import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

// 1. First load core vendor CSS
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/pages/front-page.css";
import "./assets/vendor/libs/swiper/swiper.css";
import "./assets/vendor/fonts/iconify-icons.css";

// 2. Then load your custom CSS (so it can override vendor styles)
import "./assets/css/demo.css";

// 3. Then load JavaScript (CSS should be loaded before JS)
import "./assets/vendor/libs/node-waves/node-waves.js";
import "./assets/vendor/js/helpers.js";
import "./assets/js/config.js";
import "./assets/vendor/js/bootstrap.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
