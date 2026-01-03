import { Link } from "react-router-dom";
import Logo from "../../../assets/img/favicon/favicon.ico";

const PublicNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid">
        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          to="/"
        >
          <img src={Logo} alt="Vuexy" height="40" />
          VuexyShop
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavbar"
          aria-controls="publicNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="publicNavbar">
          {/* LEFT (RTL main) */}
          <ul className="navbar-nav me-auto align-items-lg-center gap-3 mt-3 mt-lg-0">
            {/* Search (desktop + mobile) */}
            <li className="nav-item w-100 w-lg-auto">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group w-100 w-lg-300px">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="جستجو محصول..."
                    aria-label="Search"
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="ti tabler-search"></i>
                  </button>
                </div>
              </form>
            </li>

            {/* Categories */}
            <li className="nav-item dropdown w-100 w-lg-auto">
              <div className="btn-group w-100 w-lg-auto">
                <button
                  type="button"
                  className="btn btn-label-primary dropdown-toggle w-100 px-3"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  دسته‌بندی‌ها
                </button>

                <ul className="dropdown-menu dropdown-menu-end w-100">
                  <li>
                    <Link className="dropdown-item" to="/categories/men">
                      مردانه
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/categories/women">
                      زنانه
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/categories/accessories"
                    >
                      اکسسوری
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          {/* RIGHT (actions) */}
          <ul className="navbar-nav align-items-lg-center gap-2 mt-3 mt-lg-0">
            {/* Cart */}
            <li className="nav-item">
              <Link
                to="/cart"
                className="btn btn-label-primary d-flex align-items-center justify-content-center px-3"
                aria-label="سبد خرید"
              >
                <i className="ti tabler-shopping-cart"></i>
              </Link>
            </li>

            {/* Profile */}
            <li className="nav-item">
              <Link to="/profile" className="btn btn-primary px-3">
                ورود/عضویت
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
