import type { Address } from "../types/address";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export type AddressInput = Omit<Address, "id" | "isDefault">;

interface ApiErrorResponse {
  message?: string | string[];
}

function getErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return "در ارتباط با سرور مشکلی پیش آمد. لطفاً دوباره تلاش کنید.";
}

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL تنظیم نشده است. آدرس API را در فایل .env بررسی کنید.",
    );
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
    throw new Error(getErrorMessage(result));
  }

  return result as T;
}

export function getAddresses(token: string): Promise<Address[]> {
  return request<Address[]>("/addresses", token);
}

export function createAddress(
  address: AddressInput,
  token: string,
): Promise<Address> {
  const payload = {
    ...address,
    addressLine2: address.addressLine2?.trim() || undefined,
  };

  return request<Address>("/addresses", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAddress(
  id: number,
  address: Partial<AddressInput>,
  token: string,
): Promise<Address> {
  const payload = {
    ...address,
    // Sending an empty string lets the backend clear an existing line 2.
    ...(address.addressLine2 !== undefined
      ? { addressLine2: address.addressLine2.trim() }
      : {}),
  };

  return request<Address>(`/addresses/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function setDefaultAddress(id: number, token: string): Promise<Address> {
  return request<Address>(`/addresses/${id}/default`, token, {
    method: "PATCH",
  });
}

export function deleteAddress(
  id: number,
  token: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(`/addresses/${id}`, token, {
    method: "DELETE",
  });
}
