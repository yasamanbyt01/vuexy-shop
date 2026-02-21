import { toFarsiNumber } from "./numbers";

export const formatSpecValue = (value: string | number) => {
  if (typeof value === "number") {
    return toFarsiNumber(value);
  }

  if (typeof value === "string") {
    // replace any english digits inside string
    return toFarsiNumber(value);
  }

  return value;
};
