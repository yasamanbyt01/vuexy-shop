import type { Review } from "../types/reviews";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export interface GetReviewsParams {
  productId?: number;
}

export interface CreateReviewInput {
  productId: number;
  rating: number;
  comment: string;
}

interface ApiReview {
  _id: string;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  userName: string;
}

export const getReviews = async (
  params: GetReviewsParams = {},
): Promise<Review[]> => {
  const query = new URLSearchParams();

  if (params.productId !== undefined) {
    query.set("productId", String(params.productId));
  }

  const queryString = query.toString();

  const response = await fetch(
    `${API_URL}/reviews${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const data: ApiReview[] = await response.json();

  return data.map((review) => ({
    id: review._id,
    productId: review.productId,
    userId: review.userId,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }));
};

interface ApiErrorResponse {
  message?: string | string[];
}

function getCreateReviewErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;
    if (Array.isArray(message)) return message.join("، ");
    if (typeof message === "string") return message;
  }

  return "ثبت نظر با مشکل مواجه شد. لطفاً دوباره تلاش کنید.";
}

export const createReview = async (
  input: CreateReviewInput,
  token: string,
): Promise<void> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL تنظیم نشده است.");
  }

  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getCreateReviewErrorMessage(result));
  }
};
