import React from "react";
import { useCart } from "../../context/CartContext";
import { toFarsiNumber } from "../../utils/numbers";
import { formatPrice } from "../../utils/price";

interface CartStepProps {
  onNext: () => void;
}

const CartStep: React.FC<CartStepProps> = ({ onNext }) => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = getTotalPrice();

  return (
    <div id="checkout-cart" className="content active">
      <div className="row">
        {/* Cart left */}
        <div className="col-xl-8 mb-6 mb-xl-0">
          {/* Offer alert */}
          <div
            className="alert alert-success alert-dismissible mb-4"
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
                    - ۱۰٪ تخفیف فوری برای پرداخت با کارت‌های Bank of America
                  </li>
                  <li>- ۲۵٪ کش‌بک تا سقف ۶۰ دلار برای اولین تراکنش PayPal</li>
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

          {/* Shopping bag */}
          <h5>سبد خرید من ({toFarsiNumber(totalItems)} کالا)</h5>
          <ul className="list-group mb-4">
            {items.map((item) => (
              <li key={item.id} className="list-group-item p-6">
                <div className="d-flex gap-4">
                  <div className="flex-shrink-0 d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-px-100 rounded-3 shadow-sm"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="row">
                      <div className="col-md-8">
                        <p className="me-3 mb-2">
                          <a href="javascript:void(0)" className="fw-medium">
                            <span className="text-heading">{item.name}</span>
                          </a>
                        </p>
                        <div className="text-body-secondary mb-2 d-flex flex-wrap">
                          <span className="me-1">فروشنده:</span>
                          <a href="javascript:void(0)" className="me-4">
                            {item.seller}
                          </a>
                          <span
                            className={`badge ${item.inStock ? "bg-label-success" : "bg-label-danger"}`}
                          >
                            {item.inStock ? "موجود" : "ناموجود"}
                          </span>
                        </div>
                        <div
                          className="read-only-ratings raty mb-2"
                          data-read-only="true"
                          data-score={item.rating}
                          data-number="5"
                        ></div>
                        <input
                          type="number"
                          className="form-control form-control-sm w-px-100"
                          value={item.quantity}
                          min="1"
                          max="10"
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="text-md-end">
                          <button
                            type="button"
                            className="btn-close btn-pinned"
                            aria-label="Close"
                            onClick={() => removeItem(item.id)}
                          ></button>
                          <div className="my-2 mt-md-6 mb-md-4">
                            <span className="text-primary">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-label-primary"
                          >
                            انتقال به علاقه‌مندی‌ها
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Wishlist */}
          <div className="list-group">
            <a
              href="javascript:void(0)"
              className="list-group-item text-primary border-primary d-flex justify-content-between"
            >
              <span className="fw-medium">
                افزودن محصولات بیشتر از علاقه‌مندی‌ها
              </span>
              <i className="icon-base ti tabler-arrow-right icon-xs scaleX-n1-rtl mt-50"></i>
            </a>
          </div>
        </div>

        {/* Cart right */}
        <div className="col-xl-4">
          <div className="border rounded p-6 mb-4">
            {/* Offer */}
            <h6>کد تخفیف</h6>
            <div className="row g-4 mb-4">
              <div className="col-8 col-xxl-8 col-xl-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="کد تخفیف را وارد کنید"
                  aria-label="کد تخفیف را وارد کنید"
                />
              </div>
              <div className="col-4 col-xxl-4 col-xl-12">
                <div className="d-grid">
                  <button type="button" className="btn btn-label-primary">
                    اعمال
                  </button>
                </div>
              </div>
            </div>

            {/* Gift wrap */}
            <div className="bg-lighter rounded p-6">
              <h6 className="mb-2">برای عزیزتان هدیه می‌خرید؟</h6>
              <p className="mb-2">
                بسته‌بندی هدیه همراه با پیام اختصاصی فقط با ۲۰۰ هزار تومان
              </p>
              <a href="javascript:void(0)" className="fw-medium">
                افزودن بسته‌بندی هدیه
              </a>
            </div>
            <hr className="mx-n6 my-6" />

            {/* Price Details */}
            <h6>جزئیات قیمت</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">مجموع سبد</dt>
              <dd className="col-6 text-end">{formatPrice(subtotal)}</dd>

              <dt className="col-6 fw-normal">تخفیف کوپن</dt>
              <dd className="col-6 text-end">
                <a href="javascript:void(0)">اعمال کوپن</a>
              </dd>

              <dt className="col-6 fw-normal">مجموع سفارش</dt>
              <dd className="col-6 text-end">{formatPrice(subtotal)}</dd>
            </dl>
            <hr className="mx-n6 my-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">مبلغ نهایی</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                {formatPrice(subtotal)}
              </dd>
            </dl>
          </div>
          <div className="d-grid">
            <button type="button" className="btn btn-primary" onClick={onNext}>
              ثبت سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartStep;
