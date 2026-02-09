import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="layout-navbar py-1 bg-body">
      <div className="container">
        <div className="navbar navbar-expand-lg landing-navbar px-3 px-md-8">
          {/* Logo + mobile toggle */}
          <div className="navbar-brand app-brand demo d-flex py-0 me-4 me-xl-8 ms-0">
            <button
              className="navbar-toggler border-0 px-0 me-4"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="icon-base ti tabler-menu-2 icon-lg align-middle text-heading fw-medium"></i>
            </button>

            <Link to="/" className="app-brand-link">
              <span className="app-brand-logo demo">
                <span className="text-primary">
                  <svg
                    width="32"
                    height="22"
                    viewBox="0 0 32 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.06"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                      fill="#161616"
                    />
                    <path
                      opacity="0.06"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                      fill="#161616"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </span>
              <span className="app-brand-text demo menu-text fw-bold ms-2 ps-1">
                Vuexy
              </span>
            </Link>
          </div>

          {/* Menu */}
          <div
            className="collapse navbar-collapse landing-nav-menu"
            id="navbarSupportedContent"
          >
            <button
              className="navbar-toggler border-0 text-heading position-absolute end-0 top-0 scaleX-n1-rtl p-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="icon-base ti tabler-x icon-lg"></i>
            </button>

            <ul className="navbar-nav align-items-center">
              {/* DESKTOP ONLY */}
              <li className="nav-item dropdown d-none d-lg-block">
                <a
                  className="nav-link dropdown-toggle fw-medium"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Electronics
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Clothing
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Books
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Accessories
                    </a>
                  </li>
                </ul>
              </li>

              {/* MOBILE ONLY */}
              <li className="nav-item d-lg-none">
                <a
                  className="nav-link fw-medium d-flex justify-content-between align-items-center"
                  data-bs-toggle="collapse"
                  href="#mobileCategories"
                  role="button"
                  aria-expanded="false"
                  aria-controls="mobileCategories"
                >
                  Categories
                  <i className="icon-base ti tabler-chevron-down"></i>
                </a>

                <div className="collapse ps-4" id="mobileCategories">
                  <ul className="list-unstyled mb-2">
                    <li className="py-1">
                      <a className="nav-link" href="#">
                        Electronics
                      </a>
                    </li>
                    <li className="py-1">
                      <a className="nav-link" href="#">
                        Clothing
                      </a>
                    </li>
                    <li className="py-1">
                      <a className="nav-link" href="#">
                        Books
                      </a>
                    </li>
                    <li className="py-1">
                      <a className="nav-link" href="#">
                        Accessories
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              {/* Search box (desktop only) */}
              <form
                className="d-none d-lg-flex align-items-center ms-3"
                role="search"
              >
                <div className="input-group" style={{ width: "390px" }}>
                  <input
                    type="search"
                    className="form-control border-end-0"
                    placeholder="Search products..."
                    aria-label="Search"
                  />
                  <span className="input-group-text bg-transparent">
                    <i className="icon-base ti tabler-search"></i>
                  </span>
                </div>
              </form>
            </ul>
          </div>

          <div className="landing-menu-overlay d-lg-none"></div>

          {/* Right toolbar */}
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="me-2">
              <Link to="/checkout" className="btn btn-outline-primary px-3">
                <i className="icon-base ti tabler-shopping-cart"></i>
              </Link>
            </li>

            <li>
              <Link to="/register" className="btn btn-primary">
                <span className="tf-icons icon-base ti tabler-login scaleX-n1-rtl me-md-1"></span>
                <span className="d-none d-md-block">Login / Register</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
