import React from "react";
import { useCart } from "../../context/CartContext";
import type { Address } from "../../types/address";
import { formatPrice } from "../../utils/price";

interface ConfirmationStepProps {
  selectedAddress?: Address;
  deliveryPrice: number;
  finalPrice: number;
  selectedDeliveryOption?: any;
  freeShipping: boolean;
  onComplete: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedAddress,
  deliveryPrice,
  finalPrice,
  selectedDeliveryOption,
  freeShipping,
  onComplete,
}) => {
  const { items, clearCart, getTotalPrice } = useCart();
  const orderNumber = "1536548131";
  const orderDate = new Date().toLocaleString("fa-IR", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const totalPrice = getTotalPrice();
  const handleComplete = () => {
    clearCart();
    onComplete();
  };

  return (
    <div id="checkout-confirmation" className="content">
      <div className="row mb-6">
        <div className="col-12 col-lg-8 mx-auto text-center mb-2">
          <h4>متشکریم! 😇</h4>
          <p>
            سفارش شما با شماره{" "}
            <a href="#" className="text-heading fw-medium">
              #{orderNumber}
            </a>{" "}
            با موفقیت ثبت شد!
          </p>
          <p>
            یک ایمیل تأیید سفارش به
            <a
              href="mailto:john.doe@example.com"
              className="text-heading fw-medium"
            >
              {" "}
              john.doe@example.com
            </a>{" "}
            حاوی تأیید سفارش و رسید خرید برای شما ارسال کردیم. اگر ایمیل طی دو
            دقیقه دریافت نشد، لطفاً پوشه Spam خود را نیز بررسی کنید.
          </p>
          <p>
            <span>
              <i className="icon-base ti tabler-clock me-1 text-heading"></i>{" "}
              زمان ثبت سفارش:&nbsp;
            </span>
            {orderDate}
          </p>
        </div>
        {/* Confirmation details */}
        <div className="col-12">
          <ul className="list-group list-group-horizontal-md">
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-map-pin"></i> آدرس ارسال
              </h6>
              <address className="mb-0">
                {selectedAddress ? (
                  <>
                    {selectedAddress.name} <br />
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 && (
                      <>
                        <br />
                        {selectedAddress.addressLine2}
                      </>
                    )}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.zipCode}
                    <br />
                  </>
                ) : (
                  "No address selected"
                )}
              </address>
              <p className="mb-0 mt-4">
                {selectedAddress?.phone || "No phone provided"}
              </p>
            </li>
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-credit-card"></i> آدرس
                صورتحساب
              </h6>
              <address className="mb-0">
                {selectedAddress ? (
                  <>
                    {selectedAddress.name} <br />
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 && (
                      <>
                        <br />
                        {selectedAddress.addressLine2}
                      </>
                    )}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.zipCode}
                    <br />
                  </>
                ) : (
                  "آدرسی انتخاب نشده است"
                )}
              </address>
              <p className="mb-0 mt-4">
                {selectedAddress?.phone || "شماره تماس وارد نشده است"}
              </p>
            </li>
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-ship"></i> روش ارسال
              </h6>
              <p className="fw-medium mb-4">روش انتخابی:</p>
              {freeShipping ? (
                <>
                  ارسال رایگان
                  <br />
                  (به دلیل عبور از سقف خرید)
                </>
              ) : (
                <>
                  {selectedDeliveryOption?.title}
                  <br />({selectedDeliveryOption?.time})
                </>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        {/* Confirmation items */}
        <div className="col-xl-9 mb-6 mb-xl-0">
          <ul className="list-group">
            {items.map((item) => (
              <li key={item.id} className="list-group-item p-6">
                <div className="d-flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-px-80 rounded-3 shadow-sm"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="row">
                      <div className="col-md-8">
                        <a href="#">
                          <h6 className="mb-2">{item.name}</h6>
                        </a>
                        <div className="text-body mb-2 d-flex flex-wrap">
                          <span className="me-1">فروشنده:</span>
                          <a href="#" className="me-3">
                            {item.seller}
                          </a>
                          <span className="badge bg-label-success">
                            موجود در انبار
                          </span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-md-end">
                          <div className="my-2 my-lg-6">
                            <span className="text-primary">
                              {formatPrice(item.price)}/
                            </span>
                            {item.discountedPrice && (
                              <s className="text-body-secondary">
                                {formatPrice(item.discountedPrice)}
                              </s>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Confirmation total */}
        <div className="col-xl-3">
          <div className="border rounded p-6">
            {/* Price Details */}
            <h6>جزئیات قیمت</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">مجموع سفارش</dt>
              <dd className="col-6 text-end">{formatPrice(totalPrice)}</dd>

              <dt className="col-sm-6 text-heading fw-normal">هزینه ارسال</dt>
              <dd className="col-sm-6 text-end">
                {freeShipping ? (
                  <span className="badge bg-label-success">رایگان</span>
                ) : (
                  formatPrice(deliveryPrice)
                )}
              </dd>
            </dl>
            <hr className="mx-n6 mb-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">مبلغ نهایی</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                {formatPrice(finalPrice)}
              </dd>
            </dl>
          </div>
          <div className="d-grid mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleComplete}
            >
              ادامه خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
