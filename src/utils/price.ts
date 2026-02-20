export const formatPrice = (usd: number): string => {
  const toman = Math.round(usd * 60000);
  return `${toman.toLocaleString("fa-IR")} تومان`;
};
