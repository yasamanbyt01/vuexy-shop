import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/public/Home";
import ProductDetails from "../pages/public/ProductDetails";
import Register from "../pages/public/Register";
import Login from "../pages/public/Login";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import Checkout from "../pages/public/Checkout";
import Products from "../pages/public/Products";
import SearchResults from "../pages/public/SearchResults";
import SearchPage from "../pages/public/MobileSearch";

const PublicRoutes = () => {
  return (
    <>
      {/* Public pages WITH navbar/footer */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories/:slug" element={<Products />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>

      <Route path="/mobile-search" element={<SearchPage />} />

      {/* Auth pages WITHOUT navbar/footer */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </>
  );
};

export default PublicRoutes;
