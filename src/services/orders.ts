import type { PaymentMethod } from "../types/payment";
import { getProductImageUrl } from "./products";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateShippingAddressInput {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItemInput[];
  shippingAddress: CreateShippingAddressInput;
  deliveryOption: "standard" | "express";
  paymentMethod: PaymentMethod;
}

export interface CreatedOrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string | null;
  unitPrice: number;
  originalPrice?: number | null;
  quantity: number;
  lineTotal: number;
}

// The current API DTO accepts shippingAddress as a nested object. The service
// normalizes either nested or flattened response fields into this view model,
// so the confirmation component doesn't have to know the entity's shape.
export interface CreatedOrder {
  id: number;
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status: string;
  customerName?: string;
  customerEmail?: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  deliveryOption: "standard" | "express";
  paymentMethod: PaymentMethod;
  createdAt?: string;
  items: CreatedOrderItem[];
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface UserOrder {
  id: number;
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  deliveryOption: "standard" | "express" | null;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
  items: CreatedOrderItem[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ApiErrorResponse {
  message?: string | string[];
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(
  data: unknown,
  fallback = "ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
): string {
  if (isRecord(data) && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return fallback;
}

function stringField(
  record: UnknownRecord,
  key: string,
  fallback: string,
): string {
  return typeof record[key] === "string" ? (record[key] as string) : fallback;
}

function numberField(record: UnknownRecord, key: string): number | undefined {
  return typeof record[key] === "number" ? (record[key] as number) : undefined;
}

export async function createOrder(
  payload: CreateOrderPayload,
  token: string,
): Promise<CreatedOrder> {
  if (!API_URL) {
    throw new Error("VITE_API_URL تنظیم نشده است.");
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  if (!isRecord(result)) {
    throw new Error(
      "پاسخ سفارش از API معتبر نیست. سبد خرید پاک نشد؛ پاسخ API را بررسی کنید.",
    );
  }

  const id = numberField(result, "id");
  const subtotal = numberField(result, "subtotal");
  const deliveryPrice = numberField(result, "deliveryPrice");
  const total = numberField(result, "total");
  const rawItems = result.items;

  const hasSavedItemDetails =
    Array.isArray(rawItems) &&
    rawItems.length > 0 &&
    rawItems.length === payload.items.length &&
    rawItems.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === "number" &&
        typeof item.productId === "number" &&
        typeof item.productName === "string" &&
        typeof item.unitPrice === "number" &&
        typeof item.quantity === "number" &&
        typeof item.lineTotal === "number",
    );

  if (
    id === undefined ||
    subtotal === undefined ||
    deliveryPrice === undefined ||
    total === undefined ||
    !hasSavedItemDetails
  ) {
    throw new Error(
      "پاسخ سفارش از API کامل نیست. سبد خرید پاک نشد؛ قرارداد پاسخ API را بررسی کنید.",
    );
  }

  const nestedAddress = isRecord(result.shippingAddress)
    ? result.shippingAddress
    : {};
  const user = isRecord(result.user) ? result.user : {};
  const customerName =
    typeof result.customerName === "string"
      ? result.customerName
      : typeof user.name === "string"
        ? user.name
        : undefined;
  const customerEmail =
    typeof result.customerEmail === "string"
      ? result.customerEmail
      : typeof user.email === "string"
        ? user.email
        : undefined;

  const validDeliveryOption =
    result.deliveryOption === "standard" || result.deliveryOption === "express"
      ? result.deliveryOption
      : payload.deliveryOption;
  const validPaymentMethod =
    result.paymentMethod === "card" ||
    result.paymentMethod === "cod" ||
    result.paymentMethod === "giftCard"
      ? result.paymentMethod
      : payload.paymentMethod;

  const items = (rawItems as CreatedOrderItem[]).map((item) => {
    const imagePath = item.productImage;

    return {
      ...item,
      productImage: imagePath
        ? getProductImageUrl(
            imagePath.startsWith("http")
              ? imagePath
              : imagePath.startsWith("/")
                ? imagePath
                : `/${imagePath}`,
          )
        : imagePath,
    };
  });

  return {
    id,
    subtotal,
    deliveryPrice,
    total,
    status: stringField(result, "status", "pending"),
    customerName,
    customerEmail,
    shippingName: stringField(
      result,
      "shippingName",
      stringField(nestedAddress, "name", payload.shippingAddress.name),
    ),
    shippingPhone: stringField(
      result,
      "shippingPhone",
      stringField(nestedAddress, "phone", payload.shippingAddress.phone),
    ),
    shippingAddressLine1: stringField(
      result,
      "shippingAddressLine1",
      stringField(
        nestedAddress,
        "addressLine1",
        payload.shippingAddress.addressLine1,
      ),
    ),
    shippingAddressLine2: stringField(
      result,
      "shippingAddressLine2",
      stringField(
        nestedAddress,
        "addressLine2",
        payload.shippingAddress.addressLine2 ?? "",
      ),
    ),
    shippingCity: stringField(
      result,
      "shippingCity",
      stringField(nestedAddress, "city", payload.shippingAddress.city),
    ),
    shippingState: stringField(
      result,
      "shippingState",
      stringField(nestedAddress, "state", payload.shippingAddress.state),
    ),
    shippingZipCode: stringField(
      result,
      "shippingZipCode",
      stringField(nestedAddress, "zipCode", payload.shippingAddress.zipCode),
    ),
    deliveryOption: validDeliveryOption,
    paymentMethod: validPaymentMethod,
    createdAt:
      typeof result.createdAt === "string" ? result.createdAt : undefined,
    items,
  };
}

async function requestOrdersApi<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("VITE_API_URL تنظیم نشده است.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        result,
        "در دریافت یا به‌روزرسانی سفارش مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
      ),
    );
  }

  return result as T;
}

function normalizeUserOrder(value: unknown): UserOrder {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("پاسخ سفارش از API معتبر نیست.");
  }

  const order = value as unknown as UserOrder;
  const items = order.items.map((item) => {
    const imagePath = item.productImage;

    return {
      ...item,
      productImage:
        typeof imagePath === "string" && imagePath.length > 0
          ? getProductImageUrl(
              imagePath.startsWith("http")
                ? imagePath
                : imagePath.startsWith("/")
                  ? imagePath
                  : `/${imagePath}`,
            )
          : imagePath,
    };
  });

  return { ...order, items };
}

export async function getMyOrders(token: string): Promise<UserOrder[]> {
  const result = await requestOrdersApi<unknown>("/orders/mine", token);

  if (!Array.isArray(result)) {
    throw new Error("پاسخ فهرست سفارش‌ها از API معتبر نیست.");
  }

  return result.map(normalizeUserOrder);
}

export async function cancelOrder(
  orderId: number,
  token: string,
): Promise<UserOrder> {
  const result = await requestOrdersApi<unknown>(
    `/orders/${orderId}/cancel`,
    token,
    { method: "PATCH" },
  );

  return normalizeUserOrder(result);
}
