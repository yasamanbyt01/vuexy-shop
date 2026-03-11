import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateLoginForm } from "../../utils/validation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLoginForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    console.log("✅ Login successful");
    // In a real app, you would make an API call here
    // Then redirect to home or dashboard
    navigate("/");
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
                    فروشگاه
                  </span>
                </Link>
              </div>
              {/* /Logo */}
              <h4 className="mb-1">به فروشگاه خوش آمدید 👋</h4>
              <p className="mb-6">برای ادامه لطفاً وارد حساب کاربری خود شوید</p>

              <form
                id="formAuthentication"
                className="mb-4"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="mb-6 form-control-validation">
                  <label htmlFor="email" className="form-label">
                    ایمیل یا نام کاربری
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    placeholder="ایمیل یا نام کاربری خود را وارد کنید"
                    value={formData.email}
                    onChange={handleChange}
                    autoFocus
                  />
                  {errors.email && (
                    <div className="fv-plugins-message-container invalid-feedback d-block">
                      <div className="fv-help-block">{errors.email}</div>
                    </div>
                  )}
                </div>

                <div className="mb-6 form-password-toggle form-control-validation">
                  <label className="form-label" htmlFor="password">
                    رمز عبور
                  </label>
                  <div
                    className={`input-group input-group-merge ${errors.password ? "is-invalid" : ""}`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
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
                  {errors.password && (
                    <div className="fv-plugins-message-container invalid-feedback d-block">
                      <div className="fv-help-block">{errors.password}</div>
                    </div>
                  )}
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
                        مرا به خاطر بسپار
                      </label>
                    </div>
                    <Link to="/forgot-password">
                      <p className="mb-0">رمز عبور را فراموش کرده‌اید؟</p>
                    </Link>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    className="btn btn-primary d-grid w-100"
                    type="submit"
                  >
                    ورود
                  </button>
                </div>
              </form>

              <p className="text-center">
                <span>حساب کاربری ندارید؟</span>
                <Link to="/register">
                  <span> ثبت‌نام کنید</span>
                </Link>
              </p>

              <div className="divider my-6">
                <div className="divider-text">یا</div>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
