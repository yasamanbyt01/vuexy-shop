const API_URL = import.meta.env.VITE_API_URL;

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
}

export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export function getCategoryImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_URL}${imagePath}`;
}
