import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  createAdminUser,
  getAdminUsers,
  type AdminUser,
  type CreateAdminUserInput,
} from "../../services/users";

const PAGE_SIZE = 10;

const EMPTY_FORM: CreateAdminUserInput = {
  name: "",
  email: "",
  password: "",
};

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      if (!token) {
        setUsers([]);
        setError("نشست مدیر معتبر نیست. دوباره وارد حساب شوید.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getAdminUsers(token);
        if (!cancelled) setUsers(result);
      } catch (requestError) {
        if (!cancelled) {
          setUsers([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت فهرست مشتریان ناموفق بود.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, [token, retryKey]);

  const customers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return users
      .filter((user) => user.role === "user")
      .filter((user) => {
        if (!query) return true;
        return [user.name, user.email, String(user.id)].some((value) =>
          value.toLocaleLowerCase().includes(query),
        );
      });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleCustomers = customers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const firstItem =
    customers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(currentPage * PAGE_SIZE, customers.length);

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setConfirmPassword("");
    setFormError("");
    setFormOpen(true);
  };

  const closeCreateForm = () => {
    if (saving) return;
    setFormOpen(false);
    setFormError("");
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (!token) {
      setFormError("نشست مدیر معتبر نیست. دوباره وارد حساب شوید.");
      return;
    }

    const payload: CreateAdminUserInput = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    if (payload.name.length < 2) {
      setFormError("نام مشتری باید حداقل ۲ نویسه باشد.");
      return;
    }

    if (payload.password.length < 6) {
      setFormError("رمز عبور باید حداقل ۶ نویسه باشد.");
      return;
    }

    if (payload.password !== confirmPassword) {
      setFormError("تکرار رمز عبور با رمز عبور یکسان نیست.");
      return;
    }

    setSaving(true);
    try {
      const created = await createAdminUser(token, payload);
      setUsers((current) => [
        created,
        ...current.filter((user) => user.id !== created.id),
      ]);
      setSearch("");
      setPage(1);
      setFormOpen(false);
      setForm(EMPTY_FORM);
      setConfirmPassword("");
      setSuccess("حساب مشتری با موفقیت ایجاد شد.");
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "ایجاد حساب مشتری ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">مشتریان</h2>
          <p className="text-body-secondary mb-0">
            مشاهده و جست‌وجوی حساب‌های مشتریان فروشگاه و ایجاد حساب جدید.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateForm}
        >
          <i
            className="icon-base ti tabler-user-plus me-1"
            aria-hidden="true"
          />
          افزودن مشتری
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
        <div className="card-header border-bottom d-flex align-items-center justify-content-between gap-3 admin-users-card-header">
          <div>
            <h5 className="card-title mb-1">فهرست مشتریان</h5>
            <p className="text-body-secondary small mb-0">
              {loading
                ? "در حال بارگذاری..."
                : `${customers.length.toLocaleString("fa-IR")} مشتری`}
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 admin-users-toolbar">
            <div className="input-group admin-users-search">
              <span className="input-group-text">
                <i className="icon-base ti tabler-search" aria-hidden="true" />
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="جست‌وجوی نام، ایمیل یا شناسه..."
                aria-label="جست‌وجوی مشتریان"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-label-secondary btn-sm"
              onClick={() => setRetryKey((value) => value + 1)}
              disabled={loading}
              aria-label="به‌روزرسانی مشتریان"
              title="به‌روزرسانی"
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
                در حال دریافت مشتریان...
              </p>
            </div>
          ) : error ? null : customers.length === 0 ? (
            <div className="text-center py-5 px-3">
              <i
                className="icon-base ti tabler-users-group icon-2xl text-body-secondary mb-3"
                aria-hidden="true"
              />
              <h6>
                {search ? "مشتری‌ای پیدا نشد" : "هنوز مشتری‌ای ثبت نشده است"}
              </h6>
              <p className="text-body-secondary mb-3">
                {search
                  ? "عبارت جست‌وجو را تغییر دهید یا جست‌وجو را پاک کنید."
                  : "با ایجاد اولین حساب مشتری، فهرست مشتریان اینجا نمایش داده می‌شود."}
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
                  onClick={openCreateForm}
                >
                  افزودن مشتری
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle admin-products-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">مشتری</th>
                      <th scope="col">ایمیل</th>
                      <th scope="col" className="text-nowrap">
                        شناسه مشتری
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className="admin-user-avatar"
                              aria-hidden="true"
                            >
                              {customer.name
                                .trim()
                                .charAt(0)
                                .toLocaleUpperCase("fa-IR") || "م"}
                            </span>
                            <span className="fw-medium">{customer.name}</span>
                          </div>
                        </td>
                        <td>
                          <span dir="ltr" className="d-inline-block">
                            {customer.email}
                          </span>
                        </td>
                        <td>
                          <span dir="ltr" className="text-body-secondary">
                            #{customer.id.toLocaleString("fa-IR")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 border-top">
                <small className="text-body-secondary">
                  نمایش {firstItem.toLocaleString("fa-IR")} تا{" "}
                  {lastItem.toLocaleString("fa-IR")} از{" "}
                  {customers.length.toLocaleString("fa-IR")} مشتری
                </small>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-label-secondary btn-sm"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage <= 1}
                  >
                    <i
                      className="icon-base ti tabler-chevron-right me-1"
                      aria-hidden="true"
                    />
                    قبلی
                  </button>
                  <span className="small text-body-secondary">
                    {currentPage.toLocaleString("fa-IR")} /{" "}
                    {totalPages.toLocaleString("fa-IR")}
                  </span>
                  <button
                    type="button"
                    className="btn btn-label-secondary btn-sm"
                    onClick={() =>
                      setPage((value) => Math.min(totalPages, value + 1))
                    }
                    disabled={currentPage >= totalPages}
                  >
                    بعدی
                    <i
                      className="icon-base ti tabler-chevron-left ms-1"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <CreateCustomerModal
        show={formOpen}
        form={form}
        confirmPassword={confirmPassword}
        saving={saving}
        error={formError}
        onChange={setForm}
        onConfirmPasswordChange={setConfirmPassword}
        onClose={closeCreateForm}
        onSubmit={handleCreate}
      />
    </div>
  );
};

interface CreateCustomerModalProps {
  show: boolean;
  form: CreateAdminUserInput;
  confirmPassword: string;
  saving: boolean;
  error: string;
  onChange: (form: CreateAdminUserInput) => void;
  onConfirmPasswordChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CreateCustomerModal = ({
  show,
  form,
  confirmPassword,
  saving,
  error,
  onChange,
  onConfirmPasswordChange,
  onClose,
  onSubmit,
}: CreateCustomerModalProps) => {
  if (!show) return null;

  const updateField = (key: keyof CreateAdminUserInput, value: string) =>
    onChange({ ...form, [key]: value });

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-customer-form-title"
        tabIndex={-1}
        dir="rtl"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
              <div className="modal-header">
                <h5 id="admin-customer-form-title" className="modal-title">
                  ایجاد حساب مشتری
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
                  <div className="col-12">
                    <label htmlFor="admin-customer-name" className="form-label">
                      نام و نام خانوادگی
                    </label>
                    <input
                      id="admin-customer-name"
                      className="form-control"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      minLength={2}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label
                      htmlFor="admin-customer-email"
                      className="form-label"
                    >
                      ایمیل
                    </label>
                    <input
                      id="admin-customer-email"
                      type="email"
                      dir="ltr"
                      className="form-control"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label
                      htmlFor="admin-customer-password"
                      className="form-label"
                    >
                      رمز عبور اولیه
                    </label>
                    <input
                      id="admin-customer-password"
                      type="password"
                      dir="ltr"
                      className="form-control"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                    <small className="text-body-secondary">
                      رمز عبور باید حداقل ۶ نویسه داشته باشد.
                    </small>
                  </div>
                  <div className="col-12">
                    <label
                      htmlFor="admin-customer-password-confirm"
                      className="form-label"
                    >
                      تکرار رمز عبور
                    </label>
                    <input
                      id="admin-customer-password-confirm"
                      type="password"
                      dir="ltr"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(event) =>
                        onConfirmPasswordChange(event.target.value)
                      }
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                  </div>
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
                      در حال ایجاد...
                    </>
                  ) : (
                    "ایجاد حساب مشتری"
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

export default Users;
