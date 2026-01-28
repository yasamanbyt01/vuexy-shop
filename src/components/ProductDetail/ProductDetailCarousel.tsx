import { useEffect, useRef } from "react";

interface ProductDetailCarouselProps {
  images?: string[];
}

const ProductDetailCarousel: React.FC<ProductDetailCarouselProps> = ({
  images = [
    "/assets/img/elements/3.png",
    "/assets/img/elements/4.png",
    "/assets/img/elements/5.png",
  ],
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Bootstrap carousel if available
    const initializeCarousel = () => {
      if (carouselRef.current && (window as any).bootstrap) {
        const carousel = new (window as any).bootstrap.Carousel(
          carouselRef.current,
          {
            interval: 4000,
            ride: "carousel",
            wrap: true,
            touch: true,
          },
        );

        // Cleanup
        return () => {
          if (carousel.dispose) {
            carousel.dispose();
          }
        };
      }
    };

    // Wait for Bootstrap to load
    if ((window as any).bootstrap) {
      initializeCarousel();
    } else {
      // If Bootstrap isn't loaded yet, wait for it
      const timer = setTimeout(() => {
        if ((window as any).bootstrap) {
          initializeCarousel();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      ref={carouselRef}
      id="productDetailCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="4000"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#productDetailCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner rounded" style={{ maxHeight: "400px" }}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            style={{ height: "400px" }}
          >
            <img
              src={image}
              className="d-block w-100 h-100"
              alt={`Product view ${index + 1}`}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#productDetailCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#productDetailCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>

      {/* Thumbnails */}
      <div className="mt-3">
        <div className="row g-2">
          {images.map((image, index) => (
            <div key={index} className="col-3">
              <button
                type="button"
                className="w-100 p-0 border-0 bg-transparent"
                data-bs-target="#productDetailCarousel"
                data-bs-slide-to={index}
                aria-label={`Slide ${index + 1}`}
                style={{ borderRadius: "4px", overflow: "hidden" }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-100"
                  style={{
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "3px",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCarousel;
