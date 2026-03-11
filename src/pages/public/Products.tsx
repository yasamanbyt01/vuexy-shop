import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../../mock/products";
import ProductCard from "../../components/Home/ProductCard";
import BreadCrumbs from "../../components/ui/BreadCrumbs";
import Pagination from "../../components/ui/Pagination";
import { CATEGORY_LABELS } from "../../constants/catergoryLabels";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // Read page from URL, default to 1
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const categoryLabel =
    selectedCategory && CATEGORY_LABELS[selectedCategory]
      ? CATEGORY_LABELS[selectedCategory]
      : null;

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Clamp current page to valid range (to avoid out-of-bound errors)
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [safePage]);

  // Reset page to 1 when category changes, but skip the initial mount
  const prevCategoryRef = useRef(selectedCategory);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevCategoryRef.current !== selectedCategory) {
      // Category changed: set page to 1 in the URL
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        return newParams;
      });
    }
    prevCategoryRef.current = selectedCategory;
  }, [selectedCategory, setSearchParams]);

  // If the URL contains an invalid page number, correct it
  useEffect(() => {
    if (currentPage !== safePage) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", safePage.toString());
        return newParams;
      });
    }
  }, [currentPage, safePage, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  return (
    <div className="bg-body">
      <div className="container p-5">
        <BreadCrumbs
          items={[
            { label: "خانه", path: "/" },
            { label: "محصولات", path: "/products" },
            ...(categoryLabel ? [{ label: categoryLabel }] : []),
          ]}
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">
            {selectedCategory ? "محصولات دسته‌بندی" : "همه محصولات"}
          </h4>
          <span className="text-muted small">
            {filteredProducts.length} محصول
          </span>
        </div>

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

        {totalPages > 1 && (
          <div className="mt-5">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
