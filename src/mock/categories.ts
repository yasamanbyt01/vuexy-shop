import { products } from "./products";
import type { Category } from "../types/category";

const categoryImages: Record<string, string> = {
  پوشاک: "/assets/img/categories/clothing.jpg",
  کفش: "/assets/img/categories/shoes.jpg",
  کیف: "/assets/img/categories/bags.jpg",
  الکترونیک: "/assets/img/categories/electronics.jpg",
  اکسسوری: "/assets/img/categories/accessories.jpg",
  خانه: "/assets/img/categories/home.jpg",
};

const DEFAULT_CATEGORY_IMAGE = "/assets/img/categories/default.jpg";

export const categories: Category[] = Array.from(
  new Map(
    products.map((product) => [
      product.category,
      {
        id: product.category,
        title: product.category,
        slug: product.category.replace(/\s+/g, "-").toLowerCase(),
        productCount: products.filter((p) => p.category === product.category)
          .length,
        image: categoryImages[product.category] ?? DEFAULT_CATEGORY_IMAGE,
      },
    ]),
  ).values(),
);
