import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
    </Route>
  );
};

export default PublicRoutes;
