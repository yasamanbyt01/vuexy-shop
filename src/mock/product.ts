import type { Product, Review } from "../types/products";

export const mockProduct: Product = {
  id: 1,
  name: "Premium Cotton T-Shirt",
  price: "$49.99",
  originalPrice: "$69.99",
  rating: 4.5,
  reviewsCount: 128,
  description:
    "High-quality cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
  longDescription:
    "This premium cotton t-shirt is made from 100% organic cotton, offering exceptional comfort and durability. The fabric is breathable and soft against the skin, making it ideal for daily wear in any season.",
  features: [
    "100% Premium Organic Cotton",
    "Machine Washable (Cold)",
    "Slim Fit Design",
    "Breathable Fabric",
    "Available in Multiple Colors",
  ],
  colors: [
    { name: "Navy Blue", value: "blue", hex: "#1E40AF" },
    { name: "Charcoal Black", value: "black", hex: "#1F2937" },
    { name: "Classic White", value: "white", hex: "#FFFFFF" },
    { name: "Heather Gray", value: "gray", hex: "#6B7280" },
    { name: "Forest Green", value: "green", hex: "#047857" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  images: [
    "/assets/img/elements/3.png",
    "/assets/img/elements/4.png",
    "/assets/img/elements/5.png",
    "/assets/img/elements/6.png",
  ],
  inStock: true,
  stockCount: 42,
  sku: "TSH-2024-BLUE-M",
  category: "Clothing",
  tags: ["Men", "T-Shirt", "Casual", "Summer", "Cotton", "Essential"],
  specifications: {
    material: "100% Organic Cotton",
    weight: "180 GSM",
    fit: "Slim Fit",
    origin: "Made in Turkey",
    care: "Machine wash cold, tumble dry low",
  },
  shippingInfo: {
    freeOver: 50,
    delivery: "3-5 business days",
    returns: "30-day return policy",
  },
};

export const mockReviews: Review[] = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    comment:
      "Great product! Fits perfectly and the material is very comfortable.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    comment:
      "Good quality, but the color is slightly different than shown in the photos.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: 3,
    name: "Robert Johnson",
    rating: 5,
    comment:
      "Exactly what I was looking for. The fit is perfect and it washes well.",
    date: "2024-01-05",
    verified: false,
  },
];
