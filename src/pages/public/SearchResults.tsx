import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/Home/ProductCard";
import { getProducts, type ApiProduct } from "../../services/products";

const SearchResults = () => {
  const [params] = useSearchParams();

  const query = params.get("q")?.trim() || "";

  const [results, setResults] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getProducts({
          search: query,
          page: 1,
          limit: 24,
        });

        if (!cancelled) {
          setResults(response.data);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query) {
    return (
      <section className="section-py bg-body">
        <div className="container p-5 text-center">
          <h5>عبارتی برای جستجو وارد کنید</h5>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-body">
      <div className="container p-5">
        <h4 className="mb-4 border-bottom pb-2">
          نتایج جستجو برای: <span className="text-primary">"{query}"</span>
        </h4>

        {loading && (
          <div className="text-center py-5">
            <p className="text-muted">در حال دریافت نتایج...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-5">
            <p className="text-danger">دریافت نتایج جستجو با خطا مواجه شد.</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="d-flex flex-column justify-content-center align-items-center text-center py-5">
            <i className="ti tabler-search fs-1 text-muted mb-3"></i>

            <h5 className="mb-2">محصول مورد نظر یافت نشد.</h5>

            <p className="text-muted mb-0">
              متأسفانه محصولی با این عبارت پیدا نشد. لطفاً عبارت دیگری جستجو
              کنید.
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="row g-3">
            {results.map((product) => (
              <div key={product.id} className="col-6 col-md-3">
                <ProductCard
                  id={product.id}
                  title={product.name}
                  image={product.images?.[0] || "/images/placeholder.jpg"}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
