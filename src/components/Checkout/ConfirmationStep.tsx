import React from "react";
import { useCart } from "../../context/CartContext";
import type { Address } from "../../types/Cart";

interface ConfirmationStepProps {
  selectedAddress?: Address;
  onComplete: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedAddress,
  onComplete,
}) => {
  const { items, clearCart, getTotalPrice } = useCart();
  const orderNumber = "1536548131";
  const orderDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleComplete = () => {
    clearCart();
    onComplete();
  };

  return (
    <div id="checkout-confirmation" className="content">
      <div className="row mb-6">
        <div className="col-12 col-lg-8 mx-auto text-center mb-2">
          <h4>Thank You! 😇</h4>
          <p>
            Your order{" "}
            <a href="#" className="text-heading fw-medium">
              #{orderNumber}
            </a>{" "}
            has been placed!
          </p>
          <p>
            We sent an email to
            <a
              href="mailto:john.doe@example.com"
              className="text-heading fw-medium"
            >
              {" "}
              john.doe@example.com
            </a>{" "}
            with your order confirmation and receipt. If the email hasn't
            arrived within two minutes, please check your spam folder to see if
            the email was routed there.
          </p>
          <p>
            <span>
              <i className="icon-base ti tabler-clock me-1 text-heading"></i>{" "}
              Time placed:&nbsp;
            </span>
            {orderDate}
          </p>
        </div>
        {/* Confirmation details */}
        <div className="col-12">
          <ul className="list-group list-group-horizontal-md">
            <li className="list-group-item flex-fill p-6 text-body">
              <h6 className="d-flex align-items-center gap-2">
                <i className="icon-base ti tabler-map-pin"></i> Shipping
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
                    {selectedAddress.country}
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
                <i className="icon-base ti tabler-credit-card"></i> Billing
                Address
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
                    {selectedAddress.country}
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
                <i className="icon-base ti tabler-ship"></i> Shipping Method
              </h6>
              <p className="fw-medium mb-4">Preferred Method:</p>
              Standard Delivery
              <br />
              (Normally 3-4 business days)
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
                    <img src={item.image} alt={item.name} className="w-px-80" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="row">
                      <div className="col-md-8">
                        <a href="#">
                          <h6 className="mb-2">{item.name}</h6>
                        </a>
                        <div className="text-body mb-2 d-flex flex-wrap">
                          <span className="me-1">Sold by:</span>
                          <a href="#" className="me-3">
                            {item.seller}
                          </a>
                          <span className="badge bg-label-success">
                            In Stock
                          </span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-md-end">
                          <div className="my-2 my-lg-6">
                            <span className="text-primary">${item.price}/</span>
                            {item.discountedPrice && (
                              <s className="text-body-secondary">
                                ${item.discountedPrice}
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
            <h6>Price Details</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">Order Total</dt>
              <dd className="col-6 text-end">${getTotalPrice().toFixed(2)}</dd>

              <dt className="col-sm-6 text-heading fw-normal">Charges</dt>
              <dd className="col-sm-6 text-end text-body-secondary">
                $5.00<span className="badge bg-label-success ms-2">FREE</span>
              </dd>
            </dl>
            <hr className="mx-n6 mb-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">Total</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                ${getTotalPrice().toFixed(2)}
              </dd>
            </dl>
          </div>
          <div className="d-grid mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleComplete}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
