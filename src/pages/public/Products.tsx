import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BreadCrumbs from "../../components/ui/BreadCrumbs";
import Pagination from "../../components/ui/Pagination";
import ProductCard from "../../components/Home/ProductCard";

import { CATEGORY_LABELS } from "../../constants/catergoryLabels";

import { getCategories, type ApiCategory } from "../../services/categories";

import { getProducts, type ApiProduct } from "../../services/products";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const selectedTag = searchParams.get("tag");

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(!selectedCategory);

  const [products, setProducts] = useState<ApiProduct[]>([]);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryLabel =
    selectedCategory && CATEGORY_LABELS[selectedCategory]
      ? CATEGORY_LABELS[selectedCategory]
      : null;

  /*
   * Load categories when a category filter is present.
   *
   * The URL uses the category slug:
   * /products?category=clothing
   *
   * But the backend currently filters by categoryId:
   * /products?categoryId=1
   *
   * So we resolve slug -> ID here.
   */
  useEffect(() => {
    if (!selectedCategory) {
      setCategoriesLoaded(true);
      return;
    }

    let cancelled = false;

    const loadCategories = async () => {
      try {
        setCategoriesLoaded(false);

        const result = await getCategories();

        if (!cancelled) {
          setCategories(result);
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
          setError("خطا در دریافت دسته‌بندی‌ها");
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoaded(true);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const selectedApiCategory = categories.find(
    (category) => category.slug === selectedCategory,
  );

  const categoryId = selectedApiCategory?.id;

  /*
   * Fetch products from NestJS.
   */
  useEffect(() => {
    if (selectedCategory && !categoriesLoaded) {
      return;
    }

    if (selectedCategory && !categoryId) {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProducts({
          categoryId,
          tag: selectedTag || undefined,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        if (!cancelled) {
          setProducts(result.data);
          setTotalProducts(result.meta.total);
          setTotalPages(result.meta.totalPages);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(1);
          setError("خطا در دریافت محصولات");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [
    selectedCategory,
    selectedTag,
    categoryId,
    categoriesLoaded,
    currentPage,
  ]);

  /*
   * Reset page to 1 when category changes.
   */
  const prevCategoryRef = useRef(selectedCategory);

  useEffect(() => {
    if (prevCategoryRef.current !== selectedCategory) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        return newParams;
      });
    }

    prevCategoryRef.current = selectedCategory;
  }, [selectedCategory, setSearchParams]);

  /*
   * Keep page inside the valid range.
   */
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  useEffect(() => {
    if (currentPage !== safePage) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", safePage.toString());
        return newParams;
      });
    }
  }, [currentPage, safePage, setSearchParams]);

  /*
   * Scroll to top when page changes.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [safePage]);

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

          <span className="text-muted small">{totalProducts} محصول</span>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          </div>
        )}

        {!loading && error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted mb-0">محصولی پیدا نشد.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="row g-4">
              {products.map((product) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
