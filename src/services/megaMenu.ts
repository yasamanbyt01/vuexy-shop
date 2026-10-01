import { getCategories, type ApiCategory } from "./categories";
import { getProducts, type ApiProduct } from "./products";

export interface MegaSubcategory {
  slug: string;
  title: string;
  productCount: number;
}

export interface MegaMenuCategory extends ApiCategory {
  productCount: number;
  subcategories: MegaSubcategory[];
}

export async function getMegaMenuCategories(): Promise<MegaMenuCategory[]> {
  const [categories, productsResponse] = await Promise.all([
    getCategories(),
    getProducts({
      page: 1,
      limit: 100,
    }),
  ]);

  const products = productsResponse.data;

  return categories.map((category) => {
    const categoryProducts = products.filter(
      (product) => product.category?.slug === category.slug,
    );

    const subcategoryMap = new Map<string, MegaSubcategory>();

    categoryProducts.forEach((product: ApiProduct) => {
      const tag = product.tags?.[0];

      if (!tag) return;

      const existing = subcategoryMap.get(tag);

      if (existing) {
        existing.productCount += 1;
      } else {
        subcategoryMap.set(tag, {
          slug: tag,
          title: tag,
          productCount: 1,
        });
      }
    });

    return {
      ...category,
      productCount: categoryProducts.length,
      subcategories: Array.from(subcategoryMap.values()),
    };
  });
}
