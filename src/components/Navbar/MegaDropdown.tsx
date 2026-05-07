import { Link } from "react-router-dom";
import { useState } from "react";
import { categories } from "../../mock/categories";

const MegaDropdown = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

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

      <div className="dropdown-menu mega-menu p-3">
        <div className="row g-2">
          {/* Categories */}
          <div className="col-3 border-end pe-2">
            <ul className="nav flex-column">
              {categories.map((category) => (
                <li key={category.id} className="nav-item">
                  <button
                    className={`nav-link d-flex align-items-center w-100 text-start py-2 px-3 rounded ${
                      activeCategory.slug === category.slug ? "active-cat" : ""
                    }`}
                    onMouseEnter={() => setActiveCategory(category)}
                  >
                    <i className={`ti ${category.icon} me-2`}></i>
                    <span>{category.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Preview */}
          {/* Subcategories */}
          <div className="col-9 ps-3">
            <div className="mb-3">
              <Link
                to={`/products?category=${activeCategory.slug}`}
                className="fw-semibold text-decoration-none"
              >
                مشاهده همه محصولات {activeCategory.title}
                <i className="icon-base ti tabler-chevron-left ms-1"></i>
              </Link>

              <div className="text-muted small mt-1">
                {activeCategory.productCount} محصول
              </div>
            </div>

            <div className="row">
              {activeCategory.subcategories.map((sub) => (
                <div key={sub.slug} className="col-6 mb-3">
                  <Link
                    to={`/products?category=${activeCategory.slug}&tag=${sub.slug}`}
                    className="text-muted text-decoration-none"
                  >
                    {sub.title}
                    <span className="text-secondary small ms-1">
                      ({sub.productCount})
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaDropdown;
