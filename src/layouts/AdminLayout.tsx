import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../assets/css/admin.css";

const navItems = [
  { to: "/admin", label: "داشبورد", icon: "tabler-smart-home", end: true },
  {
    to: "/admin/products",
    label: "محصولات",
    icon: "tabler-package",
    end: false,
  },
  {
    to: "/admin/categories",
    label: "دسته‌بندی‌ها",
    icon: "tabler-category",
    end: false,
  },
  {
    to: "/admin/orders",
    label: "سفارش‌ها",
    icon: "tabler-shopping-cart",
    end: false,
  },
];

const getPageTitle = (pathname: string) => {
  if (pathname === "/admin/products/new") return "افزودن محصول";
  if (/^\/admin\/products\/\d+\/edit$/.test(pathname)) return "ویرایش محصول";
  if (pathname.startsWith("/admin/products")) return "مدیریت محصولات";
  if (pathname.startsWith("/admin/categories")) return "مدیریت دسته‌بندی‌ها";
  if (/^\/admin\/orders\/\d+$/.test(pathname)) return "جزئیات سفارش";
  if (pathname.startsWith("/admin/orders")) return "مدیریت سفارش‌ها";
  return "داشبورد فروشگاه";
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell" dir="rtl">
      <div className="admin-layout-container">
        <aside
          className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}
          aria-label="منوی مدیریت"
        >
          <div className="admin-sidebar-brand">
            <Link
              to="/admin"
              className="admin-brand-link"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-brand-mark" aria-hidden="true">
                <span className="admin-brand-letter">V</span>
              </span>
              <span className="admin-brand-name">VuexyShop</span>
            </Link>
            <button
              className="btn btn-icon btn-text-secondary d-xl-none"
              type="button"
              aria-label="بستن منو"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="icon-base ti tabler-x" aria-hidden="true" />
            </button>
          </div>

          <div className="admin-sidebar-caption">مدیریت فروشگاه</div>
          <nav className="admin-sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `admin-sidebar-link${isActive ? " active" : ""}`
                }
              >
                <i className={`icon-base ti ${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-avatar" aria-hidden="true">
              {(user?.name?.trim().charAt(0) || "م").toLocaleUpperCase("fa-IR")}
            </div>
            <div className="admin-user-summary">
              <div className="admin-user-name">
                {user?.name || "مدیر فروشگاه"}
              </div>
              <div className="admin-user-role">مدیر سیستم</div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-overlay"
            aria-label="بستن منو"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="d-flex align-items-center gap-2 min-w-0">
              <button
                type="button"
                className="btn btn-icon btn-text-secondary d-xl-none"
                aria-label="باز کردن منو"
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen(true)}
              >
                <i className="icon-base ti tabler-menu-2" aria-hidden="true" />
              </button>
              <div className="admin-topbar-title">
                <span className="text-body-secondary small admin-topbar-breadcrumb">
                  VuexyShop / پنل مدیریت
                </span>
                <h1 className="h5 mb-0">{getPageTitle(location.pathname)}</h1>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0 admin-topbar-actions">
              <Link
                to="/"
                className="btn btn-label-secondary admin-topbar-action admin-store-link"
                aria-label="مشاهده فروشگاه"
                title="مشاهده فروشگاه"
              >
                <i
                  className="icon-base ti tabler-external-link"
                  aria-hidden="true"
                />
                <span className="admin-store-link-label-full">
                  مشاهده فروشگاه
                </span>
                <span className="admin-store-link-label-compact">فروشگاه</span>
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger admin-topbar-action"
                onClick={handleLogout}
              >
                <i
                  className="icon-base ti tabler-logout me-sm-1"
                  aria-hidden="true"
                />
                <span className="d-none d-sm-inline">خروج</span>
              </button>
            </div>
          </header>

          <main className="admin-content">
            <Outlet />
          </main>

          <footer className="admin-footer">
            <span>VuexyShop</span>
            <span>پنل مدیریت فروشگاه</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
