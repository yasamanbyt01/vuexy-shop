import { getProductImageUrl } from "./products";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  stockCount: number;
  inStock: boolean;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

interface ApiErrorResponse {
  message?: string | string[];
}

function getErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return "در مدیریت علاقه‌مندی‌ها مشکلی پیش آمد. لطفاً دوباره تلاش کنید.";
}

async function request<T>(
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
    throw new Error(getErrorMessage(result));
  }

  return result as T;
}

function normalizeFavorite(value: FavoriteProduct): FavoriteProduct {
  return {
    ...value,
    images: (value.images ?? []).map((imagePath) =>
      getProductImageUrl(
        imagePath.startsWith("http")
          ? imagePath
          : imagePath.startsWith("/")
            ? imagePath
            : `/${imagePath}`,
      ),
    ),
  };
}

export async function getFavorites(token: string): Promise<FavoriteProduct[]> {
  const result = await request<FavoriteProduct[]>("/favorites", token);
  if (!Array.isArray(result)) {
    throw new Error("پاسخ فهرست علاقه‌مندی‌ها از API معتبر نیست.");
  }
  return result.map(normalizeFavorite);
}

export async function addFavorite(
  productId: number,
  token: string,
): Promise<FavoriteProduct> {
  const result = await request<FavoriteProduct>(
    `/favorites/${productId}`,
    token,
    { method: "POST" },
  );
  return normalizeFavorite(result);
}

export function removeFavorite(
  productId: number,
  token: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(`/favorites/${productId}`, token, {
    method: "DELETE",
  });
}
