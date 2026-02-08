export interface CartItem {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image: string;
  inStock: boolean;
  seller: string;
  rating: number;
}

export interface Address {
  id: number;
  name: string;
  type: "home" | "office";
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type PaymentMethod = "card" | "cod" | "giftCard";

export interface OrderSummary {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface CheckoutFormData {
  items: CartItem[];
  selectedAddressId?: number;
  paymentMethod: PaymentMethod;
  deliverySpeed: "standard" | "express" | "overnight";
  promoCode?: string;
  giftWrap: boolean;
}
