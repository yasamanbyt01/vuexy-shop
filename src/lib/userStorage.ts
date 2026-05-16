import type { Address } from "../types/address";
import { mockAddresses } from "../mock/addresses";

const STORAGE_KEY = "user_addresses";

function initStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAddresses));
  }
}

export function getAddresses(): Address[] {
  initStorage();

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  return JSON.parse(data);
}

function saveAddresses(addresses: Address[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function addAddress(address: Address): Address[] {
  const addresses = getAddresses();

  const updated = [...addresses, address];

  saveAddresses(updated);

  return updated;
}

export function removeAddress(id: number): Address[] {
  const addresses = getAddresses();

  const updated = addresses.filter((a) => a.id !== id);

  saveAddresses(updated);

  return updated;
}

export function updateAddress(updatedAddress: Address): Address[] {
  const addresses = getAddresses();

  const updated = addresses.map((a) =>
    a.id === updatedAddress.id ? updatedAddress : a,
  );

  saveAddresses(updated);

  return updated;
}

export function setDefaultAddress(id: number): Address[] {
  const addresses = getAddresses();

  const updated = addresses.map((a) => ({
    ...a,
    isDefault: a.id === id,
  }));

  saveAddresses(updated);

  return updated;
}
