import { Link } from "react-router-dom";

const MegaDropdownMobile = () => {
  return (
    <li className="nav-item d-lg-none pe-10">
      {/* Main toggle */}
      <a
        className="nav-link fw-medium d-flex align-items-center justify-content-between mt-7"
        data-bs-toggle="collapse"
        href="#mobileMegaMenu"
        role="button"
        aria-expanded="false"
        aria-controls="mobileMegaMenu"
      >
        دسته‌بندی‌ها
        <i className="icon-base ti tabler-chevron-down chevron-icon"></i>
      </a>

      <div className="collapse" id="mobileMegaMenu">
        <div className="pt-2">
          {/* دیجیتال */}
          <div className="mobile-category-item">
            <a
              className="mobile-category-header d-flex align-items-center justify-content-between py-2 px-2 rounded fw-medium text-heading"
              data-bs-toggle="collapse"
              href="#mobileDigital"
              role="button"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="avatar avatar-sm">
                  <span className="avatar-initial rounded bg-label-primary">
                    <i className="icon-base ti tabler-device-mobile"></i>
                  </span>
                </span>
                دیجیتال
              </div>
              <i className="icon-base ti tabler-chevron-down chevron-icon"></i>
            </a>

            <div className="collapse" id="mobileDigital">
              <ul className="list-unstyled mb-2 ps-4">
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    موبایل
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    لپ‌تاپ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* پوشاک */}
          <div className="mobile-category-item">
            <a
              className="mobile-category-header d-flex align-items-center justify-content-between py-2 px-2 rounded fw-medium text-heading"
              data-bs-toggle="collapse"
              href="#mobileFashion"
              role="button"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="avatar avatar-sm">
                  <span className="avatar-initial rounded bg-label-primary">
                    <i className="icon-base ti tabler-shirt"></i>
                  </span>
                </span>
                پوشاک
              </div>
              <i className="icon-base ti tabler-chevron-down chevron-icon"></i>
            </a>

            <div className="collapse" id="mobileFashion">
              <ul className="list-unstyled mb-2 ps-4">
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    مردانه
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    زنانه
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* کفش */}
          <div className="mobile-category-item">
            <a
              className="mobile-category-header d-flex align-items-center justify-content-between py-2 px-2 rounded fw-medium text-heading"
              data-bs-toggle="collapse"
              href="#mobileShoes"
              role="button"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="avatar avatar-sm">
                  <span className="avatar-initial rounded bg-label-primary">
                    <i className="icon-base ti tabler-shoe"></i>
                  </span>
                </span>
                کفش
              </div>
              <i className="icon-base ti tabler-chevron-down chevron-icon"></i>
            </a>

            <div className="collapse" id="mobileShoes">
              <ul className="list-unstyled mb-2 ps-4">
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    اسپرت
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    رسمی
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* اکسسوری */}
          <div className="mobile-category-item">
            <a
              className="mobile-category-header d-flex align-items-center justify-content-between py-2 px-2 rounded fw-medium text-heading"
              data-bs-toggle="collapse"
              href="#mobileAccessories"
              role="button"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="avatar avatar-sm">
                  <span className="avatar-initial rounded bg-label-primary">
                    <i className="icon-base ti tabler-diamond"></i>
                  </span>
                </span>
                اکسسوری
              </div>
              <i className="icon-base ti tabler-chevron-down chevron-icon"></i>
            </a>

            <div className="collapse" id="mobileAccessories">
              <ul className="list-unstyled mb-2 ps-4">
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    ساعت
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link py-1 mega-dropdown-link"
                    to="/products"
                  >
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    کیف
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaDropdownMobile;
