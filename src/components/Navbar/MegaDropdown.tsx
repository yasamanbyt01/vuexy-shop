import { Link } from "react-router-dom";

const MegaDropdown = () => {
  return (
    <li className="nav-item mega-dropdown d-none d-lg-block">
      <a
        href="#"
        className="nav-link dropdown-toggle fw-medium"
        data-bs-toggle="dropdown"
        onClick={(e) => e.preventDefault()}
      >
        دسته‌بندی‌ها
      </a>

      <div className="dropdown-menu mega-menu p-4 p-xl-8">
        <div className="row gy-4">
          {/* Column 1 */}
          <div className="col-12 col-lg-3">
            <div className="h6 d-flex align-items-center mb-3 mb-lg-5">
              <div className="avatar flex-shrink-0 me-3">
                <span className="avatar-initial rounded bg-label-primary">
                  <i className="icon-base ti tabler-device-mobile icon-lg"></i>
                </span>
              </div>
              <span className="ps-1">دیجیتال</span>
            </div>

            <ul className="nav flex-column">
              {["موبایل", "لپ‌تاپ", "تبلت"].map((item) => (
                <li className="nav-item" key={item}>
                  <Link className="nav-link mega-dropdown-link" to="/products">
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div className="col-12 col-lg-3">
            <div className="h6 d-flex align-items-center mb-3 mb-lg-5">
              <div className="avatar flex-shrink-0 me-3">
                <span className="avatar-initial rounded bg-label-primary">
                  <i className="icon-base ti tabler-shirt icon-lg"></i>
                </span>
              </div>
              <span className="ps-1">پوشاک</span>
            </div>

            <ul className="nav flex-column">
              {["مردانه", "زنانه", "بچگانه"].map((item) => (
                <li className="nav-item" key={item}>
                  <Link className="nav-link mega-dropdown-link" to="/products">
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-12 col-lg-3">
            <div className="h6 d-flex align-items-center mb-3 mb-lg-5">
              <div className="avatar flex-shrink-0 me-3">
                <span className="avatar-initial rounded bg-label-primary">
                  <i className="icon-base ti tabler-shoe icon-lg"></i>
                </span>
              </div>
              <span className="ps-1">کفش</span>
            </div>

            <ul className="nav flex-column">
              {["ورزشی", "رسمی", "روزمره"].map((item) => (
                <li className="nav-item" key={item}>
                  <Link className="nav-link mega-dropdown-link" to="/products">
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className="col-12 col-lg-3">
            <div className="h6 d-flex align-items-center mb-3 mb-lg-5">
              <div className="avatar flex-shrink-0 me-3">
                <span className="avatar-initial rounded bg-label-primary">
                  <i className="icon-base ti tabler-diamond icon-lg"></i>
                </span>
              </div>
              <span className="ps-1">اکسسوری</span>
            </div>

            <ul className="nav flex-column">
              {["ساعت", "عینک", "زیورآلات"].map((item) => (
                <li className="nav-item" key={item}>
                  <Link className="nav-link mega-dropdown-link" to="/products">
                    <i className="icon-base ti tabler-circle me-1 icon-12px"></i>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaDropdown;
