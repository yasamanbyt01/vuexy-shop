export interface CartItem {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image: string;
  inStock: boolean;
  seller: string;
  rating: number;
}
