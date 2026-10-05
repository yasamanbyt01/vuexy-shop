import type { Review } from "../types/reviews";

const API_URL = import.meta.env.VITE_API_URL;

export interface GetReviewsParams {
  productId?: number;
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
