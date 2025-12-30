import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div dir="rtl">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
