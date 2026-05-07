import { Link } from "react-router-dom";
import { categories } from "../../mock/categories";

const MegaDropdownMobile = () => {
  // تابعی برای بستن منوی موبایل
  const closeMobileMenu = () => {
    const navbar = document.getElementById("navbarSupportedContent");
    const toggler = document.querySelector(".navbar-toggler") as HTMLElement;

    // اگر منو باز است، روی دکمه تغییر وضعیت (toggler) کلیک کن تا بسته شود
    if (navbar?.classList.contains("show") && toggler) {
      toggler.click();
    }
  };

  return (
    <>
      {/* لینک‌های ثابت */}
      <li className="nav-item d-lg-none mt-2">
        <Link className="nav-link fw-medium" to="/" onClick={closeMobileMenu}>
          خانه
        </Link>
      </li>
      <li className="nav-item d-lg-none">
        <Link
          className="nav-link fw-medium"
          to="/products"
          onClick={closeMobileMenu}
        >
          محصولات
        </Link>
      </li>

      {/* منوی دراپ‌داون دسته‌بندی‌ها */}
      <li className="nav-item d-lg-none">
        <a
          className="nav-link fw-medium d-flex align-items-center justify-content-between"
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
          <ul className="nav flex-column pt-2">
            {categories.map((cat) => (
              <li className="nav-item mobile-category-item" key={cat.id}>
                <a
                  className="nav-link mobile-category-header d-flex align-items-center justify-content-between px-2 py-2 rounded text-heading"
                  data-bs-toggle="collapse"
                  href={`#mobileCategory-${cat.slug}`}
                  role="button"
                  aria-expanded="false"
                  aria-controls={`mobileCategory-${cat.slug}`}
                >
                  <span className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm flex-shrink-0">
                      <span className="avatar-initial rounded bg-label-primary">
                        <i className={`icon-base ti ${cat.icon}`}></i>
                      </span>
                    </span>
                    <span className="fw-medium">{cat.title}</span>
                  </span>

                  <i className="icon-base ti tabler-chevron-down chevron-icon"></i>
                </a>

                <div className="collapse" id={`mobileCategory-${cat.slug}`}>
                  <ul className="nav flex-column mb-2 ps-4">
                    {cat.subcategories.map((sub) => (
                      <li className="nav-item" key={sub.slug}>
                        <Link
                          className="nav-link mega-dropdown-link"
                          to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                          onClick={closeMobileMenu} // اضافه کردن رویداد کلیک به لینک‌های زیرمجموعه
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </>
  );
};

export default MegaDropdownMobile;
