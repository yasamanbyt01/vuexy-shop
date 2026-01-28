import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import ProductDetails from "../pages/public/ProductDetails";

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="/ProductDetail" element={<ProductDetails />} />
    </Route>
  );
};

export default PublicRoutes;
