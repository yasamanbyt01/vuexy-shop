import Stepper from "bs-stepper";
import { useEffect, useRef } from "react";
import CartStep from "../../components/Checkout/CartStep";

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
              <div id="checkout-address" className="content">
                <h5>Address Step</h5>
                <p className="text-muted">Static address step placeholder.</p>
                <button
                  type="button"
                  className="btn btn-label-secondary me-2"
                  onClick={() => stepperRef.current?.previous()}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-next"
                  onClick={() => stepperRef.current?.next()}
                >
                  Continue
                </button>
              </div>

              {/* Payment */}
              <div id="checkout-payment" className="content">
                <h5>Payment Step</h5>
                <p className="text-muted">Static payment step placeholder.</p>

                <button
                  type="button"
                  className="btn btn-primary btn-next"
                  onClick={() => stepperRef.current?.next()}
                >
                  Continue
                </button>
              </div>

              {/* Confirmation */}
              <div id="checkout-confirmation" className="content">
                <h4>Thank You! 😇</h4>
                <p>Your order has been placed.</p>
              </div>
            </form>
          </div>
        </div>
        {/* /Checkout Wizard */}
      </div>
    </section>
  );
};

export default Checkout;
