import Stepper from "bs-stepper";
import { useEffect, useRef, useState } from "react";
import CartStep from "../../components/Checkout/CartStep";
import AddressStep from "../../components/Checkout/AddressStep";
import PaymentStep from "../../components/Checkout/PaymentStep";
import ConfirmationStep from "../../components/Checkout/ConfirmationStep";
import AddAddressModal from "../../components/Checkout/AddAddressModal";
import type { Address } from "../../types/Cart";

const Checkout = () => {
  const stepperRef = useRef<Stepper | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "John Doe (Default)",
      type: "home",
      addressLine1: "4135 Parkway Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90017",
      country: "United States",
      phone: "+1 234 567 8900",
      isDefault: true,
    },
    {
      id: 2,
      name: "ACME Inc.",
      type: "office",
      addressLine1: "87 Hoffman Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10016",
      country: "United States",
      phone: "+1 234 567 8901",
      isDefault: false,
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(1);

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
                  <span className="bs-stepper-label">Cart</span>
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
                  <span className="bs-stepper-label">Address</span>
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
                  <span className="bs-stepper-label">Payment</span>
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
                  <span className="bs-stepper-label">Confirmation</span>
                </button>
              </div>
            </div>

            {/* Stepper Content */}
            <div className="bs-stepper-content border-top">
              <form>
                {/* Cart */}
                <CartStep onNext={() => stepperRef.current?.next()} />

                {/* Address */}
                <AddressStep
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                  onRemoveAddress={handleRemoveAddress}
                  onEditAddress={handleEditAddress}
                  onSetDefaultAddress={handleSetDefaultAddress}
                  onPrev={() => stepperRef.current?.previous()}
                  onNext={() => stepperRef.current?.next()}
                  onShowAddressModal={() => setShowAddressModal(true)}
                />

                {/* Payment */}
                <PaymentStep
                  selectedAddress={addresses.find(
                    (a) => a.id === selectedAddressId,
                  )}
                  onPrev={() => stepperRef.current?.previous()}
                  onNext={() => stepperRef.current?.next()}
                />

                {/* Confirmation */}
                <ConfirmationStep
                  selectedAddress={addresses.find(
                    (a) => a.id === selectedAddressId,
                  )}
                  onComplete={() => {
                    console.log("Order completed!");
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
