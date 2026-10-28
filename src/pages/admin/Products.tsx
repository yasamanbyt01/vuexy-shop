import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminConfirmModal from "../../components/Admin/AdminConfirmModal";
import { getCategories, type ApiCategory } from "../../services/categories";
import {
  deleteProduct,
  getProducts,
  type ApiProduct,
} from "../../services/products";
import { formatPrice } from "../../utils/price";

const PAGE_SIZE = 10;

const Products = () => {
  const { token } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [success, setSuccess] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [productToDelete, setProductToDelete] = useState<ApiProduct | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const state = location.state as { adminSuccess?: string } | null;
    if (state?.adminSuccess) setSuccess(state.adminSuccess);
  }, [location.state]);

  useEffect(() => {
    let cancelled = false;
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const result = await getCategories();
        if (!cancelled) setCategories(result);
      } catch (requestError) {
        if (!cancelled)
          setCategoriesError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت دسته‌بندی‌ها ناموفق بود.",
          );
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };
    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getProducts({
          search: searchTerm || undefined,
          categoryId: selectedCategory ? Number(selectedCategory) : undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;
        setProducts(result.data);
        setTotal(result.meta.total);
        setTotalPages(Math.max(result.meta.totalPages, 1));
      } catch (requestError) {
        if (!cancelled) {
          setProducts([]);
          setTotal(0);
          setTotalPages(1);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت محصولات ناموفق بود. اتصال API را بررسی کنید.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, selectedCategory, page, retryKey]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!productToDelete || !token) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteProduct(token, productToDelete.id);
      setProductToDelete(null);
      setSuccess("محصول با موفقیت حذف شد.");
      if (products.length === 1 && page > 1) setPage((value) => value - 1);
      else setRetryKey((value) => value + 1);
    } catch (requestError) {
      setDeleteError(
        requestError instanceof Error
          ? requestError.message
          : "حذف محصول ناموفق بود.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const startItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="admin-page" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">محصولات</h2>
          <p className="text-body-secondary mb-0">
            فهرست محصولات فروشگاه، جست‌وجو و مدیریت موجودی.
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <i className="icon-base ti tabler-plus me-1" aria-hidden="true" />
          افزودن محصول
        </Link>
      </div>

      {success && (
        <div
          className="alert alert-success d-flex align-items-center justify-content-between gap-2"
          role="status"
        >
          <span>{success}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="بستن"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      <section className="card">
        <div className="card-header border-bottom">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
              <h5 className="card-title mb-1">همه محصولات</h5>
              <p className="text-body-secondary small mb-0">
                {loading
                  ? "در حال بارگذاری..."
                  : `${total.toLocaleString("fa-IR")} محصول`}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-label-secondary btn-sm"
              onClick={() => setRetryKey((value) => value + 1)}
              disabled={loading || categoriesLoading}
            >
              <i
                className="icon-base ti tabler-refresh me-1"
                aria-hidden="true"
              />
              به‌روزرسانی
            </button>
          </div>
        </div>
        <div className="card-body pt-4">
          <form
            onSubmit={handleSearch}
            className="row g-3 align-items-end mb-4"
          >
            <div className="col-12 col-lg-5">
              <label htmlFor="admin-product-search" className="form-label">
                جست‌وجوی محصول
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i
                    className="icon-base ti tabler-search"
                    aria-hidden="true"
                  />
                </span>
                <input
                  id="admin-product-search"
                  type="search"
                  className="form-control"
                  placeholder="نام محصول را وارد کنید..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-7 col-lg-4">
              <label htmlFor="admin-product-category" className="form-label">
                دسته‌بندی
              </label>
              <select
                id="admin-product-category"
                className="form-select"
                value={selectedCategory}
                disabled={categoriesLoading || Boolean(categoriesError)}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-5 col-lg-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                <i
                  className="icon-base ti tabler-search me-1"
                  aria-hidden="true"
                />
                جست‌وجو
              </button>
              <button
                type="button"
                className="btn btn-label-secondary"
                onClick={resetFilters}
                title="پاک کردن فیلترها"
                aria-label="پاک کردن فیلترها"
              >
                <i className="icon-base ti tabler-x" aria-hidden="true" />
              </button>
            </div>
          </form>

          {categoriesError && (
            <div className="alert alert-warning" role="alert">
              {categoriesError} فیلتر دسته‌بندی فعلاً در دسترس نیست.
            </div>
          )}
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

          {loading ? (
            <div className="text-center py-5" role="status">
              <div
                className="spinner-border text-primary mb-3"
                aria-hidden="true"
              />
              <p className="text-body-secondary mb-0">
                در حال دریافت محصولات...
              </p>
            </div>
          ) : error ? null : products.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="icon-base ti tabler-search-off icon-2xl text-body-secondary mb-3"
                aria-hidden="true"
              />
              <h6>محصولی پیدا نشد</h6>
              <p className="text-body-secondary mb-3">
                عبارت جست‌وجو یا فیلتر دسته‌بندی را تغییر دهید.
              </p>
              <button
                type="button"
                className="btn btn-label-primary"
                onClick={resetFilters}
              >
                نمایش همه محصولات
              </button>
            </div>
          ) : (
            <>
              <div className="table-responsive admin-products-table-wrap">
                <table className="table table-hover align-middle admin-products-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">محصول</th>
                      <th scope="col">دسته‌بندی</th>
                      <th scope="col">SKU</th>
                      <th scope="col">قیمت</th>
                      <th scope="col">موجودی</th>
                      <th scope="col">وضعیت</th>
                      <th scope="col">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="admin-products-name-cell">
                          <div className="d-flex align-items-center gap-3">
                            {product.images[0] ? (
                              <img
                                className="admin-product-thumb"
                                src={product.images[0]}
                                alt=""
                                loading="lazy"
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
                              <div className="fw-medium admin-product-name">
                                {product.name}
                              </div>
                              <small className="text-body-secondary">
                                شناسه: {product.id.toLocaleString("fa-IR")}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{product.category?.name ?? "—"}</td>
                        <td>
                          <span className="admin-sku" dir="ltr">
                            {product.sku}
                          </span>
                        </td>
                        <td className="text-nowrap fw-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td>{product.stockCount.toLocaleString("fa-IR")}</td>
                        <td>
                          <span
                            className={`badge ${product.stockCount > 0 ? "bg-label-success" : "bg-label-danger"}`}
                          >
                            {product.stockCount > 0 ? "موجود" : "ناموجود"}
                          </span>
                        </td>
                        <td className="text-nowrap">
                          <div className="d-flex align-items-center gap-1">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="btn btn-icon btn-text-secondary btn-sm"
                              title="ویرایش محصول"
                              aria-label={`ویرایش ${product.name}`}
                            >
                              <i
                                className="icon-base ti tabler-edit"
                                aria-hidden="true"
                              />
                            </Link>
                            <button
                              type="button"
                              className="btn btn-icon btn-text-danger btn-sm"
                              title="حذف محصول"
                              aria-label={`حذف ${product.name}`}
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteError("");
                              }}
                            >
                              <i
                                className="icon-base ti tabler-trash"
                                aria-hidden="true"
                              />
                            </button>
                            <Link
                              to={`/products/${product.id}`}
                              className="btn btn-icon btn-text-secondary btn-sm"
                              title="مشاهده در فروشگاه"
                              aria-label={`مشاهده ${product.name} در فروشگاه`}
                            >
                              <i
                                className="icon-base ti tabler-external-link"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pt-4">
                <p className="text-body-secondary small mb-0">
                  نمایش {startItem.toLocaleString("fa-IR")} تا{" "}
                  {endItem.toLocaleString("fa-IR")} از{" "}
                  {total.toLocaleString("fa-IR")} محصول
                </p>
                <nav aria-label="صفحه‌بندی محصولات">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item${page <= 1 ? " disabled" : ""}`}>
                      <button
                        type="button"
                        className="page-link"
                        disabled={page <= 1}
                        onClick={() =>
                          setPage((value) => Math.max(1, value - 1))
                        }
                        aria-label="صفحه قبل"
                      >
                        <i
                          className="icon-base ti tabler-chevron-right"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                    <li className="page-item active" aria-current="page">
                      <span className="page-link">
                        {page.toLocaleString("fa-IR")} /{" "}
                        {totalPages.toLocaleString("fa-IR")}
                      </span>
                    </li>
                    <li
                      className={`page-item${page >= totalPages ? " disabled" : ""}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        disabled={page >= totalPages}
                        onClick={() =>
                          setPage((value) => Math.min(totalPages, value + 1))
                        }
                        aria-label="صفحه بعد"
                      >
                        <i
                          className="icon-base ti tabler-chevron-left"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      </section>

      <AdminConfirmModal
        show={Boolean(productToDelete)}
        title="حذف محصول"
        message={
          productToDelete
            ? `آیا از حذف محصول «${productToDelete.name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="بله، حذف شود"
        loading={deleteLoading}
        error={deleteError}
        onCancel={() => {
          if (!deleteLoading) {
            setProductToDelete(null);
            setDeleteError("");
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
};

export default Products;
