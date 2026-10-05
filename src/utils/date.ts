export const formatReviewDate = (date?: string) => {
  if (!date) {
    return "تاریخ ثبت نامشخص";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};
