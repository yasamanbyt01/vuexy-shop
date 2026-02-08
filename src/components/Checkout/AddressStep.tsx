import React, { useState } from "react";

interface AddressStepProps {
  onNext: () => void;
  onPrev: () => void;
  onShowAddressModal: () => void;
}

const AddressStep: React.FC<AddressStepProps> = ({
  onNext,
  onPrev,
  onShowAddressModal,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>("1");
  const [deliverySpeed, setDeliverySpeed] = useState<string>("standard");

  const addresses = [
    {
      id: "1",
      name: "John Doe (Default)",
      type: "home" as const,
      address: "4135 Parkway Street, Los Angeles, CA, 90017.",
      phone: "+1 234 567 8900",
    },
    {
      id: "2",
      name: "ACME Inc.",
      type: "office" as const,
      address: "87 Hoffman Avenue, New York, NY, 10016.",
      phone: "+1 234 567 8901",
    },
  ];

  const deliveryOptions = [
    {
      id: "standard",
      title: "Standard",
      price: "FREE",
      time: "Get your product in 1 Week.",
      icon: "user",
    },
    {
      id: "express",
      title: "Express",
      price: "$10",
      time: "Get your product in 3-4 days.",
      icon: "star",
    },
    {
      id: "overnight",
      title: "Overnight",
      price: "$15",
      time: "Get your product in 0-1 days.",
      icon: "crown",
    },
  ];

  return (
    <div id="checkout-address" className="content">
      <div className="row">
        {/* Address left */}
        <div className="col-xl-8 mb-6 mb-xl-0">
          {/* Select address */}
          <p className="fw-medium text-heading">
            Select your preferable address
          </p>
          <div className="row mb-6 g-6">
            {addresses.map((address) => (
              <div key={address.id} className="col-md">
                <div
                  className={`form-check custom-option custom-option-basic ${selectedAddress === address.id ? "checked" : ""}`}
                >
                  <label className="form-check-label custom-option-content">
                    <input
                      type="radio"
                      name="address"
                      className="form-check-input"
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                    />
                    <span className="custom-option-header mb-2">
                      <span className="fw-medium text-heading mb-0">
                        {address.name}
                      </span>
                      <span
                        className={`badge ${address.type === "home" ? "bg-label-primary" : "bg-label-success"}`}
                      >
                        {address.type === "home" ? "Home" : "Office"}
                      </span>
                    </span>
                    <span className="custom-option-body">
                      <small>
                        {address.address}
                        <br />
                        Mobile : {address.phone} Card / Cash on delivery
                        available
                      </small>
                      <span className="my-3 border-bottom d-block"></span>
                      <span className="d-flex">
                        <a className="me-4" href="javascript:void(0)">
                          Edit
                        </a>
                        <a href="javascript:void(0)">Remove</a>
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-label-primary mb-6"
            onClick={onShowAddressModal}
          >
            Add new address
          </button>

          {/* Choose Delivery */}
          <p className="fw-medium text-heading">Choose Delivery Speed</p>
          <div className="row mt-2">
            {deliveryOptions.map((option) => (
              <div key={option.id} className="col-md mb-md-0 mb-2">
                <div
                  className={`form-check custom-option custom-option-icon position-relative ${deliverySpeed === option.id ? "checked" : ""}`}
                >
                  <label className="form-check-label custom-option-content">
                    <span className="custom-option-body">
                      <i
                        className={`icon-base ti tabler-${option.icon} icon-lg`}
                      ></i>
                      <span className="custom-option-title mb-2">
                        {option.title}
                      </span>
                      <span
                        className={`badge ${option.price === "FREE" ? "bg-label-success" : "bg-label-secondary"} btn-pinned`}
                      >
                        {option.price}
                      </span>
                      <small>{option.time}</small>
                    </span>
                    <input
                      type="radio"
                      name="deliverySpeed"
                      className="form-check-input"
                      checked={deliverySpeed === option.id}
                      onChange={() => setDeliverySpeed(option.id)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address right */}
        <div className="col-xl-4">
          <div className="border rounded p-6 mb-4">
            {/* Estimated Delivery */}
            <h6>Estimated Delivery Date</h6>
            <ul className="list-unstyled">
              <li className="d-flex gap-4 align-items-center py-2 mb-4">
                <div className="flex-shrink-0">
                  <img
                    src="../../assets/img/products/1.png"
                    alt="google home"
                    className="w-px-50"
                  />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">
                    <a className="text-body" href="javascript:void(0)">
                      Google - Google Home - White
                    </a>
                  </p>
                  <p className="fw-medium mb-0">18th Nov 2021</p>
                </div>
              </li>
              <li className="d-flex gap-4 align-items-center py-2">
                <div className="flex-shrink-0">
                  <img
                    src="../../assets/img/products/2.png"
                    alt="google home"
                    className="w-px-50"
                  />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">
                    <a className="text-body" href="javascript:void(0)">
                      Apple iPhone 11 (64GB, Black)
                    </a>
                  </p>
                  <p className="fw-medium mb-0">20th Nov 2021</p>
                </div>
              </li>
            </ul>

            <hr className="mx-n6 my-6" />

            {/* Price Details */}
            <h6>Price Details</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">Order Total</dt>
              <dd className="col-6 text-end">$1198.00</dd>

              <dt className="col-6 fw-normal">Delivery Charges</dt>
              <dd className="col-6 text-end">
                <s className="text-body-secondary">$5.00</s>{" "}
                <span className="badge bg-label-success ms-2">FREE</span>
              </dd>
            </dl>
            <hr className="mx-n6 my-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">Total</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                $1198.00
              </dd>
            </dl>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-label-secondary flex-fill"
              onClick={onPrev}
            >
              Back to Cart
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill"
              onClick={onNext}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressStep;
