import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getAdminOrder,
  updateAdminOrderStatus,
  type AdminOrder,
  type OrderStatus,
} from "../../services/orders";
import { formatPrice } from "../../utils/price";
import { getProductImageUrl } from "../../services/products";
import "../../assets/css/admin-orders.css";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "در حال ارسال" },
  { value: "delivered", label: "تحویل  داده  شده" },
  { value: "cancelled", label: "لغو شده" },
];
const statusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  shipped: "در حال ارسال",
  delivered: "تحویل  داده  شده",
  cancelled: "لغو شده",
};
const paymentLabels: Record<string, string> = {
  card: "پرداخت آنلاین",
  cod: "پرداخت در محل",
  giftCard: "کارت هدیه",
};
const dateLabel = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nextStatus, setNextStatus] = useState<OrderStatus>("pending");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token || !id || !/^\d+$/.test(id)) {
        setError("شناسه سفارش معتبر نیست.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await getAdminOrder(token, Number(id));
        if (active) {
          setOrder(data);
          setNextStatus(data.status);
        }
      } catch (e) {
        if (active)
          setError(e instanceof Error ? e.message : "دریافت سفارش ناموفق بود.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [token, id]);
  const saveStatus = async () => {
    if (!token || !order || nextStatus === order.status) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateAdminOrderStatus(token, order.id, nextStatus);
      setOrder(updated);
      setNextStatus(updated.status);
      setSuccess("وضعیت سفارش با موفقیت به‌روزرسانی شد.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "به‌روزرسانی وضعیت سفارش ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
  };
  const address = [
    order?.shippingAddressLine1,
    order?.shippingAddressLine2,
    order?.shippingCity,
    order?.shippingState,
    order?.shippingZipCode,
  ]
    .filter(Boolean)
    .join("، ");
  return (
    <div className="admin-page admin-order-details" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <Link
            to="/admin/orders"
            className="text-body-secondary small text-decoration-none"
          >
            <i
              className="icon-base ti tabler-arrow-right me-1"
              aria-hidden="true"
            />
            بازگشت به سفارش‌ها
          </Link>
          <h2 className="mt-2 mb-1">
            جزئیات سفارش {id ? `#${Number(id).toLocaleString("fa-IR")}` : ""}
          </h2>
          <p className="text-body-secondary mb-0">
            اطلاعات ثبت‌شده سفارش، اقلام خریداری‌شده و وضعیت پردازش.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-label-secondary"
          onClick={() => navigate("/admin/orders")}
        >
          <i className="icon-base ti tabler-list me-1" aria-hidden="true" />
          فهرست سفارش‌ها
        </button>
      </div>
      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-body-secondary mb-0">
              در حال دریافت جزئیات سفارش…
            </p>
          </div>
        </div>
      ) : !order ? (
        <div className="card">
          <div className="card-body">
            <p className="mb-3">اطلاعات این سفارش در دسترس نیست.</p>
            <Link to="/admin/orders" className="btn btn-primary">
              بازگشت به فهرست
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12 col-xl-8">
              <section className="card admin-order-main-card">
                <div className="card-header border-bottom">
                  <div>
                    <h5 className="card-title mb-1">اطلاعات سفارش</h5>
                    <small className="text-body-secondary">
                      ثبت‌شده در {dateLabel(order.createdAt)}
                    </small>
                  </div>
                </div>
                <div className="card-body admin-order-main-body">
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>محصول</th>
                          <th>قیمت واحد</th>
                          <th>تعداد</th>
                          <th>جمع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                {item.productImage ? (
                                  <img
                                    src={getProductImageUrl(item.productImage)}
                                    alt=""
                                    width="48"
                                    height="48"
                                    className="rounded admin-order-product-image"
                                  />
                                ) : (
                                  <span className="avatar avatar-md bg-label-secondary">
                                    <i className="icon-base ti tabler-package" />
                                  </span>
                                )}
                                <div>
                                  <div className="fw-medium">
                                    {item.productName}
                                  </div>
                                  <small className="text-body-secondary">
                                    شناسه محصول:{" "}
                                    {item.productId.toLocaleString("fa-IR")}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td className="text-nowrap">
                              {formatPrice(item.unitPrice)}
                            </td>
                            <td>{item.quantity.toLocaleString("fa-IR")}</td>
                            <td className="text-nowrap fw-medium">
                              {formatPrice(item.lineTotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <hr />
                  <div className="row justify-content-end">
                    <div className="col-12 col-md-7 col-lg-6">
                      <div className="d-flex justify-content-between gap-3 mb-2">
                        <span className="text-body-secondary">جمع محصولات</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="d-flex justify-content-between gap-3 mb-2">
                        <span className="text-body-secondary">هزینه ارسال</span>
                        <span>{formatPrice(order.deliveryPrice)}</span>
                      </div>
                      <div className="d-flex justify-content-between gap-3 pt-3 border-top">
                        <strong>مبلغ نهایی</strong>
                        <strong className="text-primary">
                          {formatPrice(order.total)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="col-12 col-xl-4">
              <section className="card mb-4 admin-order-sidebar-card">
                <div className="card-header border-bottom">
                  <h5 className="card-title mb-0">وضعیت سفارش</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <span className="text-body-secondary small">
                      وضعیت فعلی
                    </span>
                    <div className="fw-medium mt-1">
                      {statusLabels[order.status] || order.status}
                    </div>
                  </div>
                  <label htmlFor="order-next-status" className="form-label">
                    تغییر وضعیت
                  </label>
                  <select
                    id="order-next-status"
                    className="form-select mb-3"
                    value={nextStatus}
                    onChange={(e) =>
                      setNextStatus(e.target.value as OrderStatus)
                    }
                    disabled={saving}
                  >
                    <option value={order.status}>
                      {statusLabels[order.status]}
                    </option>
                    {statuses
                      .filter((s) => s.value !== order.status)
                      .map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={saveStatus}
                    disabled={saving || nextStatus === order.status}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        در حال ذخیره…
                      </>
                    ) : (
                      "ذخیره وضعیت"
                    )}
                  </button>
                  <small className="d-block text-body-secondary mt-3">
                    لغو سفارش ممکن است موجودی کالا را به‌روزرسانی کند.
                    محدودیت‌های مجاز وضعیت توسط سرور بررسی می‌شود.
                  </small>
                </div>
              </section>
              <section className="card mb-4 admin-order-sidebar-card">
                <div className="card-header border-bottom">
                  <h5 className="card-title mb-0">اطلاعات مشتری</h5>
                </div>
                <div className="card-body">
                  <div className="admin-order-info-group">
                    <div className="fw-medium mb-1">
                      {order.customerName ||
                        order.user?.name ||
                        order.shippingName ||
                        "—"}
                    </div>
                    <div className="text-body-secondary">
                      {order.customerEmail || order.user?.email || "—"}
                    </div>
                  </div>
                  <div className="admin-order-info-group">
                    <div className="small text-body-secondary mb-2">
                      شماره تماس
                    </div>
                    <div dir="ltr">{order.shippingPhone || "—"}</div>
                  </div>
                  <div className="admin-order-info-group">
                    <div className="small text-body-secondary mb-2">
                      نشانی ارسال
                    </div>
                    <div className="admin-order-address">
                      {address || "نشانی ثبت نشده است."}
                    </div>
                  </div>
                </div>
              </section>
              <section className="card admin-order-sidebar-card">
                <div className="card-header border-bottom">
                  <h5 className="card-title mb-0">روش پرداخت و ارسال</h5>
                </div>
                <div className="card-body">
                  <div className="admin-order-payment-row">
                    <span className="text-body-secondary">پرداخت</span>
                    <span className="text-end">
                      {paymentLabels[order.paymentMethod || ""] ||
                        order.paymentMethod ||
                        "—"}
                    </span>
                  </div>
                  <div className="admin-order-payment-row">
                    <span className="text-body-secondary">ارسال</span>
                    <span className="text-end">
                      {order.deliveryOption === "express"
                        ? "ارسال سریع"
                        : order.deliveryOption === "standard"
                          ? "ارسال عادی"
                          : order.deliveryOption || "—"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default OrderDetails;
