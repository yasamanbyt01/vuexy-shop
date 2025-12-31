import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const PublicLayout = () => {
  return (
    <div dir="rtl">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
