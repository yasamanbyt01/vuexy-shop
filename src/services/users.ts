import type { AuthUser } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

interface ApiErrorResponse {
  message?: string | string[];
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
