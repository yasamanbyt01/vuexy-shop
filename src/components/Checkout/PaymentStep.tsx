import React, { useState } from "react";
import type { Address } from "../../types/Cart";

interface PaymentStepProps {
  selectedAddress?: Address;
  onNext: () => void;
  onPrev: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedAddress,
  onNext,
  onPrev,
}) => {
  const [activePaymentTab, setActivePaymentTab] = useState<string>("cc");
  const [saveCard, setSaveCard] = useState<boolean>(false);

  const paymentTabs = [
    { id: "cc", label: "Card" },
    { id: "cod", label: "Cash On Delivery" },
    { id: "gift-card", label: "Gift Card" },
  ];

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

          {/* Payment Tabs */}
          <div className="col-xxl-6 col-lg-8">
            <div className="nav-align-top">
              <ul
                className="nav nav-pills card-header-pills row-gap-2 flex-wrap"
                id="paymentTabs"
                role="tablist"
              >
                {paymentTabs.map((tab) => (
                  <li key={tab.id} className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activePaymentTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActivePaymentTab(tab.id)}
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
                      Card Number
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
                      Name
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
                      Exp. Date
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
                      CVV Code
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
                        Save card for future billing?
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
                  Cash on Delivery is a type of payment method where the
                  recipient make payment for the order at the time of delivery
                  rather than in advance.
                </p>
              </div>

              {/* Gift card */}
              <div
                className={`tab-pane fade ${
                  activePaymentTab === "gift-card" ? "show active" : ""
                }`}
              >
                <h6>Enter Gift Card Details</h6>
                <div className="row g-5">
                  <div className="col-12">
                    <label htmlFor="giftCardNumber" className="form-label">
                      Gift card number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="giftCardNumber"
                      placeholder="Gift card number"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="giftCardPin" className="form-label">
                      Gift card pin
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="giftCardPin"
                      placeholder="Gift card pin"
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
            <h6>Price Details</h6>
            <dl className="row text-heading">
              <dt className="col-6 fw-normal">Order Total</dt>
              <dd className="col-6 text-end">$1198.00</dd>

              <dt className="col-6 fw-normal">Delivery Charges</dt>
              <dd className="col-6 text-end">
                <s className="text-body-secondary">$5.00</s>{" "}
                <span className="badge bg-label-success ms-1">FREE</span>
              </dd>
            </dl>
            <hr className="mx-n6 my-6" />
            <dl className="row">
              <dt className="col-6 text-heading mb-3">Total</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                $1198.00
              </dd>

              <dt className="col-6 fw-medium text-heading">Deliver to:</dt>
              <dd className="col-6 fw-medium text-end mb-0">
                <span
                  className={`badge ${
                    selectedAddress?.type === "home"
                      ? "bg-label-primary"
                      : "bg-label-success"
                  }`}
                >
                  {selectedAddress?.type === "home" ? "Home" : "Office"}
                </span>
              </dd>
            </dl>
            {/* Address Details */}
            {selectedAddress && (
              <address>
                <span className="text-heading fw-medium">
                  {selectedAddress.name}
                  {selectedAddress.isDefault && " (Default)"},
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
                Mobile : {selectedAddress.phone}
              </address>
            )}
          </div>
          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className="btn btn-label-secondary flex-fill"
              onClick={onPrev}
            >
              Back to Address
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill"
              onClick={onNext}
            >
              Review Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
