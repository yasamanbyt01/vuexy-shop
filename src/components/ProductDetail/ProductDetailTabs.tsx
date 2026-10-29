import React, { useState } from "react";
import type { Product } from "../../types/products";
import type { Review } from "../../types/reviews";
import { SPEC_LABELS } from "../../constants/specificationLabels";
import { formatSpecValue } from "../../utils/specValue";
import { formatPrice } from "../../utils/price";
import { toFarsiNumber } from "../../utils/numbers";
import { formatReviewDate } from "../../utils/date";
import { createReview } from "../../services/reviews";

interface ProductDetailTabsProps {
  product: Product;
  reviews: Review[];
  isAuthenticated: boolean;
  token: string | null;
  onRequireLogin: () => void;
  onReviewSubmitted: () => Promise<void>;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({
  product,
  reviews,
  isAuthenticated,
  token,
  onRequireLogin,
  onReviewSubmitted,
}) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const handleReviewAction = () => {
    if (!isAuthenticated || !token) {
      onRequireLogin();
      return;
    }

    setReviewError("");
    setReviewSuccess("");
    setIsReviewFormOpen((open) => !open);
  };

  const handleReviewSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    const comment = reviewComment.trim();
    if (!comment) {
      setReviewError("لطفاً متن نظر خود را وارد کنید.");
      return;
    }

    if (!token || !isAuthenticated) {
      onRequireLogin();
      return;
    }

    setReviewSubmitting(true);
    try {
      await createReview(
        { productId: product.id, rating: reviewRating, comment },
        token,
      );

      setReviewComment("");
      setReviewRating(5);
      setIsReviewFormOpen(false);
      setReviewSuccess("نظر شما با موفقیت ثبت شد.");

      try {
        await onReviewSubmitted();
      } catch {
        setReviewSuccess(
          "نظر شما ثبت شد، اما فهرست نظرات به‌روزرسانی نشد. صفحه را تازه‌سازی کنید.",
        );
      }
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "ثبت نظر با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="nav-align-top nav-tabs-shadow">
      {/* =======================
          Tabs Header
      ======================= */}
      <ul className="nav nav-tabs nav-fill" role="tablist">
        {/* Description */}
        <li className="nav-item">
          <button
            type="button"
            className="nav-link active"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#product-description"
            aria-controls="product-description"
            aria-selected="true"
          >
            <span className="d-none d-sm-inline-flex align-items-center">
              <i className="icon-base ti tabler-file-text icon-sm me-1_5"></i>
              توضیحات
            </span>
            <i className="icon-base ti tabler-file-text icon-sm d-sm-none"></i>
          </button>
        </li>

        {/* Specifications */}
        <li className="nav-item">
          <button
            type="button"
            className="nav-link"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#product-specs"
            aria-controls="product-specs"
            aria-selected="false"
          >
            <span className="d-none d-sm-inline-flex align-items-center">
              <i className="icon-base ti tabler-list-details icon-sm me-1_5"></i>
              مشخصات
            </span>
            <i className="icon-base ti tabler-list-details icon-sm d-sm-none"></i>
          </button>
        </li>

        {/* Reviews */}
        <li className="nav-item">
          <button
            type="button"
            className="nav-link"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#product-reviews"
            aria-controls="product-reviews"
            aria-selected="false"
          >
            <span className="d-none d-sm-inline-flex align-items-center">
              <i className="icon-base ti tabler-star icon-sm me-1_5"></i>
              نظرات
              <span className="badge rounded-pill bg-label-primary ms-1_5">
                {toFarsiNumber(reviews.length)}
              </span>
            </span>
            <i className="icon-base ti tabler-star icon-sm d-sm-none"></i>
          </button>
        </li>

        {/* Shipping */}
        <li className="nav-item">
          <button
            type="button"
            className="nav-link"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#product-shipping"
            aria-controls="product-shipping"
            aria-selected="false"
          >
            <span className="d-none d-sm-inline-flex align-items-center">
              <i className="icon-base ti tabler-truck icon-sm me-1_5"></i>
              ارسال
            </span>
            <i className="icon-base ti tabler-truck icon-sm d-sm-none"></i>
          </button>
        </li>
      </ul>

      {/* =======================
          Tabs Content
      ======================= */}
      <div className="tab-content">
        {/* Description */}
        <div
          className="tab-pane fade show active"
          id="product-description"
          role="tabpanel"
        >
          <h5 className="mb-4">توضیحات </h5>

          <p>{product.longDescription}</p>

          <h6 className="mt-4 mb-3">ویژگی های محصول:</h6>
          <div className="row">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="col-md-6 mb-2 d-flex align-items-center"
              >
                <i className="ti tabler-check text-success me-2"></i>
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="mb-2 d-flex align-items-center">
              <i className="ti tabler-info-circle me-2"></i>
              دستورالعمل نگهداری
            </h6>
            <p className="mb-0">{product.specifications.care}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="tab-pane fade" id="product-specs" role="tabpanel">
          <h5 className="mb-3"> مشخصات</h5>

          <table className="table table-bordered">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <th style={{ width: "35%" }}>{SPEC_LABELS[key] ?? key}</th>
                  <td>{formatSpecValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviews */}
        <div className="tab-pane fade" id="product-reviews" role="tabpanel">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <h5 className="mb-0">نظرات کاربران</h5>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleReviewAction}
              aria-expanded={isReviewFormOpen}
            >
              <i className="ti tabler-message-plus me-1" aria-hidden="true"></i>
              {isAuthenticated && token ? "ثبت نظر" : "ورود برای ثبت نظر"}
            </button>
          </div>

          {reviewSuccess && (
            <div className="alert alert-success py-2" role="status">
              {reviewSuccess}
            </div>
          )}

          {isReviewFormOpen && (
            <div className="card border mb-4">
              <div className="card-body">
                <h6 className="mb-3">نظر خود را درباره این محصول بنویسید</h6>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="product-review-rating"
                      className="form-label"
                    >
                      امتیاز شما
                    </label>
                    <select
                      id="product-review-rating"
                      className="form-select"
                      value={reviewRating}
                      onChange={(event) =>
                        setReviewRating(Number(event.target.value))
                      }
                      disabled={reviewSubmitting}
                    >
                      <option value={5}>۵ ستاره — عالی</option>
                      <option value={4}>۴ ستاره — خوب</option>
                      <option value={3}>۳ ستاره — متوسط</option>
                      <option value={2}>۲ ستاره — ضعیف</option>
                      <option value={1}>۱ ستاره — خیلی ضعیف</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="product-review-comment"
                      className="form-label"
                    >
                      متن نظر
                    </label>
                    <textarea
                      id="product-review-comment"
                      className="form-control"
                      rows={4}
                      maxLength={2000}
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      placeholder="تجربه خود از این محصول را بنویسید..."
                      required
                      disabled={reviewSubmitting}
                    />
                    <div className="form-text">حداکثر ۲۰۰۰ نویسه</div>
                  </div>

                  {reviewError && (
                    <div className="alert alert-danger py-2" role="alert">
                      {reviewError}
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={reviewSubmitting || !reviewComment.trim()}
                    >
                      {reviewSubmitting ? "در حال ثبت..." : "ارسال نظر"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setIsReviewFormOpen(false);
                        setReviewError("");
                      }}
                      disabled={reviewSubmitting}
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {reviews.length === 0 && (
            <p className="text-muted">هنوز نظری برای این محصول ثبت نشده است.</p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="border rounded p-3 mb-3">
              <div className="d-flex flex-column flex-md-row justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <strong>{review.userName}</strong>
                </div>

                <div className="text-warning">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>

              <p className="mb-1">{review.comment}</p>

              <small className="text-muted">
                {formatReviewDate(review.createdAt)}
              </small>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div className="tab-pane fade" id="product-shipping" role="tabpanel">
          <h5 className="mb-4">اطلاعات ارسال و مرجوعی</h5>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="ti tabler-truck text-primary me-2"></i>
                    اطلاعات ارسال
                  </h6>

                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="ti tabler-circle-check text-success me-2"></i>
                      ارسال رایگان برای سفارش‌های بالای{" "}
                      {formatPrice(product.shippingInfo.freeOver)}
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-clock text-info me-2"></i>
                      زمان تقریبی تحویل:{" "}
                      {toFarsiNumber(product.shippingInfo.delivery)}
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-map-pin text-warning me-2"></i>
                      ارسال به: سراسر کشور
                    </li>
                    <li>
                      <i className="ti tabler-shield-check text-danger me-2"></i>
                      کد رهگیری برای تمامی سفارش‌ها ارائه می‌شود
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="ti tabler-rotate-clockwise text-success me-2"></i>
                    شرایط بازگشت کالا
                  </h6>

                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="ti tabler-calendar text-primary me-2"></i>
                      {toFarsiNumber(product.shippingInfo.returns)}
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-credit-card text-info me-2"></i>
                      بازگشت کامل وجه برای کالاهای استفاده‌نشده و دارای تگ
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-truck-return text-warning me-2"></i>
                      بازگشت رایگان برای کالاهای معیوب
                    </li>
                    <li>
                      <i className="ti tabler-credit-card text-danger me-2"></i>
                      واریز وجه بین ۵ تا ۷ روز کاری انجام می‌شود
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <i className="ti tabler-info-circle me-2"></i>
            <strong>توجه:</strong> برخی کالاها ممکن است محدودیت‌های خاصی در
            ارسال داشته باشند. لطفاً توضیحات محصول را بررسی کنید.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTabs;
