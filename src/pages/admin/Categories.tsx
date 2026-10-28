import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import AdminConfirmModal from "../../components/Admin/AdminConfirmModal";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryImageUrl,
  updateCategory,
  type ApiCategory,
  type CategoryWritePayload,
} from "../../services/categories";

interface CategoryFormValues {
  name: string;
  slug: string;
  image: string;
  icon: string;
}

const EMPTY_FORM: CategoryFormValues = {
  name: "",
  slug: "",
  image: "",
  icon: "tabler-category",
};

const Categories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [success, setSuccess] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(
    null,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_FORM);
  const [categoryToDelete, setCategoryToDelete] = useState<ApiCategory | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getCategories();
        if (!cancelled) setCategories(result);
      } catch (requestError) {
        if (!cancelled)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت دسته‌بندی‌ها ناموفق بود.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      [category.name, category.slug, category.icon].some((value) =>
        value.toLocaleLowerCase().includes(query),
      ),
    );
  }, [categories, search]);

  const openCreate = () => {
    setFormOpen(true);
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setModalError("");
    setSuccess("");
  };

  const openEdit = (category: ApiCategory) => {
    setFormOpen(true);
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      image: category.image ?? "",
      icon: category.icon ?? "tabler-category",
    });
    setModalError("");
    setSuccess("");
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingCategory(null);
    setModalError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setModalError("");

    if (!token) {
      setModalError("نشست مدیر معتبر نیست. دوباره وارد حساب شوید.");
      return;
    }

    const payload: CategoryWritePayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      image: form.image.trim(),
      icon: form.icon.trim(),
    };

    if (!payload.name || !payload.slug || !payload.image || !payload.icon) {
      setModalError(
        "همه فیلدها الزامی هستند. برای تصویر می‌توانید مسیر یا URL وارد کنید.",
      );
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(token, editingCategory.id, payload);
        setSuccess("دسته‌بندی با موفقیت ویرایش شد.");
      } else {
        await createCategory(token, payload);
        setSuccess("دسته‌بندی جدید با موفقیت ایجاد شد.");
      }
      setFormOpen(false);
      setEditingCategory(null);
      setRetryKey((value) => value + 1);
    } catch (requestError) {
      setModalError(
        requestError instanceof Error
          ? requestError.message
          : "ذخیره دسته‌بندی ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete || !token) return;
    setDeleting(true);
    setModalError("");
    try {
      await deleteCategory(token, categoryToDelete.id);
      setCategoryToDelete(null);
      setSuccess("دسته‌بندی با موفقیت حذف شد.");
      setRetryKey((value) => value + 1);
    } catch (requestError) {
      setModalError(
        requestError instanceof Error
          ? requestError.message
          : "حذف دسته‌بندی ناموفق بود.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">دسته‌بندی‌ها</h2>
          <p className="text-body-secondary mb-0">
            ایجاد، ویرایش و مدیریت دسته‌بندی‌های فروشگاه.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          <i className="icon-base ti tabler-plus me-1" aria-hidden="true" />
          افزودن دسته‌بندی
        </button>
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
            disabled={loading}
          >
            تلاش دوباره
          </button>
        </div>
      )}

      <section className="card">
        <div className="card-header border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h5 className="card-title mb-1">فهرست دسته‌بندی‌ها</h5>
            <p className="text-body-secondary small mb-0">
              {loading
                ? "در حال بارگذاری..."
                : `${filteredCategories.length.toLocaleString("fa-IR")} از ${categories.length.toLocaleString("fa-IR")} دسته‌بندی`}
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <div className="input-group admin-category-search">
              <span className="input-group-text">
                <i className="icon-base ti tabler-search" aria-hidden="true" />
              </span>
              <input
                className="form-control"
                type="search"
                placeholder="جست‌وجوی نام یا slug..."
                aria-label="جست‌وجوی دسته‌بندی"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-label-secondary btn-sm"
              onClick={() => setRetryKey((value) => value + 1)}
              disabled={loading}
              aria-label="به‌روزرسانی دسته‌بندی‌ها"
            >
              <i className="icon-base ti tabler-refresh" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5" role="status">
              <div
                className="spinner-border text-primary mb-3"
                aria-hidden="true"
              />
              <p className="text-body-secondary mb-0">
                در حال دریافت دسته‌بندی‌ها...
              </p>
            </div>
          ) : error ? null : filteredCategories.length === 0 ? (
            <div className="text-center py-5 px-3">
              <i
                className="icon-base ti tabler-category-off icon-2xl text-body-secondary mb-3"
                aria-hidden="true"
              />
              <h6>
                {search
                  ? "دسته‌بندی‌ای پیدا نشد"
                  : "هنوز دسته‌بندی‌ای ثبت نشده است"}
              </h6>
              <p className="text-body-secondary mb-3">
                {search
                  ? "عبارت جست‌وجو را تغییر دهید."
                  : "برای شروع اولین دسته‌بندی فروشگاه را ایجاد کنید."}
              </p>
              {search ? (
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={() => setSearch("")}
                >
                  پاک کردن جست‌وجو
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openCreate}
                >
                  افزودن دسته‌بندی
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle admin-products-table mb-0">
                <thead>
                  <tr>
                    <th scope="col">دسته‌بندی</th>
                    <th scope="col">Slug</th>
                    <th scope="col">آیکون</th>
                    <th scope="col" className="text-end">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {category.image ? (
                            <img
                              className="admin-category-thumb"
                              src={getCategoryImageUrl(category.image)}
                              alt=""
                              loading="lazy"
                            />
                          ) : (
                            <span className="admin-category-thumb admin-product-thumb-placeholder">
                              <i
                                className="icon-base ti tabler-category"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="fw-medium">{category.name}</div>
                            <small className="text-body-secondary">
                              شناسه: {category.id.toLocaleString("fa-IR")}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code dir="ltr">{category.slug}</code>
                      </td>
                      <td>
                        <span className="d-inline-flex align-items-center gap-2">
                          <i
                            className={`icon-base ti ${category.icon || "tabler-category"}`}
                            aria-hidden="true"
                          />
                          <code dir="ltr">{category.icon || "—"}</code>
                        </span>
                      </td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-icon btn-text-secondary btn-sm"
                          onClick={() => openEdit(category)}
                          title="ویرایش"
                          aria-label={`ویرایش ${category.name}`}
                        >
                          <i
                            className="icon-base ti tabler-edit"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-text-danger btn-sm"
                          onClick={() => {
                            setCategoryToDelete(category);
                            setModalError("");
                          }}
                          title="حذف"
                          aria-label={`حذف ${category.name}`}
                        >
                          <i
                            className="icon-base ti tabler-trash"
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <CategoryFormModal
        show={formOpen}
        isEditing={Boolean(editingCategory)}
        form={form}
        saving={saving}
        error={modalError}
        onChange={setForm}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <AdminConfirmModal
        show={Boolean(categoryToDelete)}
        title="حذف دسته‌بندی"
        message={
          categoryToDelete
            ? `آیا از حذف دسته‌بندی «${categoryToDelete.name}» مطمئن هستید؟ اگر محصولی به این دسته‌بندی وابسته باشد، حذف انجام نخواهد شد.`
            : ""
        }
        confirmLabel="بله، حذف شود"
        loading={deleting}
        error={modalError}
        onCancel={() => {
          if (!deleting) {
            setCategoryToDelete(null);
            setModalError("");
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
};

interface CategoryFormModalProps {
  show: boolean;
  isEditing: boolean;
  form: CategoryFormValues;
  saving: boolean;
  error: string;
  onChange: (form: CategoryFormValues) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CategoryFormModal = ({
  show,
  isEditing,
  form,
  saving,
  error,
  onChange,
  onClose,
  onSubmit,
}: CategoryFormModalProps) => {
  if (!show) return null;
  const updateField = (key: keyof CategoryFormValues, value: string) =>
    onChange({ ...form, [key]: value });

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        tabIndex={-1}
        dir="rtl"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
              <div className="modal-header">
                <h5 id="category-form-title" className="modal-title">
                  {isEditing ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
                </h5>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  onClick={onClose}
                  disabled={saving}
                  aria-label="بستن"
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="admin-category-name">
                      نام دسته‌بندی
                    </label>
                    <input
                      id="admin-category-name"
                      className="form-control"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      minLength={2}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="admin-category-slug">
                      Slug
                    </label>
                    <input
                      id="admin-category-slug"
                      className="form-control"
                      dir="ltr"
                      placeholder="phone-accessories"
                      pattern="[a-z0-9-]+"
                      title="فقط حروف انگلیسی کوچک، عدد و خط تیره"
                      value={form.slug}
                      onChange={(event) =>
                        updateField("slug", event.target.value.toLowerCase())
                      }
                      minLength={2}
                      required
                    />
                    <small className="text-body-secondary">
                      فقط حروف انگلیسی کوچک، عدد و خط تیره.
                    </small>
                  </div>
                  <div className="col-12">
                    <label
                      className="form-label"
                      htmlFor="admin-category-image"
                    >
                      مسیر یا URL تصویر
                    </label>
                    <input
                      id="admin-category-image"
                      className="form-control"
                      dir="ltr"
                      placeholder="/uploads/categories/example.jpg یا https://..."
                      value={form.image}
                      onChange={(event) =>
                        updateField("image", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="admin-category-icon">
                      نام آیکون Vuexy
                    </label>
                    <input
                      id="admin-category-icon"
                      className="form-control"
                      dir="ltr"
                      placeholder="tabler-category"
                      value={form.icon}
                      onChange={(event) =>
                        updateField("icon", event.target.value)
                      }
                      required
                    />
                    <small className="text-body-secondary">
                      مثلاً tabler-devices یا tabler-shirt؛ نام باید با
                      آیکون‌های موجود در قالب سازگار باشد.
                    </small>
                  </div>
                  {form.image && (
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getCategoryImageUrl(form.image)}
                          alt="پیش‌نمایش دسته‌بندی"
                          className="admin-category-thumb"
                        />
                        <span className="text-body-secondary small">
                          پیش‌نمایش تصویر
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {error && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={onClose}
                  disabled={saving}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      در حال ذخیره...
                    </>
                  ) : (
                    "ذخیره دسته‌بندی"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
