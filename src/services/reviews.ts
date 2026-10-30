import type { AdminReview, Review, ReviewStatus } from "../types/reviews";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export interface GetReviewsParams {
  productId?: number;
}

export interface CreateReviewInput {
  productId: number;
  rating: number;
  comment: string;
}

interface ApiErrorResponse {
  message?: string | string[];
}

type ApiReview = {
  id?: string;
  _id?: string;
  productId: number;
  productName?: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  status?: ReviewStatus;
  createdAt?: string;
  updatedAt?: string;
};

function getApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join("، ");
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

function normalizeReview(review: ApiReview): Review {
  const id = review.id ?? review._id;
  if (!id) throw new Error("پاسخ نظر دریافتی از API معتبر نیست.");

  return {
    id,
    productId: Number(review.productId),
    userId: Number(review.userId),
    userName: review.userName ?? "کاربر",
    rating: Number(review.rating),
    comment: review.comment ?? "",
    // Older review documents have no status and are treated as approved.
    status: review.status ?? "approved",
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

async function authenticatedReviewRequest<T>(
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
      getApiErrorMessage(result, "در انجام عملیات نظرات مشکلی پیش آمد."),
    );
  }
  return result as T;
}

export const getReviews = async (
  params: GetReviewsParams = {},
): Promise<Review[]> => {
  if (!API_URL) throw new Error("VITE_API_URL تنظیم نشده است.");
  const query = new URLSearchParams();
  if (params.productId !== undefined)
    query.set("productId", String(params.productId));

  const queryString = query.toString();
  const response = await fetch(
    `${API_URL}/reviews${queryString ? `?${queryString}` : ""}`,
  );
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(getApiErrorMessage(result, "دریافت نظرات ناموفق بود."));
  }
  if (!Array.isArray(result))
    throw new Error("فهرست نظرات دریافتی از API معتبر نیست.");
  return (result as ApiReview[]).map(normalizeReview);
};

export const createReview = async (
  input: CreateReviewInput,
  token: string,
): Promise<void> => {
  await authenticatedReviewRequest<unknown>("/reviews", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
};

export async function getAdminReviews(token: string): Promise<AdminReview[]> {
  const result = await authenticatedReviewRequest<unknown>(
    "/reviews/admin",
    token,
  );
  if (!Array.isArray(result))
    throw new Error("فهرست نظرات دریافتی از API معتبر نیست.");

  return (result as ApiReview[]).map((item) => {
    const normalized = normalizeReview(item);
    if (!item.productName) {
      throw new Error("نام محصول در پاسخ فهرست نظرات وجود ندارد.");
    }
    return {
      ...normalized,
      productName: item.productName,
      status: item.status ?? "approved",
    };
  });
}

export async function updateAdminReviewStatus(
  token: string,
  id: string,
  status: ReviewStatus,
): Promise<void> {
  await authenticatedReviewRequest<unknown>(
    `/reviews/admin/${encodeURIComponent(id)}/status`,
    token,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

export async function deleteAdminReview(
  token: string,
  id: string,
): Promise<void> {
  await authenticatedReviewRequest<unknown>(
    `/reviews/${encodeURIComponent(id)}`,
    token,
    { method: "DELETE" },
  );
}
