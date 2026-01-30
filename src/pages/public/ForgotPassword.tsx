import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateForgotPasswordForm } from "../../utils/validation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForgotPasswordForm(email);

    if (!validation.isValid) {
      setError(validation.errors.email || "");
      return;
    }

    console.log("Forgot password form submitted for email:", email);

    // In a real app, you would make an API call here
    // For now, navigate to reset-password with the email as state
    navigate("/reset-password", { state: { email } });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          {/* Forgot Password */}
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

              <h4 className="mb-1">Forgot Password? 🔒</h4>
              <p className="mb-6">
                Enter your email and we'll send you instructions to reset your
                password
              </p>

              <form className="mb-6" onSubmit={handleSubmit} noValidate>
                <div className="mb-6 form-control-validation">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    autoFocus
                  />
                  {error && (
                    <div className="fv-plugins-message-container invalid-feedback d-block">
                      <div className="fv-help-block">{error}</div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <button
                    className="btn btn-primary d-grid w-100"
                    type="submit"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>

              <div className="text-center">
                <Link
                  to="/login"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="icon-base ti tabler-chevron-left me-1"></i>
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
