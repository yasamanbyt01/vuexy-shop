export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;

  price: number;
  originalPrice?: number;
  rating: number;

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

  seller: string;

  tags: string[];
  specifications: Record<string, string | number>;

  shippingInfo: {
    freeOver: number;
    delivery: string;
    returns: string;
  };
}
