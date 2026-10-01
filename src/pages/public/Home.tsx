import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import HeroCarousel from "../../components/Home/HeroCarousel";
import CategoryCard from "../../components/Home/CategoryCard";
import ProductCard from "../../components/Home/ProductCard";

import { getProducts, type ApiProduct } from "../../services/products";

import {
  getCategories,
  getCategoryImageUrl,
  type ApiCategory,
} from "../../services/categories";

const Home = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");

        const data = await getCategories();

        setCategories(data);
      } catch {
        setCategoryError("دریافت دسته‌بندی‌ها با خطا مواجه شد.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const result = await getProducts({
          page: 1,
          limit: 8,
        });

        setFeaturedProducts(result.data);
      } catch {
        setProductsError("خطا در دریافت محصولات");
      } finally {
        setProductsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <main className="bg-body">
      <HeroCarousel />

      {/* Categories preview */}
      <section className="py-8">
        <div className="container">
          <h4 className="fw-semibold mb-4">خرید براساس دسته بندی</h4>

          {loadingCategories && (
            <div className="text-center py-4">
              <p>در حال دریافت دسته‌بندی‌ها...</p>
            </div>
          )}

          {categoryError && !loadingCategories && (
            <div className="alert alert-danger">{categoryError}</div>
          )}

          {!loadingCategories && !categoryError && (
            <div className="row g-4">
              {categories.map((category) => (
                <div key={category.id} className="col-6 col-md-4 col-lg-2">
                  <CategoryCard
                    title={category.name}
                    image={getCategoryImageUrl(category.image)}
                    slug={category.slug}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-8 bg-body">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-semibold mb-0">محصولات پیشنهادی</h4>

            <Link
              to="/products"
              className="btn btn-sm btn-primary d-none d-md-inline-flex"
            >
              مشاهده همه
            </Link>
          </div>

          {/* Products loading state */}
          {productsLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          )}

          {/* Products error state */}
          {!productsLoading && productsError && (
            <div className="alert alert-danger">{productsError}</div>
          )}

          {/* No products */}
          {!productsLoading &&
            !productsError &&
            featuredProducts.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted mb-0">محصولی برای نمایش وجود ندارد.</p>
              </div>
            )}

          {/* Products successfully loaded */}
          {!productsLoading &&
            !productsError &&
            featuredProducts.length > 0 && (
              <>
                {/* Desktop products */}
                <div className="row g-4 d-none d-md-flex">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="col-md-3">
                      <ProductCard
                        id={product.id}
                        title={product.name}
                        price={product.price}
                        image={product.images[0]}
                      />
                    </div>
                  ))}
                </div>

                {/* Mobile horizontal scroll */}
                <div className="d-md-none">
                  <div className="horizontal-scroll pb-2">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="product-scroll-item">
                        <ProductCard
                          id={product.id}
                          title={product.name}
                          price={product.price}
                          image={product.images[0]}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-4">
                    <Link to="/products" className="btn btn-primary w-100">
                      مشاهده همه محصولات
                    </Link>
                  </div>
                </div>
              </>
            )}
        </div>
      </section>
    </main>
  );
};

export default Home;
