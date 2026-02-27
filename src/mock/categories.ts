import { products } from "./products";
import type { Category } from "../types/category";
import { CATEGORY_LABELS } from "../constants/catergoryLabels";

const categoryImages: Record<string, string> = {
  clothing: "/assets/img/categories/clothing.jpg",
  shoes: "/assets/img/categories/shoes.jpg",
  bags: "/assets/img/categories/bags.jpg",
  electronics: "/assets/img/categories/electronics.jpg",
  accessories: "/assets/img/categories/accessories.jpg",
  home: "/assets/img/categories/home.jpg",
};

const DEFAULT_CATEGORY_IMAGE = "/assets/img/categories/default.jpg";

export const categories: Category[] = Array.from(
  new Map(
    products.map((product) => [
      product.category, // ← slug
      {
        id: product.category,
        slug: product.category, // ← مستقیم، بدون replace
        title: CATEGORY_LABELS[product.category],
        productCount: products.filter((p) => p.category === product.category)
          .length,
        image: categoryImages[product.category] ?? DEFAULT_CATEGORY_IMAGE,
      },
    ]),
  ).values(),
);
