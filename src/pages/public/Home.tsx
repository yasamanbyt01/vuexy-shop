import HeroCarousel from "../../components/Home/HeroCarousel";
import CategoryCard from "../../components/Home/CategoryCard";
import ProductCard from "../../components/Home/ProductCard";
import { Link } from "react-router-dom";
import { homeCategories } from "../../mock/homeCategories";
import { products } from "../../mock/products";

const Home = () => {
  const FEATURED_COUNT = 8;

  return (
    <main className="bg-body">
      <HeroCarousel />

      {/* Categories preview */}
      <section className="py-8">
        <div className="container">
          <h4 className="fw-semibold mb-4">Shop by category</h4>
          <div className="row g-4">
            {homeCategories.map((cat) => (
              <Link
                to="/category"
                key={cat.id}
                className="col-6 col-md-3 text-decoration-none"
              >
                <CategoryCard title={cat.title} image={cat.image} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-8 bg-body">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-semibold mb-0">محصولات پیشنهادی</h4>

            {/* Desktop CTA */}
            <Link
              to="/products"
              className="btn btn-sm btn-primary d-none d-md-inline-flex"
            >
              مشاهده همه
            </Link>
          </div>

          {/* Products */}
          <div className="row g-4 d-none d-md-flex">
            {products.slice(0, FEATURED_COUNT).map((product) => (
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

          {/* Mobile horizontal scroll (no visible scrollbar) */}
          <div className="d-md-none">
            <div className="horizontal-scroll pb-2">
              {products.slice(0, 8).map((product) => (
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
        </div>
      </section>
    </main>
  );
};

export default Home;
