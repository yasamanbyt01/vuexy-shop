const PublicFooter = () => {
  return (
    <footer className="landing-footer bg-body footer-text">
      {/* Footer Top */}
      <div className="footer-top position-relative overflow-hidden z-1">
        <img
          src="/src/assets/img/front-pages/backgrounds/footer-bg.png"
          alt="footer bg"
          className="footer-bg banner-bg-img z-n1"
        />

        <div className="container">
          <div className="row gx-0 gy-6 g-lg-10">
            {/* Brand & Newsletter */}
            <div className="col-lg-5">
              <a href="#" className="app-brand-link mb-6">
                <span className="app-brand-logo demo">
                  <span className="text-primary">
                    {/* SVG logo kept as-is */}
                    <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>
                <span className="app-brand-text demo footer-link fw-bold ms-2 ps-1">
                  Vuexy
                </span>
              </a>

              <p className="footer-text footer-logo-description mb-6">
                Most developer friendly & highly customisable Admin Dashboard
                Template.
              </p>

              <form className="footer-form">
                <label htmlFor="footer-email" className="small">
                  Subscribe to newsletter
                </label>
                <div className="d-flex mt-1">
                  <input
                    type="email"
                    className="form-control rounded-0 rounded-start-bottom rounded-start-top"
                    id="footer-email"
                    placeholder="Your email"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary shadow-none rounded-0 rounded-end-bottom rounded-end-top"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

            {/* Demos */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-6">Demos</h6>
              <ul className="list-unstyled">
                <li className="mb-4">
                  <a href="#" className="footer-link">
                    Vertical Layout
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="footer-link">
                    Horizontal Layout
                  </a>
                </li>
              </ul>
            </div>

            {/* Pages */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-6">Pages</h6>
              <ul className="list-unstyled">
                <li className="mb-4">
                  <a href="#" className="footer-link">
                    Pricing
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="footer-link">
                    Checkout
                  </a>
                </li>
              </ul>
            </div>

            {/* App download */}
            <div className="col-lg-3 col-md-4">
              <h6 className="footer-title mb-6">Download our app</h6>
              <a href="#" className="d-block mb-4">
                <img
                  src="/src/assets/img/front-pages/landing-page/apple-icon.png"
                  alt="apple icon"
                />
              </a>
              <a href="#" className="d-block">
                <img
                  src="/src/assets/img/front-pages/landing-page/google-play-icon.png"
                  alt="google play icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom py-3 py-md-5">
        <div className="container d-flex flex-wrap justify-content-between flex-md-row flex-column text-center text-md-start">
          <div className="mb-2 mb-md-0">
            <span className="footer-bottom-text">
              © {new Date().getFullYear()} Pixinvent, Made with ❤️ for a better
              web.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
