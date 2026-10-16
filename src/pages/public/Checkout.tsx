import Stepper from "bs-stepper";
import { useCallback, useEffect, useRef, useState } from "react";
import CartStep from "../../components/Checkout/CartStep";
import AddressStep from "../../components/Checkout/AddressStep";
import PaymentStep from "../../components/Checkout/PaymentStep";
import ConfirmationStep from "../../components/Checkout/ConfirmationStep";
import AddAddressModal from "../../components/Checkout/AddAddressModal";
import type { Address } from "../../types/address";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  type AddressInput,
} from "../../services/addresses";

import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { scrollTop } from "../../utils/scroll";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Checkout = () => {
  const stepperRef = useRef<Stepper | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressLoadError, setAddressLoadError] = useState<string | null>(null);
  const [addressActionError, setAddressActionError] = useState<string | null>(
    null,
  );
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressValidationTrigger, setAddressValidationTrigger] = useState(0);
  const [hasCreatedOrder, setHasCreatedOrder] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { state, dispatch } = useCheckout();
  const {
    selectedAddressId,
    deliveryOption,
    deliveryPrice,
    finalPrice,
    freeShipping,
  } = state;

  const currentStepRef = useRef(currentStep);
  const selectedAddressIdRef = useRef<number | undefined>(selectedAddressId);
  const addressesRef = useRef(addresses);
  const addressLoadErrorRef = useRef(addressLoadError);
  const promptedForFirstAddressRef = useRef(false);
  currentStepRef.current = currentStep;
  selectedAddressIdRef.current = selectedAddressId;
  addressesRef.current = addresses;
  addressLoadErrorRef.current = addressLoadError;

  const { items } = useCart();

  const navigate = useNavigate();
  const { user, token } = useAuthContext();

  useEffect(() => {
    if (items.length === 0 && !hasCreatedOrder) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50);
    }
  }, [items.length, hasCreatedOrder]);

  const goNext = () => {
    stepperRef.current?.next();
    scrollTop();
  };

  const goPrev = () => {
    stepperRef.current?.previous();
    scrollTop();
  };

  const isAddressValid = useCallback(
    () =>
      addressesRef.current.some(
        (address) => address.id === selectedAddressIdRef.current,
      ),
    [],
  );

  // Customer addresses belong to the authenticated user and are always loaded
  // from NestJS. We never use browser storage as the source of truth.
  useEffect(() => {
    let isActive = true;

    const loadAddresses = async () => {
      if (!token) {
        setAddresses([]);
        setAddressesLoading(false);
        dispatch({ type: "SET_SELECTED_ADDRESS", payload: undefined });
        return;
      }

      setAddressesLoading(true);
      setAddressLoadError(null);

      try {
        const result = await getAddresses(token);
        if (!isActive) return;

        setAddresses(result);
        // Selection for this checkout is separate from the account's default.
        // Keep the previous selection when it still exists; use the default
        // only when there is no valid saved selection.
        const previousSelectedId = selectedAddressIdRef.current;
        const preferredAddress =
          result.find((address) => address.id === previousSelectedId) ??
          result.find((address) => address.isDefault) ??
          result[0];

        dispatch({
          type: "SET_SELECTED_ADDRESS",
          payload: preferredAddress?.id,
        });

        // If there are no saved addresses, start checkout at the cart step.
        // The first-address form opens when the customer enters the address step.
        if (result.length === 0) {
          localStorage.removeItem("checkoutStep");
          setEditingAddress(null);
        }
      } catch (error) {
        if (!isActive) return;
        setAddressLoadError(
          error instanceof Error
            ? error.message
            : "دریافت آدرس‌ها ناموفق بود. دوباره تلاش کنید.",
        );
      } finally {
        if (isActive) setAddressesLoading(false);
      }
    };

    void loadAddresses();
    return () => {
      isActive = false;
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (
      currentStep !== 1 ||
      addressesLoading ||
      addressLoadError ||
      addresses.length > 0 ||
      promptedForFirstAddressRef.current
    ) {
      return;
    }

    promptedForFirstAddressRef.current = true;
    setEditingAddress(null);
    setShowAddressModal(true);
  }, [currentStep, addressesLoading, addressLoadError, addresses.length]);

  useEffect(() => {
    if (addressesLoading) return;

    const element = document.querySelector("#wizard-checkout");
    if (!element) return;

    const stepper = new Stepper(element as HTMLElement, {
      linear: false,
    });

    stepperRef.current = stepper;

    const handleStepClick = (event: Event) => {
      const target = event.target as HTMLElement;

      const stepTrigger = target.closest(".step-trigger");

      if (!stepTrigger) return;

      const step = stepTrigger.closest(".step") as HTMLElement | null;

      if (!step) return;

      const targetStep = step.dataset.target;

      const requiresAddress =
        targetStep === "#checkout-payment" ||
        targetStep === "#checkout-confirmation";

      if (requiresAddress && !isAddressValid()) {
        event.preventDefault();
        event.stopPropagation();

        if (currentStepRef.current === 0) {
          if (addressesRef.current.length > 0) {
            setAddressValidationTrigger((prev) => prev + 1);
          }
          stepperRef.current?.next();
          scrollTop();
        } else {
          setAddressValidationTrigger((prev) => prev + 1);
        }
      }
    };

    element.addEventListener("click", handleStepClick, true);

    const STORAGE_KEY = "checkoutStep";

    // Restore saved step
    const savedStep =
      addressesRef.current.length > 0 && !addressLoadErrorRef.current
        ? Number(localStorage.getItem(STORAGE_KEY)) || 0
        : 0;

    if (
      savedStep === 0 &&
      (addressesRef.current.length === 0 || addressLoadErrorRef.current)
    ) {
      localStorage.removeItem(STORAGE_KEY);
    }
    setCurrentStep(savedStep);

    if (savedStep > 0) {
      // Move forward step by step
      for (let i = 0; i < savedStep; i++) {
        stepper.next();
      }
    }

    // Add/remove Vuexy's "crossed" class
    // so previous steps keep their purple styling.
    const updateCrossedSteps = (currentIndex: number) => {
      const steps = element.querySelectorAll(".step");

      steps.forEach((step, stepIndex) => {
        step.classList.toggle("crossed", stepIndex < currentIndex);
      });
    };

    // Apply crossed state immediately after restoring
    updateCrossedSteps(savedStep);

    // Listen to step changes
    const handleStepChange = (event: Event) => {
      const e = event as CustomEvent<{ indexStep: number }>;
      const index = e.detail?.indexStep ?? 0;

      localStorage.setItem(STORAGE_KEY, index.toString());
      setCurrentStep(index);

      updateCrossedSteps(index);
    };

    element.addEventListener("shown.bs-stepper", handleStepChange);

    return () => {
      element.removeEventListener("click", handleStepClick, true);
      element.removeEventListener("shown.bs-stepper", handleStepChange);
    };
  }, [addressesLoading, isAddressValid]);

  const refreshAddresses = async (preferredId?: number) => {
    if (!token)
      throw new Error("برای مدیریت آدرس‌ها ابتدا وارد حساب کاربری شوید.");

    const updated = await getAddresses(token);
    setAddresses(updated);

    const preferredAddress =
      updated.find((address) => address.id === preferredId) ??
      updated.find((address) => address.isDefault) ??
      updated[0];

    dispatch({
      type: "SET_SELECTED_ADDRESS",
      payload: preferredAddress?.id,
    });

    return updated;
  };

  const handleSaveAddress = async (addressData: AddressInput) => {
    if (!token) throw new Error("برای ذخیره آدرس ابتدا وارد حساب کاربری شوید.");

    setAddressActionError(null);

    try {
      const savedAddress = editingAddress
        ? await updateAddress(editingAddress.id, addressData, token)
        : await createAddress(addressData, token);

      await refreshAddresses(savedAddress.id);
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "ذخیره آدرس ناموفق بود.";
      setAddressActionError(message);
      throw error;
    }
  };

  const handleRemoveAddress = async (id: number) => {
    if (!token) return;
    setAddressActionError(null);

    try {
      await deleteAddress(id, token);
      const updated = await getAddresses(token);
      setAddresses(updated);

      if (selectedAddressId === id) {
        const nextAddress =
          updated.find((address) => address.isDefault) ?? updated[0];
        dispatch({
          type: "SET_SELECTED_ADDRESS",
          payload: nextAddress?.id,
        });
      }

      if (updated.length === 0) {
        dispatch({ type: "SET_SELECTED_ADDRESS", payload: undefined });
        setEditingAddress(null);
        setShowAddressModal(true);
      }
    } catch (error) {
      setAddressActionError(
        error instanceof Error ? error.message : "حذف آدرس ناموفق بود.",
      );
    }
  };

  const handleEditAddress = (id: number) => {
    const addressToEdit = addresses.find((address) => address.id === id);
    if (!addressToEdit) return;

    setAddressActionError(null);
    setEditingAddress(addressToEdit);
    setShowAddressModal(true);
  };

  const handleSetDefaultAddress = async (id: number) => {
    if (!token) return;
    setAddressActionError(null);

    try {
      await setDefaultAddress(id, token);
      // In checkout, the customer's explicit "set as default" action should
      // also select that address for the order they are placing right now.
      // The default remains saved by NestJS for future checkouts as well.
      await refreshAddresses(id);
    } catch (error) {
      setAddressActionError(
        error instanceof Error
          ? error.message
          : "تغییر آدرس پیش‌فرض ناموفق بود.",
      );
    }
  };

  if (addressesLoading && items.length > 0) {
    return (
      <section className="section-py bg-body">
        <div className="container text-center py-5" role="status">
          <div
            className="spinner-border text-primary mb-3"
            aria-hidden="true"
          />
          <p className="mb-0">در حال دریافت آدرس‌های شما…</p>
        </div>
      </section>
    );
  }

  if (items.length === 0 && !hasCreatedOrder) {
    return (
      <section className="checkout-empty-cart flex-grow-1 d-flex align-items-center justify-content-center bg-body py-5">
        <div className="container">
          <div className="d-flex flex-column align-items-center text-center">
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
                {(addressLoadError ||
                  (addressActionError && !showAddressModal)) && (
                  <div className="alert alert-danger" role="alert">
                    {addressLoadError || addressActionError}
                    {addressLoadError && (
                      <button
                        type="button"
                        className="btn btn-sm btn-label-danger ms-3"
                        onClick={() => window.location.reload()}
                      >
                        تلاش دوباره
                      </button>
                    )}
                  </div>
                )}
                <AddressStep
                  addresses={addresses}
                  addressesLoading={addressesLoading}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={(id) =>
                    dispatch({ type: "SET_SELECTED_ADDRESS", payload: id })
                  }
                  addressValidationTrigger={addressValidationTrigger}
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
                  customer={user}
                  token={token}
                  paymentMethod={state.paymentMethod ?? "card"}
                  onOrderCreated={() => {
                    // A successful order ends this checkout session. Keep the
                    // confirmation visible in component state, but don't let a
                    // refresh or the next cart reuse the old wizard step/state.
                    setHasCreatedOrder(true);
                    localStorage.removeItem("checkoutStep");
                    dispatch({ type: "RESET_CHECKOUT" });
                  }}
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
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setAddressActionError(null);
        }}
        initialAddress={editingAddress ?? undefined}
        customerName={user?.name}
        onSave={handleSaveAddress}
      />
    </>
  );
};

export default Checkout;
