export type DeliverySpeed = "standard" | "express";

export interface DeliveryOption {
  id: DeliverySpeed;
  title: string;
  price: number;
  estimatedDays: number;
}
