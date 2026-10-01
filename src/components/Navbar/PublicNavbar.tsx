import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MegaDropdown from "./MegaDropdown";
import MegaDropdownMobile from "./MegaDropdownMobile";
import { useCart } from "../../context/CartContext";
import { getProducts, type ApiProduct } from "../../services/products";
import { toFarsiNumber } from "../../utils/numbers";

const PublicNavbar = () => {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ApiProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.getElementById("navbarSupportedContent");

    const handleMenuOpen = () => {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    const handleMenuClose = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    navbar?.addEventListener("show.bs.collapse", handleMenuOpen);
    navbar?.addEventListener("hide.bs.collapse", handleMenuClose);

    return () => {
      navbar?.removeEventListener("show.bs.collapse", handleMenuOpen);
      navbar?.removeEventListener("hide.bs.collapse", handleMenuClose);

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setUsingKeyboard(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showSuggestions) return;

      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!showSuggestions) return;

      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        navigate(`/products/${selected.id}`);
        setShowSuggestions(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;

    const fetchSuggestions = async () => {
      try {
        const response = await getProducts({
          search: trimmedQuery,
          page: 1,
          limit: 6,
        });

        if (!cancelled) {
          setSuggestions(response.data);
          setShowSuggestions(response.data.length > 0);
          setSelectedIndex(-1);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const close = () => setShowSuggestions(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <nav className="layout-navbar py-1 bg-body position-sticky top-0 zindex-sticky navbar-mobile-fix">
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
                فروشگاه
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

            <ul className="navbar-nav align-items-center p-0 m-0 w-100">
              {/* DESKTOP ONLY */}
              <MegaDropdown />

              {/* MOBILE ONLY */}
              <MegaDropdownMobile />

              {/* Search box (desktop only) */}
              <form
                onSubmit={handleSearch}
                className="d-none d-lg-flex align-items-center ms-3 position-relative"
                role="search"
              >
                <div
                  className="input-group"
                  style={{ width: "390px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="search"
                    className="form-control border-end-0"
                    placeholder="جستجو در محصولات..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="input-group-text bg-transparent"
                    type="submit"
                  >
                    <i className="icon-base ti tabler-search"></i>
                  </button>
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      className={`position-absolute bg-white shadow rounded w-100 mt-1 ${usingKeyboard ? "keyboard-nav" : ""}`}
                      style={{ top: "100%", zIndex: 1050 }}
                    >
                      {suggestions.map((product, i) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className={
                            `d-flex align-items-center gap-2 p-2 text-decoration-none border-bottom suggestion-item ` +
                            (selectedIndex === i ? "bg-light" : "text-dark")
                          }
                          onMouseEnter={() => {
                            setUsingKeyboard(false);
                            setSelectedIndex(i);
                          }}
                          onClick={() => {
                            setShowSuggestions(false);
                            setQuery("");
                          }}
                        >
                          <span className="small">{product.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </ul>
          </div>

          <div className="landing-menu-overlay d-lg-none"></div>

          {/* Right toolbar */}
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="me-2">
              <Link
                to="/mobile-search"
                className="d-lg-none btn btn-outline-primary px-3 position-relative navbar-mobile-btn"
              >
                <i className="icon-base ti tabler-search"></i>
              </Link>
            </li>
            <li className="me-2">
              <Link
                to="/checkout"
                className="btn btn-outline-primary px-3 position-relative navbar-mobile-btn"
              >
                <i className="icon-base ti tabler-shopping-cart"></i>
                {itemCount > 0 && (
                  <span className="cart-badge">{toFarsiNumber(itemCount)}</span>
                )}
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="btn btn-primary navbar-mobile-btn"
              >
                <span className="tf-icons icon-base ti tabler-login scaleX-n1-rtl me-md-1"></span>
                <span className="navbar-login-text ms-1">ورود/ثبت نام</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
