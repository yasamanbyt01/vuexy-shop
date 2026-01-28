import React from "react";
import type { Product, Review } from "../../types/products";

interface ProductDetailTabsProps {
  product: Product;
  reviews: Review[];
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({
  product,
  reviews,
}) => {
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
              Description
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
              Specs
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
              Reviews
              <span className="badge rounded-pill bg-label-primary ms-1_5">
                {reviews.length}
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
              Shipping
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
          <h5 className="mb-4">Product Description</h5>

          <p>{product.longDescription}</p>

          <h6 className="mt-4 mb-3">Key Features:</h6>
          <div className="row">
            {product.features.map((feature, index) => (
              <div key={index} className="col-md-6 mb-2">
                <i className="ti tabler-check text-success me-2"></i>
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="mb-2">
              <i className="ti tabler-info-circle me-2"></i>
              Care Instructions
            </h6>
            <p className="mb-0">{product.specifications.care}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="tab-pane fade" id="product-specs" role="tabpanel">
          <h5 className="mb-3">Specifications</h5>

          <table className="table table-bordered">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <th className="text-capitalize" style={{ width: "35%" }}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </th>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviews */}
        <div className="tab-pane fade" id="product-reviews" role="tabpanel">
          {reviews.length === 0 && (
            <p className="text-muted">No reviews yet.</p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="border rounded p-3 mb-3">
              <div className="d-flex flex-column flex-md-row justify-content-between mb-1">
                <strong>{review.name}</strong>

                <div className="text-warning">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>

              <p className="mb-1">{review.comment}</p>

              <small className="text-muted">{review.date}</small>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div className="tab-pane fade" id="product-shipping" role="tabpanel">
          <h5 className="mb-4">Shipping & Returns Information</h5>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="ti tabler-truck text-primary me-2"></i>
                    Shipping Information
                  </h6>

                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="ti tabler-circle-check text-success me-2"></i>
                      Free shipping on orders over $
                      {product.shippingInfo.freeOver}
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-clock text-info me-2"></i>
                      Estimated delivery: {product.shippingInfo.delivery}
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-map-pin text-warning me-2"></i>
                      Ships to: Worldwide
                    </li>
                    <li>
                      <i className="ti tabler-shield-check text-danger me-2"></i>
                      Tracking provided for all orders
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
                    Return Policy
                  </h6>

                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="ti tabler-calendar text-primary me-2"></i>
                      {product.shippingInfo.returns}
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-credit-card text-info me-2"></i>
                      Full refund on unworn items with tags
                    </li>
                    <li className="mb-2">
                      <i className="ti tabler-truck-return text-warning me-2"></i>
                      Free returns for defective items
                    </li>
                    <li>
                      <i className="ti tabler-credit-card text-danger me-2"></i>
                      Refund processed within 5–7 business days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <i className="ti tabler-info-circle me-2"></i>
            <strong>Note:</strong> Some items may have specific shipping
            restrictions. Please check the product description for details.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTabs;
