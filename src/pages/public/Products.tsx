import { useState, useEffect } from "react";
import { products } from "../../mock/products";
import ProductCard from "../../components/Home/ProductCard";
import BreadCrumbs from "../../components/ui/BreadCrumbs";
import Pagination from "../../components/ui/Pagination";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div className="bg-body">
      <div className="container  p-5">
        {/* Breadcrumb */}
        <BreadCrumbs
          items={[{ label: "خانه", path: "/" }, { label: "محصولات" }]}
        />

        {/* Page Title */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">همه محصولات</h4>
          <span className="text-muted small">{products.length} محصول</span>
        </div>

        {/* Products Grid */}
        <div className="row g-4">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard
                id={product.id}
                title={product.name}
                image={product.images[0]}
                price={product.price}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
