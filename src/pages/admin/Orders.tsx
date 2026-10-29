import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getAdminOrders,
  type AdminOrder,
  type OrderStatus,
} from "../../services/orders";
import { formatPrice } from "../../utils/price";
import "../../assets/css/admin-orders.css";

const statusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  shipped: "در حال ارسال",
  delivered: "تحویل  داده  شده",
  cancelled: "لغو شده",
};
const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-label-warning",
  processing: "bg-label-info",
  shipped: "bg-label-primary",
  delivered: "bg-label-success",
  cancelled: "bg-label-danger",
};
const paymentLabels: Record<string, string> = {
  card: "پرداخت آنلاین",
  cod: "پرداخت در محل",
  giftCard: "کارت هدیه",
};
const dateLabel = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token) {
        setError("برای مشاهده سفارش‌ها وارد حساب مدیر شوید.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const result = await getAdminOrders(token);
        if (active) setOrders(result);
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "دریافت سفارش‌ها ناموفق بود.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [token, retry]);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const term = search.trim().toLocaleLowerCase();
        const matchesSearch =
          !term ||
          [
            String(order.id),
            order.customerName ?? order.user?.name ?? "",
            order.customerEmail ?? order.user?.email ?? "",
          ].some((v) => v.toLocaleLowerCase().includes(term));
        return matchesSearch && (status === "all" || order.status === status);
      }),
    [orders, search, status],
  );

  const onStatusChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setStatus(event.target.value);

  return (
    <div className="admin-page admin-orders-page" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">سفارش‌ها</h2>
          <p className="text-body-secondary mb-0">
            مشاهده سفارش‌های ثبت‌شده و پیگیری وضعیت ارسال.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-label-secondary"
          onClick={() => setRetry((v) => v + 1)}
          disabled={loading}
        >
          <i className="icon-base ti tabler-refresh me-1" aria-hidden="true" />
          به‌روزرسانی
        </button>
      </div>
      <div className="row g-3 mb-4 admin-order-stats">
        {[
          {
            label: "همه سفارش‌ها",
            value: orders.length,
            icon: "tabler-shopping-bag",
          },
          {
            label: "در انتظار",
            value: orders.filter((o) => o.status === "pending").length,
            icon: "tabler-clock",
          },
          {
            label: "در حال پردازش",
            value: orders.filter((o) => o.status === "processing").length,
            icon: "tabler-package",
          },
          {
            label: "تحویل شده",
            value: orders.filter((o) => o.status === "delivered").length,
            icon: "tabler-check",
          },
        ].map((item) => (
          <div className="col-6 col-xl-3" key={item.label}>
            <div className="card h-100 admin-order-stat-card">
              <div className="card-body d-flex align-items-center gap-3 admin-order-stat-card-body">
                <span
                  className="admin-order-stat-icon bg-label-primary rounded"
                  aria-hidden="true"
                >
                  <i className={`icon-base ti ${item.icon} icon-2xl`} />
                </span>
                <div className="min-w-0">
                  <p className="text-body-secondary mb-1">{item.label}</p>
                  <h4 className="mb-0">{item.value.toLocaleString("fa-IR")}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <section className="card">
        <div className="card-header border-bottom">
          <div>
            <h5 className="card-title mb-1">فهرست سفارش‌ها</h5>
            <p className="text-body-secondary small mb-0">
              {loading
                ? "در حال بارگذاری…"
                : `${filtered.length.toLocaleString("fa-IR")} سفارش`}
            </p>
          </div>
        </div>
        <div className="card-body pt-4">
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-7">
              <label htmlFor="order-search" className="form-label">
                جست‌وجو
              </label>
              <input
                id="order-search"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="شناسه سفارش، نام یا ایمیل مشتری"
              />
            </div>
            <div className="col-12 col-md-5">
              <label htmlFor="order-status-filter" className="form-label">
                وضعیت سفارش
              </label>
              <select
                id="order-status-filter"
                className="form-select"
                value={status}
                onChange={onStatusChange}
              >
                <option value="all">همه وضعیت‌ها</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
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
                onClick={() => setRetry((v) => v + 1)}
              >
                تلاش دوباره
              </button>
            </div>
          )}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" />
              <p className="text-body-secondary mb-0">
                در حال دریافت سفارش‌ها…
              </p>
            </div>
          ) : error ? null : filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="icon-base ti tabler-inbox icon-2xl text-body-secondary mb-3" />
              <h6>سفارشی پیدا نشد</h6>
              <p className="text-body-secondary mb-0">
                عبارت جست‌وجو یا فیلتر وضعیت را تغییر دهید.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>سفارش</th>
                    <th>تاریخ</th>
                    <th>مشتری</th>
                    <th>پرداخت</th>
                    <th>مبلغ کل</th>
                    <th>وضعیت</th>
                    <th>جزئیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-medium">
                        #{order.id.toLocaleString("fa-IR")}
                      </td>
                      <td className="text-nowrap">
                        {dateLabel(order.createdAt)}
                      </td>
                      <td>
                        <div className="fw-medium">
                          {order.customerName ||
                            order.user?.name ||
                            order.shippingName ||
                            "مشتری"}
                        </div>
                        <small className="text-body-secondary">
                          {order.customerEmail || order.user?.email || "—"}
                        </small>
                      </td>
                      <td>
                        {paymentLabels[order.paymentMethod ?? ""] ||
                          order.paymentMethod ||
                          "—"}
                      </td>
                      <td className="text-nowrap fw-medium">
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
                          className="btn btn-sm btn-label-primary"
                          to={`/admin/orders/${order.id}`}
                        >
                          مشاهده
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default Orders;
