import type { Review } from "../types/reviews";

export const mockReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    name: "John Doe",
    rating: 5,
    comment:
      "Great product! Fits perfectly and the material is very comfortable.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: 2,
    productId: 1,
    name: "Jane Smith",
    rating: 4,
    comment:
      "Good quality, but the color is slightly different than shown in the photos.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: 3,
    productId: 1,
    name: "Robert Johnson",
    rating: 5,
    comment:
      "Exactly what I was looking for. The fit is perfect and it washes well.",
    date: "2024-01-05",
    verified: false,
  },
];
