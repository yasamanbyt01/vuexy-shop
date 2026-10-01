import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMegaMenuCategories,
  type MegaMenuCategory,
} from "../../services/megaMenu";

const MegaDropdownMobile = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<MegaMenuCategory[]>([]);

  // Load mega menu data from backend.
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const data = await getMegaMenuCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load mobile mega menu categories:", error);

        if (!cancelled) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Close the Bootstrap mobile navbar after navigating.
  const closeMobileMenu = () => {
    const navbar = document.getElementById("navbarSupportedContent");
    const toggler = document.querySelector(
      '#navbarSupportedContent .navbar-toggler[data-bs-toggle="collapse"]',
    ) as HTMLElement | null;

    if (navbar?.classList.contains("show") && toggler) {
      toggler.click();
    }
  };

  const toggleCategories = () => {
    setCategoriesOpen((prev) => !prev);

    if (categoriesOpen) {
      setOpenCategory(null);
    }
  };

  const toggleCategory = (slug: string) => {
    setOpenCategory((prev) => (prev === slug ? null : slug));
  };

  return (
    <>
      {/* ================================
          Main navigation links
      ================================= */}

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link"
          to="/"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-home mobile-menu-icon"></i>
            <span>خانه</span>
          </span>
        </Link>
      </li>

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link"
          to="/products"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-shopping-bag mobile-menu-icon"></i>
            <span>محصولات</span>
          </span>
        </Link>
      </li>

      {/* ================================
          Shopping highlights
      ================================= */}

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link mobile-menu-highlight"
          to="/products?specialOffers=true"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-tag mobile-menu-icon"></i>
            <span>پیشنهادهای ویژه</span>
          </span>

          <i className="icon-base ti tabler-chevron-left mobile-menu-arrow"></i>
        </Link>
      </li>

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link"
          to="/products?sort=popular"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-star mobile-menu-icon"></i>
            <span>پرفروش‌ترین‌ها</span>
          </span>

          <i className="icon-base ti tabler-chevron-left mobile-menu-arrow"></i>
        </Link>
      </li>

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link"
          to="/products?sort=newest"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-sparkles mobile-menu-icon"></i>
            <span>جدیدترین محصولات</span>
          </span>

          <i className="icon-base ti tabler-chevron-left mobile-menu-arrow"></i>
        </Link>
      </li>

      {/* ================================
          Categories
      ================================= */}

      <li className="nav-item d-lg-none mobile-categories-section">
        <button
          type="button"
          className="nav-link mobile-menu-link mobile-categories-toggle d-flex align-items-center justify-content-between w-100 border-0 bg-transparent text-start"
          onClick={toggleCategories}
          aria-expanded={categoriesOpen}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-category mobile-menu-icon"></i>
            <span>دسته‌بندی‌ها</span>
          </span>

          <i
            className={`icon-base ti tabler-chevron-down chevron-icon ${
              categoriesOpen ? "rotate-180" : ""
            }`}
          ></i>
        </button>

        {categoriesOpen && (
          <div id="mobileMegaMenu">
            <ul className="nav flex-column mobile-category-list">
              {categories.map((cat) => {
                const isOpen = openCategory === cat.slug;

                return (
                  <li className="nav-item mobile-category-item" key={cat.id}>
                    <button
                      type="button"
                      className="nav-link mobile-category-header d-flex align-items-center justify-content-between w-100 border-0 bg-transparent text-start"
                      onClick={() => toggleCategory(cat.slug)}
                      aria-expanded={isOpen}
                    >
                      <span className="d-flex align-items-center gap-3">
                        <span className="mobile-category-icon">
                          <i className={`icon-base ti ${cat.icon}`}></i>
                        </span>

                        <span className="fw-medium">{cat.name}</span>
                      </span>

                      <i
                        className={`icon-base ti tabler-chevron-down chevron-icon ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      ></i>
                    </button>

                    {isOpen && (
                      <ul className="nav flex-column mobile-subcategory-list">
                        {cat.subcategories.map((sub) => (
                          <li className="nav-item" key={sub.slug}>
                            <Link
                              className="nav-link mobile-subcategory-link"
                              to={`/products?category=${cat.slug}&tag=${encodeURIComponent(
                                sub.slug,
                              )}`}
                              onClick={closeMobileMenu}
                            >
                              <span>{sub.title}</span>

                              <span className="mobile-subcategory-count">
                                {sub.productCount}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>

      {/* ================================
          Information / support
      ================================= */}

      <li className="nav-item d-lg-none mobile-menu-divider"></li>

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link"
          to="/contact"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-phone mobile-menu-icon"></i>
            <span>تماس با ما</span>
          </span>

          <i className="icon-base ti tabler-chevron-left mobile-menu-arrow"></i>
        </Link>
      </li>

      <li className="nav-item d-lg-none">
        <Link
          className="nav-link mobile-menu-link"
          to="/about"
          onClick={closeMobileMenu}
        >
          <span className="d-flex align-items-center gap-3">
            <i className="icon-base ti tabler-info-circle mobile-menu-icon"></i>
            <span>درباره ما</span>
          </span>

          <i className="icon-base ti tabler-chevron-left mobile-menu-arrow"></i>
        </Link>
      </li>
    </>
  );
};

export default MegaDropdownMobile;
