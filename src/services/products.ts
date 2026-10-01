const API_URL = import.meta.env.VITE_API_URL;

export interface ApiProduct {
  id: number;
  name: string;
  sku: string;

  price: number;
  originalPrice: number | null;
  rating: number;

  description: string;
  longDescription: string;

  stockCount: number;
  inStock: boolean;

  seller: string;

  features: string[];

  colors: {
    name: string;
    value: string;
    hex: string;
  }[];

  sizes: string[];
  images: string[];
  tags: string[];

  specifications: Record<string, string | number>;

  shippingInfo: {
    freeOver: number;
    delivery: string;
    returns: string;
  };

  category: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductsResponse {
  data: ApiProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetProductsParams {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.categoryId !== undefined) {
    query.set("categoryId", String(params.categoryId));
  }

  if (params.minPrice !== undefined) {
    query.set("minPrice", String(params.minPrice));
  }

  if (params.maxPrice !== undefined) {
    query.set("maxPrice", String(params.maxPrice));
  }

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 8));

  const response = await fetch(`${API_URL}/products?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result: ProductsResponse = await response.json();

  return {
    ...result,
    data: result.data.map((product) => ({
      ...product,
      images: product.images.map(getProductImageUrl),
    })),
  };
}

export function getProductImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_URL}${imagePath}`;
}

export async function getProductById(id: number): Promise<ApiProduct> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const product: ApiProduct = await response.json();

  return {
    ...product,
    images: product.images.map(getProductImageUrl),
  };
}
