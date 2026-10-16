import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import type { Address } from "../../types/address";
import type { AuthUser } from "../../types/auth";
import type { DeliveryOption } from "../../types/delivery";
import type { PaymentMethod } from "../../types/payment";
import { createOrder, type CreatedOrder } from "../../services/orders";
import { formatPrice } from "../../utils/price";

interface ConfirmationStepProps {
  selectedAddress?: Address;
  deliveryPrice: number;
  finalPrice: number;
  selectedDeliveryOption?: DeliveryOption & { time?: string };
  freeShipping: boolean;
  customer: AuthUser | null;
  token: string | null;
  paymentMethod?: PaymentMethod;
  onOrderCreated: () => void;
  onComplete: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedAddress,
  deliveryPrice,
  finalPrice,
  selectedDeliveryOption,
  freeShipping,
  customer,
  token,
  paymentMethod = "card",
  onOrderCreated,
  onComplete,
}) => {
  const { items, clearCart, getTotalPrice } = useCart();
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [originalPricesByProductId, setOriginalPricesByProductId] = useState<
    Record<number, number | undefined>
  >({});

  const totalPrice = getTotalPrice();
  const orderDate = createdOrder?.createdAt
    ? new Date(createdOrder.createdAt).toLocaleString("fa-IR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : null;

  const handlePlaceOrder = async () => {
    if (isSubmitting || createdOrder) return;

    if (!token || !customer) {
      setSubmitError("برای ثبت سفارش، لطفاً دوباره وارد حساب کاربری خود شوید.");
      return;
    }

    if (!selectedAddress) {
      setSubmitError("لطفاً یک آدرس ارسال انتخاب کنید.");
      return;
    }

    if (!selectedDeliveryOption?.id) {
      setSubmitError("لطفاً روش ارسال را انتخاب کنید.");
      return;
    }

    if (items.length === 0) {
      setSubmitError("سبد خرید شما خالی است.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const order = await createOrder(
        {
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            addressLine1: selectedAddress.addressLine1,
            ...(selectedAddress.addressLine2
              ? { addressLine2: selectedAddress.addressLine2 }
              : {}),
            city: selectedAddress.city,
            state: selectedAddress.state,
            zipCode: selectedAddress.zipCode,
          },
          deliveryOption: selectedDeliveryOption.id,
          paymentMethod,
          // Prices are intentionally not sent from the browser. The API
          // calculates the saved order total from product IDs and quantities.
        },
        token,
      );

      // Keep the API's saved response on screen, then empty the cart.
      // A failed API request never reaches this section, so the cart is retained.
      setOriginalPricesByProductId(
        Object.fromEntries(
          items.map((item) => [
            item.id,
            item.originalPrice ?? item.discountedPrice,
          ]),
        ),
      );
      setCreatedOrder(order);
      onOrderCreated();
      clearCart();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const shownItems = createdOrder
    ? createdOrder.items.map((item) => ({
        id: item.id,
        name: item.productName,
        image: item.productImage ?? "",
        seller: "",
        price: item.unitPrice,
        originalPrice:
          item.originalPrice ?? originalPricesByProductId[item.productId],
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      }))
    : items.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        seller: item.seller,
        price: item.price,
        originalPrice: item.originalPrice ?? item.discountedPrice,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      }));

  const savedShippingName = createdOrder?.shippingName ?? selectedAddress?.name;
  const savedAddressLine1 =
    createdOrder?.shippingAddressLine1 ?? selectedAddress?.addressLine1;
  const savedAddressLine2 =
    createdOrder?.shippingAddressLine2 ?? selectedAddress?.addressLine2;
  const savedCity = createdOrder?.shippingCity ?? selectedAddress?.city;
  const savedState = createdOrder?.shippingState ?? selectedAddress?.state;
  const savedZipCode =
    createdOrder?.shippingZipCode ?? selectedAddress?.zipCode;
  const savedPhone = createdOrder?.shippingPhone ?? selectedAddress?.phone;
  const displayedSubtotal = createdOrder?.subtotal ?? totalPrice;
  const displayedDelivery = createdOrder?.deliveryPrice ?? deliveryPrice;
  const displayedTotal = createdOrder?.total ?? finalPrice;
  const deliveryLabel =
    createdOrder?.deliveryOption === "express"
      ? "سریع"
      : createdOrder?.deliveryOption === "standard"
        ? "استاندارد"
        : selectedDeliveryOption?.title;
  const savedPaymentMethod = createdOrder?.paymentMethod ?? paymentMethod;
  const paymentLabel =
    savedPaymentMethod === "cod"
      ? "پرداخت در محل"
      : savedPaymentMethod === "giftCard"
        ? "کارت هدیه"
        : "کارت بانکی";

  return (
    <div id="checkout-confirmation" className="content">
      <div className="row mb-6">
        <div className="col-12 col-lg-8 mx-auto text-center mb-2">
          {createdOrder ? (
            <>
              <h4>متشکریم! 😇</h4>
              <p>
                سفارش شما با شماره{" "}
                <span className="text-heading fw-medium">
                  #{createdOrder.id}
                </span>{" "}
                با موفقیت ثبت شد.
              </p>
              <p>
                سفارش به نام{" "}
                <strong>{createdOrder.customerName || customer?.name}</strong> و
                با ایمیل{" "}
                <a
                  href={`mailto:${createdOrder.customerEmail || customer?.email || ""}`}
                  className="text-heading fw-medium"
                >
                  {createdOrder.customerEmail || customer?.email}
                </a>{" "}
                ثبت شده است.
              </p>
              {orderDate && (
                <p>
                  <span>
                    <i className="icon-base ti tabler-clock me-1 text-heading"></i>{" "}
                    زمان ثبت سفارش:&nbsp;
                  </span>
                  {orderDate}
                </p>
              )}
              <p className="text-body-secondary mb-0">
                وضعیت سفارش: {createdOrder.status}
              </p>
            </>
          ) : (
            <>
              <h4>بررسی نهایی سفارش</h4>
              <p className="mb-2">
                اطلاعات زیر را بررسی کنید و برای ثبت سفارش دکمهٔ ثبت سفارش را
                بزنید.
              </p>
              {customer && (
                <p className="text-body-secondary">
                  خریدار: {customer.name} — {customer.email}
                </p>
              )}
            </>
          )}
        </div>

        {/* Saved shipping and account details */}
        <div className="col-12">
          <ul className="list-group list-group-horizontal-md">
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-map-pin"></i> آدرس ارسال
              </h6>
              <address className="mb-0">
                {savedShippingName ? (
                  <>
                    {savedShippingName}
                    <br />
                    {savedAddressLine1}
                    {savedAddressLine2 && (
                      <>
                        <br />
                        {savedAddressLine2}
                      </>
                    )}
                    <br />
                    {savedCity}, {savedState} {savedZipCode}
                  </>
                ) : (
                  "آدرسی انتخاب نشده است."
                )}
              </address>
              <p className="mb-0 mt-4">
                {savedPhone || "شماره تماس وارد نشده است."}
              </p>
            </li>
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-user"></i> اطلاعات خریدار
              </h6>
              <p className="mb-1">
                {createdOrder?.customerName || customer?.name || "—"}
              </p>
              <p className="mb-0">
                {createdOrder?.customerEmail || customer?.email || "—"}
              </p>
              <hr className="my-3" />
              <p className="mb-0">
                <span className="text-body-secondary">روش پرداخت: </span>
                {paymentLabel}
              </p>
            </li>
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-truck-delivery"></i> روش ارسال
              </h6>
              <p className="fw-medium mb-2">{deliveryLabel || "انتخاب نشده"}</p>
              {freeShipping && !createdOrder && (
                <small>به دلیل عبور از سقف خرید، ارسال رایگان است.</small>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-9 mb-6 mb-xl-0">
          <ul className="list-group">
            {shownItems.map((item) => (
              <li key={item.id} className="list-group-item p-6">
                <div className="d-flex gap-4">
                  {item.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-px-80 rounded-3 shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="mb-2">{item.name}</h6>
                        {item.seller && (
                          <div className="text-body mb-2 d-flex flex-wrap">
                            <span className="me-1">فروشنده:</span>
                            <span className="me-3">{item.seller}</span>
                          </div>
                        )}
                        <small className="text-body-secondary">
                          تعداد: {item.quantity}
                        </small>
                      </div>
                      <div className="col-md-4">
                        <div className="text-md-end">
                          {typeof item.originalPrice === "number" &&
                            item.originalPrice > item.price && (
                              <small className="d-block text-body-secondary text-decoration-line-through">
                                {formatPrice(item.originalPrice)}
                              </small>
                            )}
                          <span className="text-primary d-block">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-xl-3">
          <div className="border rounded p-6">
            <h6>جزئیات قیمت</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">مجموع سفارش</dt>
              <dd className="col-6 text-end">
                {formatPrice(displayedSubtotal)}
              </dd>
              <dt className="col-6 text-heading fw-normal">هزینه ارسال</dt>
              <dd className="col-6 text-end">
                {displayedDelivery === 0 ? (
                  <span className="badge bg-label-success">رایگان</span>
                ) : (
                  formatPrice(displayedDelivery)
                )}
              </dd>
            </dl>
            <hr className="mx-n6 mb-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">مبلغ نهایی</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                {formatPrice(displayedTotal)}
              </dd>
            </dl>
          </div>

          {submitError && (
            <div className="alert alert-danger mt-4" role="alert">
              {submitError}
            </div>
          )}

          <div className="d-grid mt-4">
            {createdOrder ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onComplete}
              >
                ادامه خرید
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال ثبت سفارش…" : "ثبت سفارش"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
