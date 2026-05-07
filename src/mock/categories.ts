import { products } from "./products";
import type { Category, Subcategory } from "../types/category";
import { CATEGORY_LABELS } from "../constants/catergoryLabels";

const categoryImages: Record<string, string> = {
  clothing: "/assets/img/categories/clothing.jpg",
  shoes: "/assets/img/categories/shoes.jpg",
  bags: "/assets/img/categories/bags.jpg",
  electronics: "/assets/img/categories/electronics.jpg",
  accessories: "/assets/img/categories/accessories.jpg",
  home: "/assets/img/categories/home.jpg",
};

const categoryIcons: Record<string, string> = {
  electronics: "tabler-device-mobile",
  clothing: "tabler-shirt",
  shoes: "tabler-shoe",
  bags: "tabler-shopping-bag",
  accessories: "tabler-diamond",
  home: "tabler-home",
};

const DEFAULT_CATEGORY_IMAGE = "/assets/img/categories/default.jpg";

export const categories: Category[] = Array.from(
  new Map(
    products.map((product) => {
      const categoryProducts = products.filter(
        (p) => p.category === product.category,
      );

      const subMap = new Map<string, Subcategory>();

      categoryProducts.forEach((p) => {
        const sub = p.tags?.[0] ?? "سایر";

        if (!subMap.has(sub)) {
          subMap.set(sub, {
            slug: sub,
            title: sub,
            productCount: categoryProducts.filter((sp) => sp.tags?.[0] === sub)
              .length,
          });
        }
      });

      return [
        product.category,
        {
          id: product.category,
          slug: product.category,
          title: CATEGORY_LABELS[product.category],
          productCount: categoryProducts.length,
          image: categoryImages[product.category] ?? DEFAULT_CATEGORY_IMAGE,
          icon: categoryIcons[product.category] ?? "tabler-category",
          subcategories: Array.from(subMap.values()),
        },
      ];
    }),
  ).values(),
);
