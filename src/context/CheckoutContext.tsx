import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { PaymentMethod } from "../types/payment";
import type { DeliveryOption } from "../types/delivery";

// =======================
// Types
// =======================

export interface CheckoutState {
  selectedAddressId?: number;
  deliveryOption?: DeliveryOption;
  deliveryPrice: number;
  paymentMethod?: PaymentMethod;
  finalPrice: number;
  freeShipping: boolean;
}

export type CheckoutAction =
  | { type: "SET_SELECTED_ADDRESS"; payload: number | undefined }
  | { type: "SET_DELIVERY_OPTION"; payload: DeliveryOption | undefined }
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod | undefined }
  | { type: "SET_DELIVERY_PRICE"; payload: number }
  | { type: "SET_FINAL_PRICE"; payload: number }
  | { type: "SET_FREE_SHIPPING"; payload: boolean }
  | { type: "RESET_CHECKOUT" };

// =======================
// Initial State
// =======================

const initialCheckoutState: CheckoutState = {
  selectedAddressId: undefined,
  deliveryOption: undefined,
  deliveryPrice: 0,
  finalPrice: 0,
  paymentMethod: undefined,
  freeShipping: false,
};

// =======================
//
// =======================

const CHECKOUT_STORAGE_KEY = "checkout_state";

function loadPersistedCheckoutState(): CheckoutState {
  try {
    const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);

    if (!stored) {
      return initialCheckoutState;
    }

    return {
      ...initialCheckoutState,
      ...JSON.parse(stored),
    };
  } catch (error) {
    console.error("Failed to load checkout state:", error);
    return initialCheckoutState;
  }
}

// =======================
// Reducer
// =======================

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction,
): CheckoutState {
  switch (action.type) {
    case "SET_SELECTED_ADDRESS":
      return { ...state, selectedAddressId: action.payload };

    case "SET_DELIVERY_OPTION":
      return { ...state, deliveryOption: action.payload };

    case "SET_DELIVERY_PRICE":
      return { ...state, deliveryPrice: action.payload };

    case "SET_FINAL_PRICE":
      return { ...state, finalPrice: action.payload };

    case "SET_FREE_SHIPPING":
      return { ...state, freeShipping: action.payload };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };

    case "RESET_CHECKOUT":
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      return initialCheckoutState;

    default:
      return state;
  }
}

// =======================
// Context Setup
// =======================

interface CheckoutContextValue {
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

// =======================
// Provider
// =======================

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    checkoutReducer,
    undefined,
    loadPersistedCheckoutState,
  );
  useEffect(() => {
    try {
      const persistedState = {
        selectedAddressId: state.selectedAddressId,
        deliveryOption: state.deliveryOption,
        deliveryPrice: state.deliveryPrice,
        paymentMethod: state.paymentMethod,
        finalPrice: state.finalPrice,
        freeShipping: state.freeShipping,
      };

      localStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify(persistedState),
      );
    } catch (error) {
      console.error("Failed to persist checkout state:", error);
    }
  }, [state]);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
};

// =======================
// Hook
// =======================

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside <CheckoutProvider>");
  }
  return context;
};
