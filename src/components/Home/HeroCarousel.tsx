import { useEffect, useRef } from "react";

const HeroCarousel = () => {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (!window.Swiper) return;

    const el = document.querySelector("#swiper-home-hero") as any;
    if (!el) return;

    const paginationEl = el.querySelector(".swiper-pagination");

    // Cleanup any previous instance if Hot Reload re‑mounted
    if (el.swiper) {
      el.swiper.destroy(true, false);
      el.swiper = null;
    }

    swiperRef.current = new window.Swiper(el, {
      slidesPerView: 1,
      loop: true,
      pagination: { el: paginationEl, clickable: true },
      autoplay: { delay: 4000, disableOnInteraction: false },
      observer: true,
      observeParents: true,
    });

    // Re‑calculate once to ensure layout ready after HMR
    setTimeout(() => swiperRef.current?.update(), 100);

    // Cleanup on unmount
    return () => {
      swiperRef.current?.destroy(false, false);
      swiperRef.current = null;
    };
  }, []); // <- keep empty; each new mount re‑inits

  return (
    <section className="py-8">
      <div className="container">
        <div className="swiper rounded-3 overflow-hidden" id="swiper-home-hero">
          <div className="swiper-wrapper">
            <div
              className="swiper-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "360px",
                backgroundImage: "url(/assets/img/elements/slide-1.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <div className="position-relative text-center text-white">
                <h2 className="fw-bold text-white position-relative">
                  حراج بزرگ
                </h2>
                <a href="#" className="btn btn-outline-light btn-sm">
                  همین حالا خرید کن
                </a>
              </div>
            </div>

            <div
              className="swiper-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "360px",
                backgroundImage: "url(/assets/img/elements/slide-2.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <div className="position-relative text-center text-white">
                <h2 className="fw-bold text-white position-relative">
                  محصولات جدید
                </h2>
                <a href="#" className="btn btn-outline-light btn-sm">
                  مشاهده محصولات جدید
                </a>
              </div>
            </div>

            <div
              className="swiper-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "360px",
                backgroundImage: "url(/assets/img/elements/slide-3.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <div className="position-relative text-center text-white">
                <h2 className="fw-bold text-white position-relative">
                  پرفروش ترین ها
                </h2>
                <a href="#" className="btn btn-outline-light btn-sm">
                  مشاهده پرفروش ها
                </a>
              </div>
            </div>
          </div>

          {/* pagination */}
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
