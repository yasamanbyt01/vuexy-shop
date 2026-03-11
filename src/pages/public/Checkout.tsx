import Stepper from "bs-stepper";
import { useEffect, useRef, useState } from "react";
import CartStep from "../../components/Checkout/CartStep";
import AddressStep from "../../components/Checkout/AddressStep";
import PaymentStep from "../../components/Checkout/PaymentStep";
import ConfirmationStep from "../../components/Checkout/ConfirmationStep";
import AddAddressModal from "../../components/Checkout/AddAddressModal";
import type { Address } from "../../types/cart";
import { mockAddresses } from "../../mock/addresses";
import { useCart } from "../../context/CartContext";
import { scrollTop } from "../../utils/scroll";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const stepperRef = useRef<Stepper | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(1);
  const { items } = useCart();
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<any>();
  const [freeShipping, setFreeShipping] = useState(false);

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
    const element = document.querySelector("#wizard-checkout");
    if (element) {
      stepperRef.current = new Stepper(element, {
        linear: false,
      });
    }
  }, []);

  const handleAddAddress = (
    newAddressData: Omit<Address, "id" | "isDefault">,
  ) => {
    const newAddress: Address = {
      ...newAddressData,
      id:
        addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1,
      isDefault: addresses.length === 0, // First address becomes default
    };

    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowAddressModal(false);
  };

  const handleRemoveAddress = (id: number) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);

    // If we're removing the selected address, select another one
    if (selectedAddressId === id) {
      const remainingDefault = updatedAddresses.find((a) => a.isDefault);
      setSelectedAddressId(
        remainingDefault
          ? remainingDefault.id
          : updatedAddresses.length > 0
            ? updatedAddresses[0].id
            : undefined,
      );
    }

    setAddresses(updatedAddresses);
  };

  const handleEditAddress = (id: number) => {
    // For now, we'll just log. You can implement edit modal later
    console.log("Edit address:", id);
  };

  const handleSetDefaultAddress = (id: number) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));
    setAddresses(updatedAddresses);
    setSelectedAddressId(id);
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
                  onSelectAddress={setSelectedAddressId}
                  onRemoveAddress={handleRemoveAddress}
                  onEditAddress={handleEditAddress}
                  onSetDefaultAddress={handleSetDefaultAddress}
                  setDeliveryPrice={setDeliveryPrice}
                  setFinalPrice={setFinalPrice}
                  setSelectedDeliveryOption={setSelectedDeliveryOption}
                  setFreeShipping={setFreeShipping}
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
                  selectedDeliveryOption={selectedDeliveryOption}
                  freeShipping={freeShipping}
                  onComplete={() => {
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
