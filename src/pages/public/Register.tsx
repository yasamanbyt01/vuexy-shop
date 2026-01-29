import { Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          {/* Register Card */}
          <div className="card">
            <div className="card-body">
              {/* Logo */}
              <div className="app-brand justify-content-center mb-6">
                <span className="app-brand-text demo text-heading fw-bold">
                  Vuexy Shop
                </span>
              </div>

              <h4 className="mb-1">Adventure starts here 🚀</h4>
              <p className="mb-6">Create your account</p>

              <form className="mb-6">
                <div className="mb-6">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-6 form-password-toggle">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      placeholder="••••••••"
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
                  <div className="form-check ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to <a href="#">privacy policy & terms</a>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary d-grid w-100">
                  Sign up
                </button>
              </form>
              <p className="text-center">
                <span>Already have an account?</span>{" "}
                <Link to="/login">Sign in instead</Link>
              </p>

              <div className="divider my-6">
                <div className="divider-text">or</div>
              </div>

              <div className="d-flex justify-content-center">
                <button className="btn btn-icon rounded-circle btn-text-facebook me-2">
                  <i className="icon-base ti tabler-brand-facebook-filled"></i>
                </button>

                <button className="btn btn-icon rounded-circle btn-text-twitter me-1_5">
                  <i className="icon-base ti tabler-brand-twitter-filled icon-20px"></i>
                </button>

                <button className="btn btn-icon rounded-circle btn-text-github">
                  <i className="icon-base ti tabler-brand-github-filled"></i>
                </button>

                <button className="btn btn-icon rounded-circle btn-text-google-plus">
                  <i className="icon-base ti tabler-brand-google-filled icon-20px"></i>
                </button>
              </div>
            </div>
          </div>
          {/* /Register Card */}
        </div>
      </div>
    </div>
  );
};

export default Register;
