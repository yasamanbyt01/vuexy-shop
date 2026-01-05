const Home = () => {
  return (
    <main>
      {/* Hero */}
      <section className="py-10 bg-light">
        <div className="container">
          <h1 className="fw-bold mb-3">Discover amazing products</h1>
          <p className="text-muted">
            Shop the best products across all categories
          </p>
        </div>
      </section>

      {/* Categories preview */}
      <section className="py-8">
        <div className="container">
          <h4 className="fw-semibold mb-4">Shop by category</h4>
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card text-center p-4">Category {i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-8 bg-body-secondary">
        <div className="container">
          <h4 className="fw-semibold mb-4">Featured products</h4>
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card p-3">Product {i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
