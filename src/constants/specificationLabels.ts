import type { Product } from "../types/products";

type SpecKey = keyof NonNullable<Product["specifications"]>;

export const SPEC_LABELS: Record<SpecKey, string> = {
  material: "جنس",
  fit: "قالب",
  sole: "کفی",
  weight: "وزن",
  capacity: "ظرفیت",
  battery: "باتری",
  range: "برد",
  display: "نمایشگر",
  slots: "تعداد جای کارت",
  maxWeight: "حداکثر وزن",
  power: "توان",
  dpi: "DPI",
  switch: "نوع سوییچ",
  lens: "نوع لنز",
};
