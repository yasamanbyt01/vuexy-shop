export interface Review {
  id: number | string;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
