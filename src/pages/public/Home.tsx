import HeroCarousel from "../../components/Home/HeroCarousel";
import CategoryCard from "../../components/Home/CategoryCard";
import ProductCard from "../../components/Home/ProductCard";
import { Link } from "react-router-dom";
import { homeCategories } from "../../mock/homeCategories";
import { featuredProducts } from "../../mock/featuredProducts";

const Home = () => {
  return (
    <main>
      <HeroCarousel />

      {/* Categories preview */}
      <section className="py-8">
        <div className="container">
          <h4 className="fw-semibold mb-4">Shop by category</h4>
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <Link to="/categoty" key={i} className="col-6 col-md-3">
                <CategoryCard />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-8 bg-body">
        <div className="container">
          <h4 className="fw-semibold mb-4">Featured products</h4>
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <Link to="/ProductDetail" key={i} className="col-6 col-md-3">
                <ProductCard />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
