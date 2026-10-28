const API_URL = import.meta.env.VITE_API_URL;

export interface ProductColor {
  name: string;
  value: string;
  hex: string;
}

export interface ProductShippingInfo {
  freeOver: number;
  delivery: string;
  returns: string;
}

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
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  tags: string[];
  specifications: Record<string, string | number>;
  shippingInfo: ProductShippingInfo;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductWritePayload {
  name: string;
  sku: string;
  price: number;
  originalPrice?: number | null;
  rating?: number;
  description: string;
  longDescription: string;
  stockCount: number;
  seller: string;
  features: string[];
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  tags: string[];
  specifications: Record<string, string | number>;
  shippingInfo: ProductShippingInfo;
  categoryId: number;
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
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

function getApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (Array.isArray(message))
      return message
        .filter((part): part is string => typeof part === "string")
        .join("، ");
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

async function authenticatedProductRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) throw new Error("VITE_API_URL تنظیم نشده است.");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(result, "در انجام عملیات محصول مشکلی پیش آمد."),
    );
  }
  return result as T;
}

function normalizeProduct(product: ApiProduct): ApiProduct {
  return {
    ...product,
    images: (product.images ?? []).map(getProductImageUrl),
  };
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductsResponse> {
  if (!API_URL) throw new Error("VITE_API_URL تنظیم نشده است.");
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.categoryId !== undefined)
    query.set("categoryId", String(params.categoryId));
  if (params.tag) query.set("tag", params.tag);
  if (params.minPrice !== undefined)
    query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined)
    query.set("maxPrice", String(params.maxPrice));
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 8));

  const response = await fetch(`${API_URL}/products?${query.toString()}`);
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(getApiErrorMessage(result, "دریافت محصولات ناموفق بود."));

  const parsed = result as ProductsResponse;
  return { ...parsed, data: parsed.data.map(normalizeProduct) };
}

export function getProductImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export async function getProductById(id: number): Promise<ApiProduct> {
  if (!API_URL) throw new Error("VITE_API_URL تنظیم نشده است.");
  const response = await fetch(`${API_URL}/products/${id}`);
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(getApiErrorMessage(result, "دریافت محصول ناموفق بود."));
  return normalizeProduct(result as ApiProduct);
}

export async function createProduct(
  token: string,
  payload: ProductWritePayload,
): Promise<ApiProduct> {
  const product = await authenticatedProductRequest<ApiProduct>(
    "/products",
    token,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return normalizeProduct(product);
}

export async function updateProduct(
  token: string,
  id: number,
  payload: ProductWritePayload,
): Promise<ApiProduct> {
  const product = await authenticatedProductRequest<ApiProduct>(
    `/products/${id}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return normalizeProduct(product);
}

export async function deleteProduct(
  token: string,
  id: number,
): Promise<{ message: string }> {
  return authenticatedProductRequest<{ message: string }>(
    `/products/${id}`,
    token,
    {
      method: "DELETE",
    },
  );
}
