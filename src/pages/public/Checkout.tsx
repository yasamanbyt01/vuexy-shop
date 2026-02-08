import Stepper from "bs-stepper";
import { useEffect, useRef } from "react";
import CartStep from "../../components/Checkout/CartStep";
import AddressStep from "../../components/Checkout/AddressStep";
import PaymentStep from "../../components/Checkout/PaymentStep";
import ConfirmationStep from "../../components/Checkout/ConfirmationStep";

const Checkout = () => {
  const stepperRef = useRef<Stepper | null>(null);

  useEffect(() => {
    const element = document.querySelector("#wizard-checkout");
    if (element) {
      stepperRef.current = new Stepper(element, {
        linear: false,
      });
    }
  }, []);
  return (
    <section className="section-py bg-body first-section-pt">
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
                onPrev={() => stepperRef.current?.previous()}
                onNext={() => stepperRef.current?.next()}
                onShowAddressModal={() => {
                  // TODO: implement modal if needed
                  console.log("Show address modal");
                }}
              />

              {/* Payment */}
              <PaymentStep
                onPrev={() => stepperRef.current?.previous()}
                onNext={() => stepperRef.current?.next()}
              />

              {/* Confirmation */}
              <ConfirmationStep
                onComplete={() => {
                  // You can do additional actions here if needed, like redirecting to home
                  console.log("Order completed!");
                }}
              />
            </form>
          </div>
        </div>
        {/* /Checkout Wizard */}
      </div>
    </section>
  );
};

export default Checkout;
