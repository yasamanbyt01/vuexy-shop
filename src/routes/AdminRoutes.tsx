import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import ProductForm from "../pages/admin/ProductForm";
import Categories from "../pages/admin/Categories";
import Orders from "../pages/admin/Orders";
import OrderDetails from "../pages/admin/OrderDetails";
import Users from "../pages/admin/Users";
import UserDetails from "../pages/admin/UserDetails";
import RequireAdmin from "./RequireAdmin";

const AdminRoutes = () => (
  <Route
    path="/admin"
    element={
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="products/:id/edit" element={<ProductForm />} />
    <Route path="categories" element={<Categories />} />
    <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetails />} />
    <Route path="users" element={<Users />} />
    <Route path="users/:id" element={<UserDetails />} />
  </Route>
);

export default AdminRoutes;
