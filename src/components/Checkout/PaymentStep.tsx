import React, { useState } from "react";
import type { Address } from "../../types/address";
import type { PaymentMethod } from "../../types/payment";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { formatPrice } from "../../utils/price";

interface PaymentStepProps {
  selectedAddress?: Address;
  deliveryPrice: number;
  finalPrice: number;
  onNext: () => void;
  onPrev: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedAddress,
  deliveryPrice,
  finalPrice,
  onNext,
  onPrev,
}) => {
  const { state, dispatch } = useCheckout();
  const activePaymentTab =
    state.paymentMethod === "cod"
      ? "cod"
      : state.paymentMethod === "giftCard"
        ? "gift-card"
        : "cc";

  const [saveCard, setSaveCard] = useState<boolean>(false);
  const { getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  const paymentTabs = [
    { id: "cc", label: "کارت بانکی" },
    { id: "cod", label: "پرداخت در محل" },
    { id: "gift-card", label: "کارت هدیه" },
  ] as const;

  const paymentMethodMap: Record<"cc" | "cod" | "gift-card", PaymentMethod> = {
    cc: "card",
    cod: "cod",
    "gift-card": "giftCard",
  };

  return (
    <div id="checkout-payment" className="content">
      <div className="row">
        {/* Payment left */}
        <div className="col-xl-8 mb-6 mb-xl-0">
          {/* Offer alert */}
          <div
            className="alert alert-success alert-dismissible mb-6"
            role="alert"
          >
            <div className="d-flex gap-4">
              <div className="alert-icon flex-shrink-0 rounded me-0">
                <i className="icon-base ti tabler-percentage"></i>
              </div>
              <div className="flex-grow-1">
                <h5 className="alert-heading mb-1">پیشنهادهای موجود</h5>
                <ul className="list-unstyled mb-0">
                  <li>
                    - ۱۰٪ تخفیف فوری برای کارت‌های بانکی دبیت و کردیت Bank of
                    America
                  </li>
                  <li>
                    - ۲۵٪ کش‌بک تا سقف ۶۰ دلار برای اولین تراکنش PayPal (طبق
                    شرایط و ضوابط)
                  </li>
                </ul>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-pinned"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>

          {/* Payment Tabs */}
          <div className="col-xxl-6 col-lg-8">
            <div className="nav-align-top">
              <ul
                className="nav nav-pills card-header-pills row gx-2 gx-md-0"
                id="paymentTabs"
                role="tablist"
              >
                {paymentTabs.map((tab) => (
                  <li
                    key={tab.id}
                    className="nav-item col-4 col-md-auto"
                    role="presentation"
                  >
                    <button
                      className={`nav-link w-100 w-md-auto px-2 px-md-3 small small-md-normal payment-tab-btn ${
                        activePaymentTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => {
                        dispatch({
                          type: "SET_PAYMENT_METHOD",
                          payload: paymentMethodMap[tab.id],
                        });
                      }}
                      type="button"
                      role="tab"
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tab-content px-0 pb-0" id="paymentTabsContent">
              {/* Credit card */}
              <div
                className={`tab-pane fade ${
                  activePaymentTab === "cc" ? "show active" : ""
                }`}
              >
                <div className="row g-6">
                  <div className="col-12">
                    <label className="form-label w-100" htmlFor="paymentCard">
                      شماره کارت
                    </label>
                    <div className="input-group input-group-merge">
                      <input
                        id="paymentCard"
                        name="paymentCard"
                        className="form-control credit-card-mask"
                        type="text"
                        placeholder="1356 3215 6548 7898"
                        aria-describedby="paymentCard2"
                      />
                      <span
                        className="input-group-text cursor-pointer p-1"
                        id="paymentCard2"
                      >
                        <span className="card-type"></span>
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label" htmlFor="paymentCardName">
                      نام صاحب کارت
                    </label>
                    <input
                      type="text"
                      id="paymentCardName"
                      className="form-control"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="col-6 col-md-4">
                    <label
                      className="form-label"
                      htmlFor="paymentCardExpiryDate"
                    >
                      تاریخ انقضا
                    </label>
                    <input
                      type="text"
                      id="paymentCardExpiryDate"
                      className="form-control expiry-date-mask"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="col-6 col-md-4">
                    <label className="form-label" htmlFor="paymentCardCvv">
                      کد CVV
                    </label>
                    <div className="input-group input-group-merge">
                      <input
                        type="text"
                        id="paymentCardCvv"
                        className="form-control cvv-code-mask"
                        maxLength={3}
                        placeholder="654"
                      />
                      <span
                        className="input-group-text cursor-pointer"
                        id="paymentCardCvv2"
                      >
                        <i
                          className="icon-base ti tabler-help text-body-secondary"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Card Verification Value"
                        ></i>
                      </span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="cardFutureBilling"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                      />
                      <label
                        htmlFor="cardFutureBilling"
                        className="form-check-label"
                      >
                        ذخیره کارت برای پرداخت‌های بعدی؟
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* COD */}
              <div
                className={`tab-pane fade ${
                  activePaymentTab === "cod" ? "show active" : ""
                }`}
              >
                <p>
                  پرداخت در محل روشی است که در آن مشتری مبلغ سفارش را هنگام
                  تحویل کالا پرداخت می‌کند، نه قبل از ارسال.
                </p>
              </div>

              {/* Gift card */}
              <div
                className={`tab-pane fade ${
                  activePaymentTab === "gift-card" ? "show active" : ""
                }`}
              >
                <h6>اطلاعات کارت هدیه را وارد کنید</h6>
                <div className="row g-5">
                  <div className="col-12">
                    <label htmlFor="giftCardNumber" className="form-label">
                      شماره کارت هدیه
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="giftCardNumber"
                      placeholder=" شماره کارت هدیه"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="giftCardPin" className="form-label">
                      پین کارت هدیه
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="giftCardPin"
                      placeholder="پین کارت هدیه"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address right */}
        <div className="col-xl-4">
          <div className="border rounded p-6">
            {/* Price Details */}
            <h6>جزئیات قیمت</h6>
            <dl className="row text-heading">
              <dt className="col-6 fw-normal">مجموع سفارش</dt>
              <dd className="col-6 text-end">{formatPrice(totalPrice)}</dd>

              <dt className="col-6 fw-normal">هزینه ارسال</dt>
              <dd className="col-6 text-end">
                {deliveryPrice === 0 ? (
                  <span className="badge bg-label-success">رایگان</span>
                ) : (
                  formatPrice(deliveryPrice)
                )}
              </dd>
            </dl>
            <hr className="mx-n6 my-6" />
            <dl className="row">
              <dt className="col-6 text-heading mb-3">مبلغ نهایی</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                {formatPrice(finalPrice)}
              </dd>

              <dt className="col-6 fw-medium text-heading">ارسال به:</dt>
              <dd className="col-6 fw-medium text-end mb-0">
                <span
                  className={`badge ${
                    selectedAddress?.type === "home"
                      ? "bg-label-primary"
                      : "bg-label-success"
                  }`}
                >
                  {selectedAddress?.type === "home" ? "خانه" : "محل کار"}
                </span>
              </dd>
            </dl>
            {/* Address Details */}
            {selectedAddress && (
              <address>
                <span className="text-heading fw-medium">
                  {selectedAddress.name}
                  {selectedAddress.isDefault && " (پیش‌فرض)"},
                </span>
                <br />
                {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 && (
                  <>
                    <br />
                    {selectedAddress.addressLine2}
                  </>
                )}
                <br />
                {selectedAddress.city}, {selectedAddress.state},{" "}
                {selectedAddress.zipCode}
                <br />
                موبایل : {selectedAddress.phone}
              </address>
            )}
          </div>
          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className="btn btn-label-secondary flex-fill"
              onClick={onPrev}
            >
              بازگشت به آدرس
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill"
              onClick={onNext}
            >
              پرداخت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
