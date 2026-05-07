export interface Subcategory {
  title: string;
  slug: string;
  productCount: number;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  productCount: number;
  image: string;
  icon: string;
  subcategories: Subcategory[];
}
