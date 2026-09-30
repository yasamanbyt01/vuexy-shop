const API_URL = import.meta.env.VITE_API_URL;

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
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

  return response.json();
}
