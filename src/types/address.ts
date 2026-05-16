export interface Address {
  id: number;
  name: string;
  type: "home" | "office";
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}
