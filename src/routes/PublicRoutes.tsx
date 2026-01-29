import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/public/Home";
import ProductDetails from "../pages/public/ProductDetails";
import Register from "../pages/public/Register";
import Login from "../pages/public/Login";
import ForgotPassword from "../pages/public/ForgotPassword";

const PublicRoutes = () => {
  return (
    <>
      {/* Public pages WITH navbar/footer */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/ProductDetail" element={<ProductDetails />} />
        {/* Add other public pages here */}
      </Route>

      {/* Auth pages WITHOUT navbar/footer */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </>
  );
};

export default PublicRoutes;
