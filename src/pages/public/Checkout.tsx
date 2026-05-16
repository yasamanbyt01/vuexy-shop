import Stepper from "bs-stepper";
import { useEffect, useRef, useState } from "react";
import CartStep from "../../components/Checkout/CartStep";
import AddressStep from "../../components/Checkout/AddressStep";
import PaymentStep from "../../components/Checkout/PaymentStep";
import ConfirmationStep from "../../components/Checkout/ConfirmationStep";
import AddAddressModal from "../../components/Checkout/AddAddressModal";
import type { Address } from "../../types/address";
import {
  getAddresses,
  addAddress,
  removeAddress,
  setDefaultAddress,
} from "../../lib/userStorage";

import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { scrollTop } from "../../utils/scroll";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const stepperRef = useRef<Stepper | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const { state, dispatch } = useCheckout();
  const {
    selectedAddressId,
    deliveryOption,
    deliveryPrice,
    finalPrice,
    freeShipping,
  } = state;

  const { items } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50);
    }
  }, [items.length]);

  const goNext = () => {
    stepperRef.current?.next();
    scrollTop();
  };

  const goPrev = () => {
    stepperRef.current?.previous();
    scrollTop();
  };

  useEffect(() => {
    const storedAddresses = getAddresses();
    setAddresses(storedAddresses);
  }, []);

  useEffect(() => {
    const element = document.querySelector("#wizard-checkout");
    if (!element) return;

    const stepper = new Stepper(element as HTMLElement, {
      linear: false,
    });

    stepperRef.current = stepper;

    const STORAGE_KEY = "checkoutStep";

    // ✅ Restore saved step AFTER init
    const savedStep = Number(localStorage.getItem(STORAGE_KEY)) || 0;

    if (savedStep > 0) {
      // move forward step by step
      for (let i = 0; i < savedStep; i++) {
        stepper.next();
      }
    }

    // ✅ Listen to official event (no private API)
    const handleStepChange = (event: Event) => {
      const e = event as CustomEvent<{ indexStep: number }>;
      const index = e.detail?.indexStep ?? 0;
      localStorage.setItem(STORAGE_KEY, index.toString());
    };

    element.addEventListener("shown.bs-stepper", handleStepChange);

    return () => {
      element.removeEventListener("shown.bs-stepper", handleStepChange);
    };
  }, []);

  const handleAddAddress = (
    newAddressData: Omit<Address, "id" | "isDefault">,
  ) => {
    const newAddress: Address = {
      ...newAddressData,
      id: addresses.length ? Math.max(...addresses.map((a) => a.id)) + 1 : 1,
      isDefault: addresses.length === 0,
    };

    addAddress(newAddress);
    setAddresses(getAddresses());

    dispatch({ type: "SET_SELECTED_ADDRESS", payload: newAddress.id });

    setShowAddressModal(false);
  };

  const handleRemoveAddress = (id: number) => {
    removeAddress(id);

    const updated = getAddresses();
    setAddresses(updated);

    if (selectedAddressId === id) {
      const nextId =
        updated.find((a) => a.isDefault)?.id ??
        (updated.length ? updated[0].id : undefined);

      dispatch({ type: "SET_SELECTED_ADDRESS", payload: nextId });
    }
  };

  const handleEditAddress = (id: number) => {
    // For now, we'll just log. You can implement edit modal later
    console.log("Edit address:", id);
  };

  const handleSetDefaultAddress = (id: number) => {
    setDefaultAddress(id);

    const updated = getAddresses();
    setAddresses(updated);

    dispatch({ type: "SET_SELECTED_ADDRESS", payload: id });
  };

  if (items.length === 0) {
    return (
      <section className="section-py bg-body">
        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center text-center py-5">
            <i className="ti tabler-shopping-cart-off fs-1 mb-3"></i>
            <h4 className="mb-2">سبد خرید شما خالی است</h4>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-py bg-body">
        <div className="container">
          {/* Checkout Wizard */}
          <div
            id="wizard-checkout"
            className="bs-stepper wizard-icons wizard-icons-example"
          >
            {/* Stepper Header */}
            <div className="bs-stepper-header m-lg-auto border-0">
              <div className="step active" data-target="#checkout-cart">
                <button type="button" className="step-trigger">
                  <span className="bs-stepper-icon">
                    <svg viewBox="0 0 60 60">
                      <use xlinkHref="/assets/svg/icons/wizard-checkout-cart.svg#wizardCart" />
                    </svg>
                  </span>
                  <span className="bs-stepper-label">سبد خرید</span>
                </button>
              </div>

              <div className="line">
                <i className="icon-base ti tabler-chevron-right"></i>
              </div>

              <div className="step" data-target="#checkout-address">
                <button type="button" className="step-trigger">
                  <span className="bs-stepper-icon">
                    <svg viewBox="0 0 60 60">
                      <use xlinkHref="/assets/svg/icons/wizard-checkout-address.svg#wizardCheckoutAddress" />
                    </svg>
                  </span>
                  <span className="bs-stepper-label">آدرس</span>
                </button>
              </div>

              <div className="line">
                <i className="icon-base ti tabler-chevron-right"></i>
              </div>

              <div className="step" data-target="#checkout-payment">
                <button type="button" className="step-trigger">
                  <span className="bs-stepper-icon">
                    <svg viewBox="0 0 60 60">
                      <use xlinkHref="/assets/svg/icons/wizard-checkout-payment.svg#wizardPayment" />
                    </svg>
                  </span>
                  <span className="bs-stepper-label">پرداخت</span>
                </button>
              </div>

              <div className="line">
                <i className="icon-base ti tabler-chevron-right"></i>
              </div>

              <div className="step" data-target="#checkout-confirmation">
                <button type="button" className="step-trigger">
                  <span className="bs-stepper-icon">
                    <svg viewBox="0 0 60 60">
                      <use xlinkHref="/assets/svg/icons/wizard-checkout-confirmation.svg#wizardConfirm" />
                    </svg>
                  </span>
                  <span className="bs-stepper-label">تأیید نهایی</span>
                </button>
              </div>
            </div>

            {/* Stepper Content */}
            <div className="bs-stepper-content border-top">
              <form>
                {/* Cart */}
                <CartStep onNext={goNext} />

                {/* Address */}
                <AddressStep
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={(id) =>
                    dispatch({ type: "SET_SELECTED_ADDRESS", payload: id })
                  }
                  onRemoveAddress={handleRemoveAddress}
                  onEditAddress={handleEditAddress}
                  onSetDefaultAddress={handleSetDefaultAddress}
                  setDeliveryPrice={(price) =>
                    dispatch({ type: "SET_DELIVERY_PRICE", payload: price })
                  }
                  setFinalPrice={(price) =>
                    dispatch({ type: "SET_FINAL_PRICE", payload: price })
                  }
                  setSelectedDeliveryOption={(option) =>
                    dispatch({ type: "SET_DELIVERY_OPTION", payload: option })
                  }
                  setFreeShipping={(value) =>
                    dispatch({ type: "SET_FREE_SHIPPING", payload: value })
                  }
                  onPrev={goPrev}
                  onNext={goNext}
                  onShowAddressModal={() => setShowAddressModal(true)}
                />

                {/* Payment */}
                <PaymentStep
                  selectedAddress={addresses.find(
                    (a) => a.id === selectedAddressId,
                  )}
                  deliveryPrice={deliveryPrice}
                  finalPrice={finalPrice}
                  onPrev={goPrev}
                  onNext={goNext}
                />

                {/* Confirmation */}
                <ConfirmationStep
                  selectedAddress={addresses.find(
                    (a) => a.id === selectedAddressId,
                  )}
                  deliveryPrice={deliveryPrice}
                  finalPrice={finalPrice}
                  selectedDeliveryOption={deliveryOption}
                  freeShipping={freeShipping}
                  onComplete={() => {
                    localStorage.removeItem("checkoutStep");
                    dispatch({ type: "RESET_CHECKOUT" });
                    navigate("/");
                  }}
                />
              </form>
            </div>
          </div>
          {/* /Checkout Wizard */}
        </div>
      </section>

      {/* Address Modal */}
      <AddAddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddAddress}
      />
    </>
  );
};

export default Checkout;
