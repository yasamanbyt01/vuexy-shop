interface CategoryCardProps {
  title: string;
  image: string;
}

const CategoryCard = ({ title, image }: CategoryCardProps) => {
  return (
    <div className="card border-0 shadow-sm h-100 category-card">
      <div className="ratio ratio-1x1">
        <img
          src={image}
          alt={title}
          className="card-img-top object-fit-cover"
        />
      </div>
      <div className="card-body text-center py-3">
        <h6 className="fw-semibold mb-0">{title}</h6>
      </div>
    </div>
  );
};

export default CategoryCard;
