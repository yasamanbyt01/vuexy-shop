import React, { useState } from "react";
import type { Address } from "../../types/Cart";

interface AddAddressModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (
    address: Omit<Address, "id" | "isDefault"> & { phone: string },
  ) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  show,
  onClose,
  onSave,
}) => {
  const [addressType, setAddressType] = useState<"home" | "office">("home");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "", // Added phone field
    useAsBilling: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = {
      name: `${formData.firstName} ${formData.lastName}`,
      type: addressType,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone,
      // id and isDefault will be set by the parent component
    };
    onSave(address);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      useAsBilling: false,
    });
    setAddressType("home");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!show) return null;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      id="addNewAddress"
      tabIndex={-1}
      aria-hidden="true"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-lg modal-simple modal-add-new-address">
        <div className="modal-content">
          <div className="modal-body">
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                onClose();
                resetForm();
              }}
              aria-label="Close"
            ></button>
            <div className="text-center mb-6">
              <h4 className="address-title mb-2">Add New Address</h4>
              <p className="address-subtitle">
                Add new address for express delivery
              </p>
            </div>
            <form
              id="addNewAddressForm"
              className="row g-6"
              onSubmit={handleSubmit}
            >
              <div className="col-12 form-control-validation">
                <div className="row">
                  <div className="col-md mb-md-0 mb-4">
                    <div
                      className={`form-check custom-option custom-option-icon ${addressType === "home" ? "checked" : ""}`}
                    >
                      <label
                        className="form-check-label custom-option-content"
                        htmlFor="customRadioHome"
                      >
                        <span className="custom-option-body">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              opacity="0.2"
                              d="M16.625 23.625V16.625H11.375V23.625H4.37501V12.6328C4.37437 12.5113 4.39937 12.391 4.44837 12.2798C4.49737 12.1686 4.56928 12.069 4.65939 11.9875L13.4094 4.03592C13.5689 3.88911 13.7778 3.80762 13.9945 3.80762C14.2113 3.80762 14.4202 3.88911 14.5797 4.03592L23.3406 11.9875C23.4287 12.0706 23.4992 12.1706 23.548 12.2814C23.5969 12.3922 23.6231 12.5117 23.625 12.6328V23.625H16.625Z"
                            />
                            <path
                              d="M23.625 23.625V12.6328C23.623 12.5117 23.5969 12.3922 23.548 12.2814C23.4992 12.1706 23.4287 12.0706 23.3406 11.9875L14.5797 4.03592C14.4202 3.88911 14.2113 3.80762 13.9945 3.80762C13.7777 3.80762 13.5689 3.88911 13.4094 4.03592L4.65937 11.9875C4.56926 12.069 4.49736 12.1686 4.44836 12.2798C4.39936 12.391 4.37436 12.5113 4.375 12.6328V23.625M1.75 23.625H26.25M16.625 23.625V17.5C16.625 17.2679 16.5328 17.0454 16.3687 16.8813C16.2046 16.7172 15.9821 16.625 15.75 16.625H12.25C12.0179 16.625 11.7954 16.7172 11.6313 16.8813C11.4672 17.0454 11.375 17.2679 11.375 17.5V23.625"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="custom-option-title">Home</span>
                          <small> Delivery time (9am – 9pm) </small>
                        </span>
                        <input
                          name="addressType"
                          className="form-check-input"
                          type="radio"
                          value="home"
                          id="customRadioHome"
                          checked={addressType === "home"}
                          onChange={() => setAddressType("home")}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="col-md mb-md-0 mb-4">
                    <div
                      className={`form-check custom-option custom-option-icon ${addressType === "office" ? "checked" : ""}`}
                    >
                      <label
                        className="form-check-label custom-option-content"
                        htmlFor="customRadioOffice"
                      >
                        <span className="custom-option-body">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              opacity="0.2"
                              d="M15.75 23.625V4.375C15.75 4.14294 15.6578 3.92038 15.4937 3.75628C15.3296 3.59219 15.1071 3.5 14.875 3.5H4.375C4.14294 3.5 3.92038 3.59219 3.75628 3.75628C3.59219 3.92038 3.5 4.14294 3.5 4.375V23.625"
                            />
                            <path
                              d="M1.75 23.625H26.25M15.75 23.625V4.375C15.75 4.14294 15.6578 3.92038 15.4937 3.75628C15.3296 3.59219 15.1071 3.5 14.875 3.5H4.375C4.14294 3.5 3.92038 3.59219 3.75628 3.75628C3.59219 3.92038 3.5 4.14294 3.5 4.375V23.625M24.5 23.625V11.375C24.5 11.1429 24.4078 10.9204 24.2437 10.7563C24.0796 10.5922 23.8571 10.5 23.625 10.5H15.75M7 7.875H10.5M8.75 14.875H12.25M7 19.25H10.5M19.25 19.25H21M19.25 14.875H21"
                              strokeOpacity="0.9"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="custom-option-title"> Office </span>
                          <small> Delivery time (9am – 5pm) </small>
                        </span>
                        <input
                          name="addressType"
                          className="form-check-input"
                          type="radio"
                          value="office"
                          id="customRadioOffice"
                          checked={addressType === "office"}
                          onChange={() => setAddressType("office")}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 form-control-validation col-md-6">
                <label className="form-label" htmlFor="modalAddressFirstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="modalAddressFirstName"
                  name="firstName"
                  className="form-control"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 form-control-validation col-md-6">
                <label className="form-label" htmlFor="modalAddressLastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="modalAddressLastName"
                  name="lastName"
                  className="form-control"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 form-control-validation col-md-6">
                <label className="form-label" htmlFor="modalAddressPhone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="modalAddressPhone"
                  name="phone"
                  className="form-control"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 form-control-validation col-md-6">
                <label className="form-label" htmlFor="modalAddressCountry">
                  Country
                </label>
                <select
                  id="modalAddressCountry"
                  name="country"
                  className="form-select"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="modalAddressAddress1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="modalAddressAddress1"
                  name="addressLine1"
                  className="form-control"
                  placeholder="4135 Parkway Street"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="modalAddressAddress2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="modalAddressAddress2"
                  name="addressLine2"
                  className="form-control"
                  placeholder="Suite 100"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="modalAddressLandmark">
                  Landmark
                </label>
                <input
                  type="text"
                  id="modalAddressLandmark"
                  name="landmark"
                  className="form-control"
                  placeholder="Near Central Park"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="modalAddressCity">
                  City
                </label>
                <input
                  type="text"
                  id="modalAddressCity"
                  name="city"
                  className="form-control"
                  placeholder="Los Angeles"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="modalAddressState">
                  State
                </label>
                <input
                  type="text"
                  id="modalAddressState"
                  name="state"
                  className="form-control"
                  placeholder="California"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="modalAddressZipCode">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="modalAddressZipCode"
                  name="zipCode"
                  className="form-control"
                  placeholder="90017"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="billingAddress"
                    name="useAsBilling"
                    checked={formData.useAsBilling}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="billingAddress" className="form-check-label">
                    Use as a billing address?
                  </label>
                </div>
              </div>
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary me-3">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
