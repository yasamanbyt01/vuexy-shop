import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div dir="rtl">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
