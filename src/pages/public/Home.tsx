import HeroCarousel from "../../components/Home/HeroCarousel";
import CategoryCard from "../../components/Home/CategoryCard";
import ProductCard from "../../components/Home/ProductCard";
import { Link } from "react-router-dom";
import { homeCategories } from "../../mock/homeCategories";
import { products } from "../../mock/products";

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
            {products.slice(0, 4).map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="col-6 col-md-3 text-decoration-none"
              >
                <ProductCard
                  title={product.name}
                  price={product.price}
                  image={product.images[0]}
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
