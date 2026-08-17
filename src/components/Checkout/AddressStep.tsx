import React, { useState, useEffect } from "react";
import type { Address } from "../../types/address";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { formatPrice } from "../../utils/price";
import { toFarsiNumber } from "../../utils/numbers";

interface AddressStepProps {
  addresses: Address[];
  selectedAddressId: number | undefined;
  onSelectAddress: (id: number) => void;
  onRemoveAddress: (id: number) => void;
  onEditAddress: (id: number) => void;
  onSetDefaultAddress: (id: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onShowAddressModal: () => void;
  setDeliveryPrice: (price: number) => void;
  setFinalPrice: (price: number) => void;
  setSelectedDeliveryOption: (option: any) => void;
  setFreeShipping: (isFree: boolean) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onRemoveAddress,
  onEditAddress,
  onSetDefaultAddress,
  onNext,
  onPrev,
  onShowAddressModal,
  setDeliveryPrice,
  setFinalPrice,
  setSelectedDeliveryOption,
  setFreeShipping,
}) => {
  const { state } = useCheckout();

  const [deliverySpeed, setDeliverySpeed] = useState<string>(
    state.deliveryOption?.id ?? "standard",
  );

  const [addressError, setAddressError] = useState(false);

  const { items, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  const FREE_SHIPPING_THRESHOLD = 4000000 / 60000;

  const freeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;

  const deliveryOptions = [
    {
      id: "standard",
      title: "استاندارد",
      price: 2,
      time: "تحویل محصول طی ۱ هفته",
      icon: "user",
    },
    {
      id: "express",
      title: "سریع",
      price: 3,
      time: "تحویل محصول طی ۳ تا ۴ روز",
      icon: "star",
    },
  ];

  const selectedDelivery = deliveryOptions.find((o) => o.id === deliverySpeed);

  const deliveryPrice = freeShipping ? 0 : selectedDelivery?.price || 0;

  const finalPrice = totalPrice + deliveryPrice;

  useEffect(() => {
    if (state.deliveryOption?.id) {
      setDeliverySpeed(state.deliveryOption.id);
    }
  }, [state.deliveryOption]);

  useEffect(() => {
    setDeliveryPrice(deliveryPrice);
    setFinalPrice(finalPrice);
    setSelectedDeliveryOption(selectedDelivery);
    setFreeShipping(freeShipping);
  }, [deliverySpeed, totalPrice]);

  const getAddressDisplay = (address: Address) => {
    return `${address.addressLine1}${
      address.addressLine2 ? `, ${address.addressLine2}` : ""
    }, ${address.city}, ${address.state}, ${address.zipCode}`;
  };

  const handleNext = () => {
    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId,
    );

    if (!selectedAddress) {
      setAddressError(true);
      return;
    }

    setAddressError(false);
    onNext();
  };

  return (
    <div id="checkout-address" className="content">
      <div className="row">
        {/* Address left */}
        <div className="col-xl-8 mb-6 mb-xl-0">
          {/* Select address */}
          <p className="fw-medium text-heading">
            آدرس مورد نظر خود را انتخاب کنید
          </p>
          <div className="row mb-6 g-6">
            {addresses.map((address) => (
              <div key={address.id} className="col-md">
                <div
                  className={`form-check custom-option custom-option-basic ${
                    selectedAddressId === address.id ? "checked" : ""
                  }`}
                >
                  <label className="form-check-label custom-option-content">
                    <input
                      type="radio"
                      name="address"
                      className="form-check-input"
                      checked={selectedAddressId === address.id}
                      onChange={() => {
                        onSelectAddress(address.id);
                        setAddressError(false);
                      }}
                    />
                    <span className="custom-option-header mb-2">
                      <span className="fw-medium text-heading mb-0">
                        {address.name}
                        {address.isDefault && " (پیش‌فرض)"}
                      </span>
                      <span
                        className={`badge ${
                          address.type === "home"
                            ? "bg-label-primary"
                            : "bg-label-success"
                        }`}
                      >
                        {address.type === "home" ? "خانه" : "محل کار"}
                      </span>
                    </span>
                    <span className="custom-option-body">
                      <small>
                        {getAddressDisplay(address)}
                        <br />
                        موبایل : {address.phone} پرداخت با کارت یا پرداخت در محل
                        امکان‌پذیر است
                      </small>
                      <span className="my-3 border-bottom d-block"></span>
                      <span className="d-flex">
                        <button
                          type="button"
                          className="btn btn-link p-0 me-4 text-decoration-none"
                          onClick={(e) => {
                            e.preventDefault();
                            onEditAddress(address.id);
                          }}
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className="btn btn-link p-0 me-4 text-decoration-none"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!address.isDefault) {
                              onSetDefaultAddress(address.id);
                            }
                          }}
                          disabled={address.isDefault}
                        >
                          {address.isDefault ? "پیش‌فرض" : "انتخاب"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none text-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            if (addresses.length > 1) {
                              onRemoveAddress(address.id);
                            } else {
                              alert("باید حداقل یک آدرس داشته باشید");
                            }
                          }}
                        >
                          حذف
                        </button>
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
            افزودن آدرس جدید
          </button>
          {addressError && (
            <div className="text-danger mb-4">
              لطفاً ابتدا یک آدرس را انتخاب کنید.
            </div>
          )}

          {/* Choose Delivery */}
          <p className="fw-medium text-heading">انتخاب روش ارسال</p>
          {freeShipping && (
            <div className="alert alert-success">
              هزینه ی ارسال برای خرید های بالای ۴,۰۰۰,۰۰۰ تومان رایگان است
            </div>
          )}

          <div
            className={`row mt-2 ${freeShipping ? "shipping-disabled" : ""}`}
          >
            {deliveryOptions.map((option) => (
              <div key={option.id} className="col-md mb-md-0 mb-2">
                <div
                  className={`form-check custom-option custom-option-icon position-relative ${
                    !freeShipping && deliverySpeed === option.id
                      ? "checked"
                      : ""
                  }`}
                >
                  <label className="form-check-label custom-option-content">
                    <span className="custom-option-body">
                      <i
                        className={`icon-base ti tabler-${option.icon} icon-lg`}
                      ></i>
                      <span className="custom-option-title mb-2">
                        {option.title}
                      </span>
                      <span className=" d-block my-2">
                        {formatPrice(option.price)}
                      </span>
                      <small>{option.time}</small>
                    </span>
                    <input
                      type="radio"
                      name="deliverySpeed"
                      className="form-check-input"
                      disabled={freeShipping}
                      checked={!freeShipping && deliverySpeed === option.id}
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
            <h6>خلاصه سفارش</h6>

            <ul className="list-unstyled">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="d-flex gap-4 align-items-center py-2 mb-3"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-px-50 rounded-2"
                    />
                  </div>

                  <div className="flex-grow-1">
                    <p className="mb-0 fw-medium">{item.name}</p>

                    <small className="text-muted d-block mt-2">
                      تعداد: {toFarsiNumber(item.quantity)}
                    </small>
                  </div>

                  <div className="text-end">
                    <small className="fw-medium">
                      {formatPrice(item.price * item.quantity)}
                    </small>
                  </div>
                </li>
              ))}
            </ul>

            <hr className="mx-n6 my-6" />

            {/* Price Details */}
            <h6>جزئیات قیمت</h6>
            <dl className="row mb-0 text-heading">
              <dt className="col-6 fw-normal">مجموع سفارش</dt>
              <dd className="col-6 text-end">{formatPrice(totalPrice)}</dd>

              <dt className="col-6 fw-normal">هزینه ارسال</dt>
              <dd className="col-6 text-end">
                {freeShipping ? (
                  <span className="badge bg-label-success">رایگان</span>
                ) : (
                  formatPrice(deliveryPrice)
                )}
              </dd>
            </dl>
            <hr className="mx-n6 my-6" />
            <dl className="row mb-0">
              <dt className="col-6 text-heading">مبلغ نهایی</dt>
              <dd className="col-6 fw-medium text-end text-heading mb-0">
                {formatPrice(finalPrice)}
              </dd>
            </dl>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-label-secondary flex-fill"
              onClick={onPrev}
            >
              بازگشت به سبد خرید
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill"
              onClick={handleNext}
            >
              ادامه به پرداخت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressStep;
