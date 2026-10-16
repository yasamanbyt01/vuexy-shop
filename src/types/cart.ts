export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  /** @deprecated Legacy localStorage field; this actually stored the original price. */
  discountedPrice?: number;
  quantity: number;
  image: string;
  inStock: boolean;
  seller: string;
  rating: number;
}
