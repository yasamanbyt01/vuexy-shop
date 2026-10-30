export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  status?: ReviewStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminReview extends Review {
  productName: string;
  status: ReviewStatus;
}
