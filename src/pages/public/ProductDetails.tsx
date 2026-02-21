import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../../mock/products";
import { mockReviews } from "../../mock/reviews";
import BreadCrumbs from "../../components/ui/BreadCrumbs";
import ProductDetailCarousel from "../../components/ProductDetail/ProductDetailCarousel";
import ProductDetailTabs from "../../components/ProductDetail/ProductDetailTabs";
import { SPEC_LABELS } from "../../constants/specificationLabels";
import { formatPrice } from "../../utils/price";
import { toFarsiNumber } from "../../utils/numbers";
import { formatSpecValue } from "../../utils/SpecValue";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="container py-6">
        <h4>محصول مورد نظر یافت نشد</h4>
      </div>
    );
  }

  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].value);
    }
  }, [product]);

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [product]);

  const reviews = mockReviews.filter((r) => r.productId === productId);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "خانه", path: "/" },
    { label: "محصولات", path: "/products" },
    {
      label: product.category,
      path: `/category/${product.category}`,
    },
    { label: product.name },
  ];

  // Price & discount logic (single source of truth)
  const price = product.price;

  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const originalPrice = hasDiscount ? product.originalPrice! : null;

  const savingsAmount = hasDiscount ? originalPrice! - price : 0;

  const savingsPercentage = hasDiscount
    ? Math.round((savingsAmount / originalPrice!) * 100)
    : 0;

  return (
    <main className="py-6 bg-body">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-4">
          <BreadCrumbs items={breadcrumbItems} />
        </div>

        <div className="row g-5">
          {/* Left Column - Carousel */}
          <div className="col-lg-6">
            <ProductDetailCarousel images={product.images} />
          </div>

          {/* Middle Column - Product Info */}
          <div className="col-lg-4">
            <div className="product-info">
              {/* Category & SKU */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-light text-dark me-2">
                    {product.category}
                  </span>
                  <span className="text-muted small">
                    {" "}
                    کد محصول: {toFarsiNumber(product.sku)}
                  </span>
                </div>
                {product.inStock ? (
                  <span className="badge bg-success d-flex align-items-center">
                    <i className="ti tabler-check me-1"></i>
                    موجود ({toFarsiNumber(product.stockCount)})
                  </span>
                ) : (
                  <span className="badge bg-danger">ناموجود</span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="h2 fw-bold mb-3">{product.name}</h1>

              {/* Rating & Reviews */}
              <div className="d-flex align-items-center mb-3">
                <div className="text-warning me-2">
                  {"★".repeat(Math.floor(product.rating))}
                  <span className="text-warning">★</span>
                  {"☆".repeat(5 - Math.ceil(product.rating))}
                </div>
                <span className="text-muted small mx-2">
                  {toFarsiNumber(product.rating)}/۵
                </span>
                <Link to="#reviews" className="text-primary small">
                  ({toFarsiNumber(product.reviewsCount)} دیدگاه)
                </Link>
              </div>

              {/* Price & Savings */}
              <div className="mb-4 p-3 bg-light rounded">
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="d-flex align-items-center mb-2 flex-wrap gap-2">
                    {/* Main price – always visible */}
                    <span className="h2 text-primary fw-bold">
                      {formatPrice(price)}
                    </span>

                    {hasDiscount ? (
                      <>
                        <span className="text-muted text-decoration-line-through ms-2">
                          {formatPrice(originalPrice!)}
                        </span>

                        <span className="badge bg-danger ms-2">
                          {toFarsiNumber(savingsPercentage)}٪ تخفیف
                        </span>
                      </>
                    ) : (
                      <span className="badge bg-success ms-2">بهترین قیمت</span>
                    )}
                  </div>

                  {hasDiscount ? (
                    <p className="mb-0 text-success small">
                      <i className="ti tabler-discount me-1"></i>
                      شما {formatPrice(savingsAmount)} صرفه‌جویی می‌کنید
                    </p>
                  ) : (
                    <p className="mb-0 text-muted small">
                      <i className="ti tabler-shield-check me-1"></i>
                      قیمت منصفانه · بدون تخفیف
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mb-4">{product.description}</p>

              {/* Color Selection */}
              <div className="mb-4">
                <h6 className="mb-2 d-flex justify-content-between">
                  <span>
                    رنگ:{" "}
                    <strong>
                      {
                        product.colors.find((c) => c.value === selectedColor)
                          ?.name
                      }
                    </strong>
                  </span>
                  <span className="text-primary small">انتخاب الزامی</span>
                </h6>

                <div className="d-flex gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.value;

                    return (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className="position-relative rounded-circle"
                        title={color.name}
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: color.hex,
                          border: isSelected
                            ? "2px solid #0d6efd"
                            : color.hex === "#FFFFFF"
                              ? "2px solid #ced4da"
                              : "2px solid transparent",
                          boxShadow:
                            color.hex === "#FFFFFF"
                              ? "inset 0 0 0 1px #dee2e6"
                              : "none",
                        }}
                      >
                        {isSelected && (
                          <i
                            className="ti tabler-check text-primary position-absolute top-50 start-50 translate-middle"
                            style={{
                              color: color.hex === "#FFFFFF" ? "#000" : "#fff",
                              fontSize: "1rem",
                            }}
                          ></i>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <h6 className="mb-2 d-flex justify-content-between">
                    <span>
                      سایز:{" "}
                      <strong>
                        {" "}
                        {selectedSize ? toFarsiNumber(selectedSize) : "—"}
                      </strong>
                    </span>
                    <Link to="#" className="text-primary small">
                      راهنمای سایز
                    </Link>
                  </h6>

                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`btn ${
                          selectedSize === size
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {toFarsiNumber(size)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <h6 className="mb-2">تعداد:</h6>
                <div
                  className="d-flex align-items-center"
                  style={{ maxWidth: "150px" }}
                >
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="ti tabler-minus"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control text-center border-0"
                    value={toFarsiNumber(quantity)}
                    readOnly
                    style={{
                      maxWidth: "60px",
                      fontWeight: "600",
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockCount, q + 1))
                    }
                    disabled={quantity >= product.stockCount}
                  >
                    <i className="ti tabler-plus"></i>
                  </button>
                </div>
                <small className="text-muted mt-1 d-block">
                  فقط {toFarsiNumber(product.stockCount)} عدد باقی مانده
                </small>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-3 mb-4">
                <button className="btn btn-primary btn-lg py-3">
                  <i className="ti tabler-shopping-cart me-2"></i>
                  افزودن به سبد خرید – {formatPrice(price * quantity)}
                </button>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary flex-grow-1">
                    <i className="ti tabler-heart me-2"></i>
                    افزودن به علاقه مندی ها
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="ti tabler-repeat"></i>
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="ti tabler-share"></i>
                  </button>
                </div>
              </div>

              {/* Secure Payment & Shipping */}
              <div className="border rounded p-3 mb-4">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="ti tabler-shield-check text-success me-2"></i>
                      <span className="small">پرداخت امن</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="ti tabler-truck text-primary me-2"></i>
                      <span className="small">ارسال رایگان</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="ti tabler-rotate-clockwise text-info me-2"></i>
                      <span className="small">بازگشت ۳۰ روزه</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="ti tabler-headset text-warning me-2"></i>
                      <span className="small">پشتیبانی ۲۴/۷</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="col-lg-2">
            {/* Product Highlights */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0 d-flex align-items-center">
                  <i className="ti tabler-sparkles me-2"></i>
                  مزایای محصول
                </h6>
              </div>
              <div className="card-body p-3">
                <ul className="list-unstyled mb-0">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="mb-2 small">
                      <i className="ti tabler-check text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specifications */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0 d-flex align-items-center">
                  <i className="ti tabler-list-details me-2"></i>
                  مشخصات
                </h6>
              </div>
              <div className="card-body p-3">
                <dl className="row mb-0">
                  {product.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <>
                          <dt className="col-6 small text-muted">
                            {SPEC_LABELS[key as keyof typeof SPEC_LABELS] ??
                              key}
                          </dt>
                          <dd className="col-6 small">
                            {formatSpecValue(value)}
                          </dd>
                        </>
                      ),
                    )}
                </dl>
              </div>
            </div>

            {/* Tags */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0 d-flex align-items-center">
                  <i className="ti tabler-tags me-2"></i>
                  برچسب ها
                </h6>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/tag/${tag.toLowerCase()}`}
                      className="badge bg-light text-dark text-decoration-none"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Share Product */}
            <div className="card">
              <div className="card-body p-3 text-center">
                <h6 className="mb-3">اشتراک‌گذاری محصول</h6>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="ti tabler-brand-facebook"></i>
                  </button>
                  <button className="btn btn-outline-info btn-sm">
                    <i className="ti tabler-brand-twitter"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="ti tabler-brand-pinterest"></i>
                  </button>
                  <button className="btn btn-outline-success btn-sm">
                    <i className="ti tabler-brand-whatsapp"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="row mt-6">
          <div className="col-12">
            <ProductDetailTabs product={product} reviews={reviews} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
