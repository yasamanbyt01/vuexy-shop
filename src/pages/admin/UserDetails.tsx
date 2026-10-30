import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getAdminUser,
  updateAdminUser,
  type AdminUser,
} from "../../services/users";
import {
  getAdminCustomerOrders,
  type AdminOrder,
  type OrderStatus,
} from "../../services/orders";
import { formatPrice } from "../../utils/price";
import { getAdminUserAddresses } from "../../services/addresses";
import type { Address } from "../../types/address";

const statusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  processing: "در حال پردازش",
  shipped: "در حال ارسال",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-label-warning",
  processing: "bg-label-info",
  shipped: "bg-label-primary",
  delivered: "bg-label-success",
  cancelled: "bg-label-danger",
};

const dateLabel = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

type CustomerForm = Pick<AdminUser, "name" | "email">;

const UserDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [customer, setCustomer] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CustomerForm>({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const customerId = id && /^\d+$/.test(id) ? Number(id) : NaN;

  const loadCustomer = useCallback(async () => {
    if (!token) throw new Error("نشست مدیر معتبر نیست. دوباره وارد حساب شوید.");
    if (!Number.isSafeInteger(customerId) || customerId < 1) {
      throw new Error("شناسه مشتری معتبر نیست.");
    }

    const customerResult = await getAdminUser(token, customerId);
    if (customerResult.role !== "user") {
      throw new Error("حساب موردنظر یک حساب مشتری نیست.");
    }

    const [ordersResult, addressesResult] = await Promise.all([
      getAdminCustomerOrders(token, customerId),
      getAdminUserAddresses(customerId, token),
    ]);

    return { customerResult, ordersResult, addressesResult };
  }, [token, customerId]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await loadCustomer();
        if (active) {
          setCustomer(result.customerResult);
          setForm({
            name: result.customerResult.name,
            email: result.customerResult.email,
          });
          setOrders(result.ordersResult);
          setAddresses(result.addressesResult);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت اطلاعات مشتری ناموفق بود.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [loadCustomer, retryKey]);

  const metrics = useMemo(() => {
    const completedCount = orders.filter(
      (order) => order.status === "delivered",
    ).length;
    const openValue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0);
    const latestOrder = orders[0] ?? null;
    return { completedCount, openValue, latestOrder };
  }, [orders]);

  const handleEditStart = () => {
    if (!customer) return;
    setForm({ name: customer.name, email: customer.email });
    setFormError("");
    setSuccess("");
    setEditing(true);
  };

  const handleEditCancel = () => {
    if (saving || !customer) return;
    setForm({ name: customer.name, email: customer.email });
    setFormError("");
    setEditing(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (!token || !customer) {
      setFormError("نشست مدیر معتبر نیست. دوباره وارد حساب شوید.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    };

    if (payload.name.length < 2) {
      setFormError("نام مشتری باید حداقل ۲ نویسه باشد.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setFormError("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateAdminUser(token, customer.id, payload);
      setCustomer(updated);
      setForm({ name: updated.name, email: updated.email });
      setEditing(false);
      setSuccess("اطلاعات مشتری با موفقیت به‌روزرسانی شد.");
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "به‌روزرسانی اطلاعات مشتری ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page" dir="rtl">
        <div className="card">
          <div className="card-body text-center py-5" role="status">
            <div
              className="spinner-border text-primary mb-3"
              aria-hidden="true"
            />
            <p className="text-body-secondary mb-0">
              در حال دریافت اطلاعات مشتری...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="admin-page" dir="rtl">
        <div className="admin-page-heading">
          <div>
            <h2 className="mb-1">جزئیات مشتری</h2>
            <p className="text-body-secondary mb-0">
              مشاهده اطلاعات حساب و سفارش‌ها.
            </p>
          </div>
          <Link to="/admin/users" className="btn btn-label-secondary">
            <i
              className="icon-base ti tabler-arrow-right me-1"
              aria-hidden="true"
            />
            بازگشت به مشتریان
          </Link>
        </div>
        <div className="alert alert-danger" role="alert">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span>{error || "مشتری موردنظر پیدا نشد."}</span>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setRetryKey((value) => value + 1)}
            >
              تلاش دوباره
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-customer-details" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">
            شناسه مشتری #{customer.id.toLocaleString("fa-IR")}
          </h2>
          <p className="text-body-secondary mb-0">
            مشاهده اطلاعات حساب، نشانی‌ها و سفارش‌های مشتری.
          </p>
        </div>
        <Link to="/admin/users" className="btn btn-label-secondary">
          <i
            className="icon-base ti tabler-arrow-right me-1"
            aria-hidden="true"
          />
          بازگشت به مشتریان
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

      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-4">
          <section className="card">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <h5 className="card-title mb-0">اطلاعات مشتری</h5>
              {!editing && (
                <button
                  type="button"
                  className="btn btn-label-primary btn-sm"
                  onClick={handleEditStart}
                >
                  <i
                    className="icon-base ti tabler-edit me-1"
                    aria-hidden="true"
                  />
                  ویرایش
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="admin-customer-profile-identity text-center mb-4 pb-4 border-bottom">
                <span
                  className="admin-user-avatar admin-customer-details-avatar mb-3"
                  aria-hidden="true"
                >
                  {customer.name.trim().charAt(0).toLocaleUpperCase("fa-IR") ||
                    "م"}
                </span>
                <h5 className="mb-1">{customer.name}</h5>
                <span className="text-body-secondary small" dir="ltr">
                  {customer.email}
                </span>
                <span className="text-body-secondary small mt-2">
                  شناسه مشتری #{customer.id.toLocaleString("fa-IR")}
                </span>
              </div>
              {formError && (
                <div className="alert alert-danger py-2" role="alert">
                  {formError}
                </div>
              )}
              {editing ? (
                <form onSubmit={handleSave} className="d-grid gap-3">
                  <div>
                    <label
                      htmlFor="admin-edit-customer-name"
                      className="form-label"
                    >
                      نام و نام خانوادگی
                    </label>
                    <input
                      id="admin-edit-customer-name"
                      className="form-control"
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      minLength={2}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-edit-customer-email"
                      className="form-label"
                    >
                      ایمیل
                    </label>
                    <input
                      id="admin-edit-customer-email"
                      type="email"
                      dir="ltr"
                      className="form-control"
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-label-secondary"
                      onClick={handleEditCancel}
                      disabled={saving}
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-customer-info-list">
                  <div>
                    <span className="text-body-secondary small">
                      شناسه مشتری
                    </span>
                    <strong dir="ltr">
                      #{customer.id.toLocaleString("fa-IR")}
                    </strong>
                  </div>
                  <div>
                    <span className="text-body-secondary small">نام مشتری</span>
                    <strong>{customer.name}</strong>
                  </div>
                  <div>
                    <span className="text-body-secondary small">ایمیل</span>
                    <strong dir="ltr" className="admin-customer-email">
                      {customer.email}
                    </strong>
                  </div>
                  <div>
                    <span className="text-body-secondary small">نوع حساب</span>
                    <strong>مشتری</strong>
                  </div>
                  <div>
                    <span className="text-body-secondary small">
                      آخرین سفارش
                    </span>
                    <strong>
                      {metrics.latestOrder
                        ? dateLabel(metrics.latestOrder.createdAt)
                        : "هنوز سفارشی ثبت نشده است"}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">نشانی‌های ذخیره‌شده</h5>
            </div>
            <div className="card-body">
              {addresses.length === 0 ? (
                <p className="text-body-secondary mb-0">
                  نشانی ذخیره‌شده‌ای برای این مشتری وجود ندارد.
                </p>
              ) : (
                <div className="admin-customer-address-list">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="admin-customer-address-item"
                    >
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <strong>{address.name}</strong>
                        {address.isDefault && (
                          <span className="badge bg-label-primary">
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      <div className="text-body-secondary small">
                        {address.type === "office" ? "محل کار" : "خانه"}
                      </div>
                      <div className="mt-2">
                        {[
                          address.addressLine1,
                          address.addressLine2,
                          address.city,
                          address.state,
                          address.zipCode,
                        ]
                          .filter(Boolean)
                          .join("، ")}
                      </div>
                      <div className="text-body-secondary small mt-1" dir="ltr">
                        {address.phone}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-8">
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <span className="admin-customer-metric-icon bg-label-primary">
                    <i
                      className="icon-base ti tabler-shopping-bag"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-body-secondary mb-1">تعداد سفارش‌ها</p>
                    <h4 className="mb-0">
                      {orders.length.toLocaleString("fa-IR")}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <span className="admin-customer-metric-icon bg-label-success">
                    <i
                      className="icon-base ti tabler-circle-check"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-body-secondary mb-1">
                      سفارش‌های تحویل‌شده
                    </p>
                    <h4 className="mb-0">
                      {metrics.completedCount.toLocaleString("fa-IR")}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <span className="admin-customer-metric-icon bg-label-info">
                    <i
                      className="icon-base ti tabler-currency-dollar"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-body-secondary mb-1">
                      ارزش سفارش‌های غیرلغوشده
                    </p>
                    <h5 className="mb-0">{formatPrice(metrics.openValue)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="card">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <div>
                <h5 className="card-title mb-1">تاریخچه سفارش‌ها</h5>
                <p className="text-body-secondary small mb-0">
                  {orders.length.toLocaleString("fa-IR")} سفارش ثبت‌شده
                </p>
              </div>
              <button
                type="button"
                className="btn btn-label-secondary btn-sm"
                onClick={() => setRetryKey((value) => value + 1)}
                aria-label="به‌روزرسانی سفارش‌ها"
                title="به‌روزرسانی"
              >
                <i className="icon-base ti tabler-refresh" aria-hidden="true" />
              </button>
            </div>
            <div className="card-body p-0">
              {orders.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <i
                    className="icon-base ti tabler-shopping-bag icon-2xl text-body-secondary mb-3"
                    aria-hidden="true"
                  />
                  <h6>هنوز سفارشی ثبت نشده است</h6>
                  <p className="text-body-secondary mb-0">
                    پس از ثبت سفارش توسط مشتری، تاریخچه آن در این بخش نمایش داده
                    می‌شود.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle admin-products-table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">سفارش</th>
                        <th scope="col">محصولات</th>
                        <th scope="col" className="text-nowrap">
                          مبلغ
                        </th>
                        <th scope="col">وضعیت</th>
                        <th scope="col">جزئیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const productNames = order.items.map(
                          (item) => item.productName,
                        );
                        const itemSummary = productNames.slice(0, 2).join("، ");
                        const extraCount = Math.max(0, productNames.length - 2);
                        return (
                          <tr key={order.id}>
                            <td>
                              <div className="fw-medium">
                                #{order.id.toLocaleString("fa-IR")}
                              </div>
                              <small className="text-body-secondary">
                                {dateLabel(order.createdAt)}
                              </small>
                            </td>
                            <td className="admin-customer-order-products">
                              <div>{itemSummary || "—"}</div>
                              {extraCount > 0 && (
                                <small className="text-body-secondary">
                                  و {extraCount.toLocaleString("fa-IR")} محصول
                                  دیگر
                                </small>
                              )}
                            </td>
                            <td className="text-nowrap">
                              {formatPrice(order.total)}
                            </td>
                            <td>
                              <span
                                className={`badge ${statusClasses[order.status] || "bg-label-secondary"}`}
                              >
                                {statusLabels[order.status] || order.status}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/admin/orders/${order.id}`}
                                className="btn btn-sm btn-label-primary"
                                aria-label={`مشاهده سفارش ${order.id}`}
                              >
                                مشاهده
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
