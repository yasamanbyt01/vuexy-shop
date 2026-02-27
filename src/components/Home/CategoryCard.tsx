import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  slug: string;
}

const CategoryCard = ({ title, image, slug }: CategoryCardProps) => {
  return (
    <Link to={`/categories/${slug}`} className="text-decoration-none h-100">
      <div className="card text-bg-dark border-0 category-card category-card--compact overflow-hidden">
        <img src={image} alt={title} className="card-img object-fit-cover" />

        <div className="card-img-overlay d-flex align-items-center justify-content-center">
          <h5 className="card-title fw-semibold text-white text-center mb-0">
            {title}
          </h5>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
