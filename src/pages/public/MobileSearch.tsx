import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, type ApiProduct } from "../../services/products";

const SearchPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState<ApiProduct[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    saveSearch(trimmedQuery);
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");

    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch search results from backend
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await getProducts({
          search: trimmedQuery,
          page: 1,
          limit: 10,
        });

        if (!cancelled) {
          setResults(response.data);
          setSelectedIndex(-1);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
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
  }, [debouncedQuery]);

  // Save search
  const saveSearch = (term: string) => {
    if (!term.trim()) return;

    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleProductClick = (product: ApiProduct) => {
    saveSearch(product.name);
    navigate(`/products/${product.id}`);
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setUsingKeyboard(true);

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        handleProductClick(results[selectedIndex]);
      } else {
        submitSearch();
      }
    } else if (e.key === "Escape") {
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="container py-4 search-page-container">
      <div className="search-header mb-3">
        <button className="btn btn-icon" onClick={() => navigate(-1)}>
          <i className="ti tabler-arrow-left"></i>
        </button>

        <div className="search-input-wrapper">
          <i className="ti tabler-search search-icon"></i>

          <input
            autoFocus
            type="search"
            className="form-control search-input"
            placeholder="جستجو در محصولات"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div
        className={`search-suggestions ${usingKeyboard ? "keyboard-nav" : ""}`}
      >
        {!query && recentSearches.length > 0 && (
          <>
            <div className="suggestion-header">
              <span className="suggestion-title">آخرین جستجوهای شما</span>

              <button
                className="clear-searches-btn"
                onClick={clearRecentSearches}
              >
                <i className="ti tabler-trash"></i>
              </button>
            </div>

            {recentSearches.map((item, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(item)}
              >
                <i className="ti tabler-history"></i>
                <span>{item}</span>
              </div>
            ))}
          </>
        )}

        {loading && debouncedQuery && (
          <div className="text-muted p-2">در حال جستجو...</div>
        )}

        {!loading &&
          debouncedQuery &&
          results.slice(0, 10).map((product, i) => (
            <div
              key={product.id}
              className={
                "suggestion-item " +
                (selectedIndex === i ? "bg-light text-primary " : "")
              }
              onMouseEnter={() => {
                setUsingKeyboard(false);
                setSelectedIndex(i);
              }}
              onClick={() => handleProductClick(product)}
            >
              <i className="ti tabler-search"></i>
              <span>{product.name}</span>
            </div>
          ))}

        {!loading && debouncedQuery && results.length === 0 && (
          <div className="text-muted p-2">محصولی پیدا نشد</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
