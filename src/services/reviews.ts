import type { Review } from "../types/reviews";

const API_URL = import.meta.env.VITE_API_URL;

export interface GetReviewsParams {
  productId?: number;
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

  return response.json();
};
