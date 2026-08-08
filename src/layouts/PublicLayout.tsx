import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/Navbar/PublicNavbar";
import PublicFooter from "../components/Footer/PublicFooter";

const PublicLayout = () => {
  return (
    <div dir="rtl" className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <Outlet />

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
