import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCategories, type ApiCategory } from "../../services/categories";
import {
  getProducts,
  type ApiProduct,
  type ProductsResponse,
} from "../../services/products";
import { formatPrice } from "../../utils/price";

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [productResult, categoryResult]: [
          ProductsResponse,
          ApiCategory[],
        ] = await Promise.all([
          getProducts({ page: 1, limit: 5 }),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(productResult.data);
          setTotalProducts(productResult.meta.total);
          setCategories(categoryResult);
        }
      } catch {
        if (!cancelled) {
          setError(
            "دریافت اطلاعات داشبورد با خطا مواجه شد. اتصال API را بررسی کنید.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return (
    <div className="admin-page" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">
            خوش آمدید{user?.name ? `، ${user.name}` : ""} 👋
          </h2>
          <p className="text-body-secondary mb-0">
            نمای کلی فروشگاه و دسترسی سریع به بخش‌های مدیریتی.
          </p>
        </div>
        <Link to="/admin/products" className="btn btn-primary">
          <i className="icon-base ti tabler-package me-1" aria-hidden="true" />
          مدیریت محصولات
        </Link>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setRetryKey((value) => value + 1)}
          >
            تلاش دوباره
          </button>
        </div>
      )}

      <div className="row g-4 mb-6">
        <div className="col-12 col-sm-6 col-xxl-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="avatar avatar-lg">
                <span className="avatar-initial rounded bg-label-primary">
                  <i
                    className="icon-base ti tabler-package icon-xl"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-body-secondary">کل محصولات</p>
                <h3 className="mb-0">
                  {loading ? (
                    <span
                      className="placeholder col-4"
                      aria-label="در حال بارگذاری"
                    />
                  ) : (
                    totalProducts.toLocaleString("fa-IR")
                  )}
                </h3>
                <Link to="/admin/products" className="small">
                  مشاهده فهرست محصولات
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xxl-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="avatar avatar-lg">
                <span className="avatar-initial rounded bg-label-success">
                  <i
                    className="icon-base ti tabler-category icon-xl"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-body-secondary">دسته‌بندی‌ها</p>
                <h3 className="mb-0">
                  {loading ? (
                    <span
                      className="placeholder col-4"
                      aria-label="در حال بارگذاری"
                    />
                  ) : (
                    categories.length.toLocaleString("fa-IR")
                  )}
                </h3>
                <Link to="/admin/categories" className="small">
                  بخش دسته‌بندی‌ها
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xxl-4">
          <div className="card h-100 admin-dashboard-tip">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i
                  className="icon-base ti tabler-info-circle icon-lg text-primary"
                  aria-hidden="true"
                />
                <h5 className="mb-0">راهنمای مدیریت</h5>
              </div>
              <p className="text-body-secondary mb-0">
                برای مدیریت موجودی و جزئیات کالاها از فهرست محصولات استفاده
                کنید. فرم‌های افزودن و ویرایش در مرحله بعد به پنل اضافه می‌شوند.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <section className="card h-100">
            <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <h5 className="card-title mb-1">نمای کلی محصولات</h5>
                <p className="text-body-secondary small mb-0">
                  نمونه‌ای از محصولات دریافت‌شده از API فروشگاه
                </p>
              </div>
              <Link
                to="/admin/products"
                className="btn btn-label-primary btn-sm"
              >
                مشاهده همه
              </Link>
            </div>

            {loading ? (
              <div className="card-body text-center py-5" role="status">
                در حال دریافت اطلاعات...
              </div>
            ) : products.length === 0 ? (
              <div className="card-body text-center py-5">
                <i
                  className="icon-base ti tabler-package-off icon-2xl text-body-secondary mb-3"
                  aria-hidden="true"
                />
                <p className="mb-0">هنوز محصولی برای نمایش وجود ندارد.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>محصول</th>
                      <th>دسته‌بندی</th>
                      <th>قیمت</th>
                      <th>موجودی</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="admin-product-thumb"
                              />
                            ) : (
                              <span className="admin-product-thumb admin-product-thumb-placeholder">
                                <i
                                  className="icon-base ti tabler-photo"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                            <div className="min-w-0">
                              <div className="fw-medium text-truncate admin-product-name">
                                {product.name}
                              </div>
                              <small className="text-body-secondary" dir="ltr">
                                {product.sku}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{product.category?.name ?? "—"}</td>
                        <td className="text-nowrap">
                          {formatPrice(product.price)}
                        </td>
                        <td>
                          <span
                            className={`badge ${product.stockCount > 0 ? "bg-label-success" : "bg-label-danger"}`}
                          >
                            {product.stockCount > 0 ? "موجود" : "ناموجود"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">دسترسی سریع</h5>
            </div>
            <div className="card-body d-grid gap-3">
              <Link to="/admin/products" className="admin-quick-link">
                <span className="avatar avatar-md">
                  <span className="avatar-initial rounded bg-label-primary">
                    <i
                      className="icon-base ti tabler-list-details"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="flex-grow-1">
                  <strong className="d-block">فهرست محصولات</strong>
                  <small className="text-body-secondary">
                    جست‌وجو و بررسی موجودی
                  </small>
                </span>
                <i
                  className="icon-base ti tabler-chevron-left"
                  aria-hidden="true"
                />
              </Link>
              <Link to="/admin/categories" className="admin-quick-link">
                <span className="avatar avatar-md">
                  <span className="avatar-initial rounded bg-label-success">
                    <i
                      className="icon-base ti tabler-category"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="flex-grow-1">
                  <strong className="d-block">دسته‌بندی‌ها</strong>
                  <small className="text-body-secondary">
                    دسترسی به مدیریت دسته‌ها
                  </small>
                </span>
                <i
                  className="icon-base ti tabler-chevron-left"
                  aria-hidden="true"
                />
              </Link>
              <div className="admin-dashboard-note small text-body-secondary">
                <i
                  className="icon-base ti tabler-chart-bar me-1"
                  aria-hidden="true"
                />
                آمار فروش و درآمد تا زمان اتصال و تعریف گزارش‌های سفارش در این
                صفحه نمایش داده نمی‌شوند.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
