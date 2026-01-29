import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login form submitted");
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          {/* Login */}
          <div className="card">
            <div className="card-body">
              {/* Logo */}
              <div className="app-brand justify-content-center mb-6">
                <Link to="/" className="app-brand-link">
                  <span className="app-brand-logo demo">
                    <span className="text-primary">
                      <svg
                        width="32"
                        height="22"
                        viewBox="0 0 32 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                          fill="currentColor"
                        />
                        <path
                          opacity="0.06"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                          fill="#161616"
                        />
                        <path
                          opacity="0.06"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                          fill="#161616"
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
                  <span className="app-brand-text demo text-heading fw-bold">
                    Vuexy Shop
                  </span>
                </Link>
              </div>
              {/* /Logo */}
              <h4 className="mb-1">Welcome to Vuexy Shop! 👋</h4>
              <p className="mb-6">
                Please sign-in to your account and start the adventure
              </p>

              <form
                id="formAuthentication"
                className="mb-4"
                onSubmit={handleSubmit}
              >
                <div className="mb-6 form-control-validation">
                  <label htmlFor="email" className="form-label">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email-username"
                    placeholder="Enter your email or username"
                    autoFocus
                  />
                </div>
                <div className="mb-6 form-password-toggle form-control-validation">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="••••••••"
                      aria-describedby="password"
                    />
                    <span
                      className="input-group-text cursor-pointer"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`icon-base ti ${showPassword ? "tabler-eye" : "tabler-eye-off"}`}
                      ></i>
                    </span>
                  </div>
                </div>
                <div className="my-8">
                  <div className="d-flex justify-content-between">
                    <div className="form-check mb-0 ms-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="remember-me">
                        {" "}
                        Remember Me{" "}
                      </label>
                    </div>
                    <Link to="/forgot-password">
                      <p className="mb-0">Forgot Password?</p>
                    </Link>
                  </div>
                </div>
                <div className="mb-6">
                  <button
                    className="btn btn-primary d-grid w-100"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>

              <p className="text-center">
                <span>New on our platform?</span>
                <Link to="/register">
                  <span> Create an account</span>
                </Link>
              </p>

              <div className="divider my-6">
                <div className="divider-text">or</div>
              </div>

              <div className="d-flex justify-content-center">
                <button className="btn btn-icon rounded-circle btn-text-facebook me-1_5">
                  <i className="icon-base ti tabler-brand-facebook-filled icon-20px"></i>
                </button>

                <button className="btn btn-icon rounded-circle btn-text-twitter me-1_5">
                  <i className="icon-base ti tabler-brand-twitter-filled icon-20px"></i>
                </button>

                <button className="btn btn-icon rounded-circle btn-text-github me-1_5">
                  <i className="icon-base ti tabler-brand-github-filled icon-20px"></i>
                </button>

                <button className="btn btn-icon rounded-circle btn-text-google-plus">
                  <i className="icon-base ti tabler-brand-google-filled icon-20px"></i>
                </button>
              </div>
            </div>
          </div>
          {/* /Login */}
        </div>
      </div>
    </div>
  );
};

export default Login;
