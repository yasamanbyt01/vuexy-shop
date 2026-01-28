export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;

  price: string;
  originalPrice?: string;
  rating: number;
  reviewsCount: number;

  description: string;
  longDescription: string;
  features: string[];

  colors: {
    name: string;
    value: string;
    hex: string;
  }[];

  sizes: string[];
  images: string[];

  inStock: boolean;
  stockCount: number;

  tags: string[];
  specifications: Record<string, string | number>;

  shippingInfo: {
    freeOver: number;
    delivery: string;
    returns: string;
  };
}

export interface Review {
  id: number | string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
