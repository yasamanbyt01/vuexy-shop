import React from "react";
import { useCart } from "../../context/CartContext";

interface CartStepProps {
  onNext: () => void;
}

const CartStep: React.FC<CartStepProps> = ({ onNext }) => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

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
                <h5 className="alert-heading mb-1">Available Offers</h5>
                <ul className="list-unstyled mb-0">
                  <li>
                    - 10% Instant Discount on Bank of America Corp Bank Debit
                    and Credit cards
                  </li>
                  <li>
                    - 25% Cashback Voucher of up to $60 on first ever PayPal
                    transaction. TCA
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

          {/* Shopping bag */}
          <h5>My Shopping Bag ({items.length} Items)</h5>
          <ul className="list-group mb-4">
            {items.map((item) => (
              <li key={item.id} className="list-group-item p-6">
                <div className="d-flex gap-4">
                  <div className="flex-shrink-0 d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-px-100"
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
                          <span className="me-1">Sold by:</span>
                          <a href="javascript:void(0)" className="me-4">
                            {item.seller}
                          </a>
                          <span
                            className={`badge ${item.inStock ? "bg-label-success" : "bg-label-danger"}`}
                          >
                            {item.inStock ? "In Stock" : "Out of Stock"}
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
                            <span className="text-primary">${item.price}/</span>
                            {item.discountedPrice && (
                              <s className="text-body">
                                ${item.discountedPrice}
                              </s>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-label-primary"
                          >
                            Move to wishlist
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
              <span className="fw-medium">Add More Products From Wishlist</span>
              <i className="icon-base ti tabler-arrow-right icon-xs scaleX-n1-rtl mt-50"></i>
            </a>
          </div>
        </div>

        {/* Cart right */}
        <div className="col-xl-4">
          <div className="border rounded p-6 mb-4">
            {/* Offer */}
            <h6>Offer</h6>
            <div className="row g-4 mb-4">
              <div className="col-8 col-xxl-8 col-xl-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Promo Code"
                  aria-label="Enter Promo Code"
                />
              </div>
              <div className="col-4 col-xxl-4 col-xl-12">
                <div className="d-grid">
                  <button type="button" className="btn btn-label-primary">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Gift wrap */}
            <div className="bg-lighter rounded p-6">
              <h6 className="mb-2">Buying gift for a loved one?</h6>
              <p className="mb-2">
                Gift wrap and personalized message on card, Only for $2.
              </p>
              <a href="javascript:void(0)" className="fw-medium">
                Add a gift wrap
              </a>
            </div>
            <hr className="mx-n6 my-6" />

            {/* Price Details */}
            <h6>Price Details</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">Bag Total</dt>
              <dd className="col-6 text-end">${getTotalPrice().toFixed(2)}</dd>

              <dt className="col-6 fw-normal">Coupon Discount</dt>
              <dd className="col-6 text-end">
                <a href="javascript:void(0)">Apply Coupon</a>
              </dd>

              <dt className="col-6 fw-normal">Order Total</dt>
              <dd className="col-6 text-end">${getTotalPrice().toFixed(2)}</dd>

              <dt className="col-6 fw-normal">Delivery Charges</dt>
              <dd className="col-6 text-end">
                <s className="text-body-secondary">$5.00</s>{" "}
                <span className="badge bg-label-success ms-1">FREE</span>
              </dd>
            </dl>
            <hr className="mx-n6 my-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">Total</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                ${getTotalPrice().toFixed(2)}
              </dd>
            </dl>
          </div>
          <div className="d-grid">
            <button type="button" className="btn btn-primary" onClick={onNext}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartStep;
