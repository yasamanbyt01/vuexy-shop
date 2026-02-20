import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/price";

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price: number;
}

const ProductCard = ({ id, title, image, price }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${id}`}
      className="card border-0 shadow-sm h-100 product-card text-decoration-none text-body"
    >
      <div className="ratio ratio-1x1">
        <img
          src={image}
          alt={title}
          className="card-img-top object-fit-cover"
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="fw-semibold">{title}</h6>
        <span className="text-primary fw-bold mb-3">{formatPrice(price)}</span>

        <button className="btn btn-sm btn-outline-primary mt-auto">
          مشاهده محصول
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
