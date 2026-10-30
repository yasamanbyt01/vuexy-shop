import type { AuthUser } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

interface ApiErrorResponse {
  message?: string | string[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
}

function getAdminApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join("، ");
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

async function authenticatedUserRequest<T>(
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
      ...options.headers,
    },
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getAdminApiErrorMessage(
        result,
        "در انجام عملیات مشتریان مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
      ),
    );
  }

  return result as T;
}

function normalizeAdminUser(value: unknown): AdminUser {
  if (typeof value !== "object" || value === null) {
    throw new Error("پاسخ اطلاعات مشتری از API معتبر نیست.");
  }

  const user = value as Record<string, unknown>;
  if (
    typeof user.id !== "number" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    (user.role !== "user" && user.role !== "admin")
  ) {
    throw new Error("پاسخ اطلاعات مشتری از API معتبر نیست.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function getAdminUsers(token: string): Promise<AdminUser[]> {
  const result = await authenticatedUserRequest<unknown>("/users", token);
  if (!Array.isArray(result)) {
    throw new Error("فهرست مشتریان دریافتی از API معتبر نیست.");
  }

  return result.map(normalizeAdminUser);
}

export async function createAdminUser(
  token: string,
  input: CreateAdminUserInput,
): Promise<AdminUser> {
  const result = await authenticatedUserRequest<unknown>("/users", token, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return normalizeAdminUser(result);
}

export async function getAdminUser(
  token: string,
  id: number,
): Promise<AdminUser> {
  const result = await authenticatedUserRequest<unknown>(`/users/${id}`, token);
  return normalizeAdminUser(result);
}

export async function updateAdminUser(
  token: string,
  id: number,
  input: Pick<AdminUser, "name" | "email">,
): Promise<AdminUser> {
  const result = await authenticatedUserRequest<unknown>(
    `/users/${id}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  return normalizeAdminUser(result);
}

function getErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return "در ذخیره اطلاعات حساب مشکلی پیش آمد. لطفاً دوباره تلاش کنید.";
}

export async function updateMyProfile(
  input: { name: string; email: string },
  token: string,
): Promise<AuthUser> {
  if (!API_URL) {
    throw new Error("VITE_API_URL تنظیم نشده است.");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  if (
    typeof result !== "object" ||
    result === null ||
    typeof (result as AuthUser).id !== "number" ||
    typeof (result as AuthUser).name !== "string" ||
    typeof (result as AuthUser).email !== "string" ||
    !["user", "admin"].includes((result as AuthUser).role)
  ) {
    throw new Error("پاسخ اطلاعات کاربر از API معتبر نیست.");
  }

  return result as AuthUser;
}
