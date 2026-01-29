import { useEffect } from "react";

const HeroCarousel = () => {
  useEffect(() => {
    // @ts-ignore
    if (window.Swiper) {
      // @ts-ignore
      new window.Swiper("#swiper-home-hero", {
        slidesPerView: 1,
        loop: true,
        pagination: {
          el: "#swiper-home-hero .swiper-pagination",
          clickable: true,
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
      });
    }
  }, []);

  return (
    <section className="py-8 bg-body">
      <div className="container">
        <div className="swiper" id="swiper-home-hero">
          <div className="swiper-wrapper">
            <div
              className="swiper-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "360px",
                backgroundImage: "url(/assets/img/elements/41.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <h2 className="fw-bold text-white position-relative">Big Sale</h2>
            </div>

            <div
              className="swiper-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "360px",
                backgroundImage: "url(/assets/img/elements/42.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <h2 className="fw-bold text-white position-relative">
                New Arrivals
              </h2>
            </div>

            <div
              className="swiper-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "360px",
                backgroundImage: "url(/assets/img/elements/43.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <h2 className="fw-bold text-white position-relative">
                Best Sellers
              </h2>
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
