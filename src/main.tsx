import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.tsx";
import App from "./App.tsx";

// 1. Core vendor CSS (MUST be loaded first)
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/pages/front-page.css";
import "./assets/vendor/libs/bs-stepper/bs-stepper.css";
import "./assets/vendor/libs/swiper/swiper.css";
import "./assets/vendor/fonts/iconify-icons.css";

// 2. Form validation CSS (IMPORTANT for your login/register pages)
import "./assets/vendor/libs/@form-validation/form-validation.css";

// 3. Auth pages CSS
import "./assets/vendor/css/pages/page-auth.css";

// 4. Your custom CSS (loaded last to override vendor styles)
import "./assets/css/demo.css";
import "./assets/css/form-validation.css";

// 5. JavaScript files
import "./assets/vendor/js/helpers.js";
import "./assets/js/config.js";
import "./assets/vendor/libs/node-waves/node-waves.js";
import "./assets/vendor/js/bootstrap.js";
import "./assets/vendor/libs/bs-stepper/bs-stepper.js";
import "./assets/vendor/libs/swiper/swiper.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
