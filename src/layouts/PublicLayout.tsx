import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/ui/Navbar/PublicNavbar";
import Home from "../pages/public/Home";

const PublicLayout = () => {
  return (
    <div dir="rtl">
      <PublicNavbar />
      <Home />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
