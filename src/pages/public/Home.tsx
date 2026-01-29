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
          <h4 className="fw-semibold mb-4">Featured products</h4>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <Link
                to="ProductDetail"
                key={product.id}
                className="col-6 col-md-3 text-decoration-none"
              >
                <ProductCard
                  title={product.title}
                  price={product.price}
                  image={product.image}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
