interface ProductCardProps {
  title: string;
  image: string;
  price: number;
}

const ProductCard = ({ title, image, price }: ProductCardProps) => {
  return (
    <div className="card border-0 shadow-sm h-100 product-card">
      <div className="ratio ratio-1x1">
        <img
          src={image}
          alt={title}
          className="card-img-top object-fit-cover"
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="fw-semibold">{title}</h6>
        <span className="text-primary fw-bold mb-3">${price}</span>

        <button className="btn btn-sm btn-outline-primary mt-auto">
          View product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
