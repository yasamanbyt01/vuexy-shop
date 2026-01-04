import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/ui/Navbar/PublicNavbar";
import PublicFooter from "../components/ui/Footer/PublicFooter";

const PublicLayout = () => {
  return (
    <div dir="rtl">
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
