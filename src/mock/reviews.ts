import type { Review } from "../types/reviews";

export const mockReviews: Review[] = [
  // ================= Product 1 =================
  {
    id: 1,
    productId: 1,
    name: "علی رضایی",
    rating: 5,
    comment: "کیفیت ساخت خیلی بالاست و دقیقاً مطابق توضیحات بود.",
    date: "۱۴۰۲/۱۰/۲۵",
    verified: true,
  },
  {
    id: 2,
    productId: 1,
    name: "مریم احمدی",
    rating: 4,
    comment: "راضی‌کننده‌ست، فقط بسته‌بندی می‌تونست بهتر باشه.",
    date: "۱۴۰۲/۱۰/۲۰",
    verified: true,
  },

  // ================= Product 2 =================
  {
    id: 3,
    productId: 2,
    name: "حسین کریمی",
    rating: 5,
    comment: "ارسال سریع و کیفیت عالی. حتماً دوباره خرید می‌کنم.",
    date: "۱۴۰۲/۱۰/۱۸",
    verified: true,
  },
  {
    id: 4,
    productId: 2,
    name: "نگار شریفی",
    rating: 3,
    comment: "بد نیست ولی نسبت به قیمت انتظار بیشتری داشتم.",
    date: "۱۴۰۲/۱۰/۱۵",
    verified: false,
  },

  // ================= Product 4 =================
  {
    id: 6,
    productId: 4,
    name: "سارا نادری",
    rating: 5,
    comment: "طراحی خیلی شیکه و کیفیتش فراتر از انتظارمه.",
    date: "۱۴۰۲/۱۰/۱۰",
    verified: true,
  },
  {
    id: 7,
    productId: 4,
    name: "پریسا موسوی",
    rating: 4,
    comment: "کاملاً راضی هستم، فقط رنگش کمی تیره‌تر از عکس بود.",
    date: "۱۴۰۲/۱۰/۰۸",
    verified: true,
  },

  // ================= Product 5 =================
  {
    id: 8,
    productId: 5,
    name: "امیرحسین قربانی",
    rating: 5,
    comment: "برای استفاده روزمره عالیه، سبک و باکیفیته.",
    date: "۱۴۰۲/۱۰/۰۵",
    verified: true,
  },

  // ================= Product 6 =================
  {
    id: 9,
    productId: 6,
    name: "فاطمه رحیمی",
    rating: 4,
    comment: "کیفیت خوبه و ارزش خرید داره.",
    date: "۱۴۰۲/۱۰/۰۳",
    verified: true,
  },
  {
    id: 10,
    productId: 6,
    name: "محمد پارسا",
    rating: 3,
    comment: "معمولیه، نه خیلی خاص نه بد.",
    date: "۱۴۰۲/۱۰/۰۱",
    verified: false,
  },

  // ================= Product 7 =================
  {
    id: 11,
    productId: 7,
    name: "نیما اکبری",
    rating: 5,
    comment: "دقیقاً همونی بود که دنبالش بودم 👌",
    date: "۱۴۰۲/۰۹/۲۸",
    verified: true,
  },

  // ================= Product 8 =================
  {
    id: 12,
    productId: 8,
    name: "الهام قاسمی",
    rating: 4,
    comment: "ظاهر قشنگی داره و کیفیتش قابل قبوله.",
    date: "۱۴۰۲/۰۹/۲۵",
    verified: true,
  },
  {
    id: 13,
    productId: 8,
    name: "مهدی شریعتی",
    rating: 2,
    comment: "به نظرم قیمتش کمی بالاست.",
    date: "۱۴۰۲/۰۹/۲۳",
    verified: false,
  },

  // ================= Product 9 =================
  {
    id: 14,
    productId: 9,
    name: "زهرا کاظمی",
    rating: 5,
    comment: "خیلی کاربردیه و جنس خوبی داره.",
    date: "۱۴۰۲/۰۹/۲۰",
    verified: true,
  },

  // ================= Product 10 =================
  {
    id: 15,
    productId: 10,
    name: "پویا زمانی",
    rating: 4,
    comment: "عملکردش خوبه و مشکلی نداشتم.",
    date: "۱۴۰۲/۰۹/۱۸",
    verified: true,
  },
  {
    id: 16,
    productId: 10,
    name: "آرزو صادقی",
    rating: 5,
    comment: "کاملاً مطابق توضیحات، پیشنهاد می‌کنم.",
    date: "۱۴۰۲/۰۹/۱۶",
    verified: true,
  },

  // ================= Product 11 =================
  {
    id: 17,
    productId: 11,
    name: "کیان فرهادی",
    rating: 3,
    comment: "بد نیست ولی می‌تونست بهتر باشه.",
    date: "۱۴۰۲/۰۹/۱۴",
    verified: false,
  },

  // ================= Product 12 =================
  {
    id: 18,
    productId: 12,
    name: "رها سلطانی",
    rating: 5,
    comment: "خیلی خوش‌دسته و استفاده ازش لذت‌بخشه.",
    date: "۱۴۰۲/۰۹/۱۲",
    verified: true,
  },

  // ================= Product 13 =================
  {
    id: 19,
    productId: 13,
    name: "سینا بهرامی",
    rating: 4,
    comment: "کیفیتش خوبه و ارزش خرید داره.",
    date: "۱۴۰۲/۰۹/۱۰",
    verified: true,
  },

  // ================= Product 14 =================
  {
    id: 20,
    productId: 14,
    name: "نرگس توکلی",
    rating: 5,
    comment: "خیلی شیک و کاربردی، کاملاً راضیم.",
    date: "۱۴۰۲/۰۹/۰۸",
    verified: true,
  },
  {
    id: 21,
    productId: 14,
    name: "میلاد رستمی",
    rating: 4,
    comment: "کیفیت خوبه، ارسال هم سریع بود.",
    date: "۱۴۰۲/۰۹/۰۶",
    verified: true,
  },

  // ================= Product 15 =================
  {
    id: 22,
    productId: 15,
    name: "آیدا مرادی",
    rating: 5,
    comment: "از خریدم خیلی راضی‌ام ❤️",
    date: "۱۴۰۲/۰۹/۰۴",
    verified: true,
  },

  // ================= Product 16 =================
  {
    id: 23,
    productId: 16,
    name: "بهنام جعفری",
    rating: 4,
    comment: "کیفیت قابل قبوله و طراحی خوبی داره.",
    date: "۱۴۰۲/۰۹/۰۲",
    verified: true,
  },
];
