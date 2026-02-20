import { products } from "../../mock/products";
import ProductCard from "../../components/Home/ProductCard";
import BreadCrumbs from "../../components/ui/BreadCrumbs";

const Products = () => {
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
      </div>
    </div>
  );
};

export default Products;
