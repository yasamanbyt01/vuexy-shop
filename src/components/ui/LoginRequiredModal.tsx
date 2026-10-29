import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { CartItem } from "../../types/cart";

interface LoginRequiredModalProps {
  show: boolean;
  onClose: () => void;
  pendingCartItem?: CartItem | null;
  intent?: "cart" | "favorite" | "review";
}

const TRANSITION_DURATION = 150;

const LoginRequiredModal = ({
  show,
  onClose,
  pendingCartItem,
  intent = "cart",
}: LoginRequiredModalProps) => {
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(show);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let firstFrame: number | undefined;
    let secondFrame: number | undefined;
    let hideTimeout: number | undefined;

    if (show) {
      // Mount the modal before starting the animation.
      setIsMounted(true);

      // Allow the initial CSS state to render before showing it.
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      // Start the closing animation.
      setIsVisible(false);

      // Keep the modal mounted until the animation finishes.
      hideTimeout = window.setTimeout(() => {
        setIsMounted(false);
      }, TRANSITION_DURATION);
    }

    return () => {
      if (firstFrame !== undefined) {
        window.cancelAnimationFrame(firstFrame);
      }

      if (secondFrame !== undefined) {
        window.cancelAnimationFrame(secondFrame);
      }

      if (hideTimeout !== undefined) {
        window.clearTimeout(hideTimeout);
      }
    };
  }, [show]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`modal fade d-block login-required-modal ${
        isVisible ? "show" : ""
      }`}
      tabIndex={-1}
      role="dialog"
      aria-modal={isVisible}
      aria-hidden={!isVisible}
      aria-labelledby="loginRequiredModalTitle"
      onClick={onClose}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-sm"
        role="document"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-content position-relative">
          <button
            type="button"
            className="btn-close position-absolute top-0 start-0 m-3 z-1"
            onClick={onClose}
            aria-label="بستن"
          />
          <div className="modal-body text-center p-6">
            <div className="mb-4">
              <i className="icon-base ti tabler-lock fs-1 text-primary" />
            </div>

            <h5 id="loginRequiredModalTitle" className="mb-2">
              ورود به حساب کاربری
            </h5>

            <p className="text-body-secondary mb-5">
              {intent === "favorite"
                ? "برای افزودن محصول به علاقه‌مندی‌ها، ابتدا وارد حساب کاربری خود شوید."
                : intent === "review"
                  ? "برای ثبت نظر درباره این محصول، ابتدا وارد حساب کاربری خود شوید."
                  : "برای افزودن محصول به سبد خرید، ابتدا وارد حساب کاربری خود شوید."}
            </p>

            <div className="d-flex flex-column gap-2">
              <Link
                to="/login"
                state={
                  pendingCartItem
                    ? { pendingCartItem }
                    : {
                        from: {
                          pathname: location.pathname,
                          search: location.search,
                          hash: location.hash,
                        },
                      }
                }
                className="btn btn-primary"
                onClick={onClose}
              >
                ورود به حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
