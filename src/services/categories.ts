const API_URL = import.meta.env.VITE_API_URL;

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
}

export type CategoryWritePayload = Pick<
  ApiCategory,
  "name" | "slug" | "image" | "icon"
>;

function getApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (Array.isArray(message))
      return message
        .filter((part): part is string => typeof part === "string")
        .join("، ");
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

async function authenticatedCategoryRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) throw new Error("VITE_API_URL تنظیم نشده است.");
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
      getApiErrorMessage(result, "در انجام عملیات دسته‌بندی مشکلی پیش آمد."),
    );
  }
  return result as T;
}

export async function getCategories(): Promise<ApiCategory[]> {
  if (!API_URL) throw new Error("VITE_API_URL تنظیم نشده است.");
  const response = await fetch(`${API_URL}/categories`);
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      getApiErrorMessage(result, "دریافت دسته‌بندی‌ها ناموفق بود."),
    );
  if (!Array.isArray(result))
    throw new Error("پاسخ دسته‌بندی‌ها از API معتبر نیست.");
  return result as ApiCategory[];
}

export function getCategoryImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export async function createCategory(
  token: string,
  payload: CategoryWritePayload,
): Promise<ApiCategory> {
  return authenticatedCategoryRequest<ApiCategory>("/categories", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  token: string,
  id: number,
  payload: CategoryWritePayload,
): Promise<ApiCategory> {
  return authenticatedCategoryRequest<ApiCategory>(`/categories/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(
  token: string,
  id: number,
): Promise<{ message: string }> {
  return authenticatedCategoryRequest<{ message: string }>(
    `/categories/${id}`,
    token,
    {
      method: "DELETE",
    },
  );
}
