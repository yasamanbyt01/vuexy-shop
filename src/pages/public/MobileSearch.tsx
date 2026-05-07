import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../../mock/products";
import type { Product } from "../../types/products";

const SearchPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [usingKeyboard, setUsingKeyboard] = useState(false);

  const submitSearch = () => {
    if (!query.trim()) return;
    saveSearch(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // save search
  const saveSearch = (term: string) => {
    if (!term.trim()) return;

    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const results = products.filter((p: Product) =>
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const handleProductClick = (p: Product) => {
    saveSearch(p.name);
    navigate(`/products/${p.id}`);
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
      {/* header */}
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

      {/* suggestions */}
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

        {debouncedQuery &&
          results.slice(0, 10).map((p, i) => (
            <div
              key={p.id}
              className={
                "suggestion-item " +
                (selectedIndex === i ? "bg-light text-primary " : "")
              }
              onMouseEnter={() => {
                setUsingKeyboard(false);
                setSelectedIndex(i);
              }}
              onClick={() => handleProductClick(p)}
            >
              <i className="ti tabler-search"></i>
              <span>{p.name}</span>
            </div>
          ))}

        {debouncedQuery && results.length === 0 && (
          <div className="text-muted p-2">محصولی پیدا نشد</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
