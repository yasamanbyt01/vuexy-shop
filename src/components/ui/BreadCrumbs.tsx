import { Link } from "react-router-dom";

interface BreadCrumbItem {
  label: string;
  path?: string; // Optional for current page
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb breadcrumb-custom-icon">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${index === items.length - 1 ? "active" : ""}`}
          >
            {item.path ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}

            {index < items.length - 1 && (
              <i className="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
