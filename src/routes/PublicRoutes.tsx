import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import ProductDetails from "../pages/public/ProductDetails";
import Register from "../pages/public/Register";

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="/ProductDetail" element={<ProductDetails />} />
      <Route path="/register" element={<Register />} />
    </Route>
  );
};

export default PublicRoutes;
