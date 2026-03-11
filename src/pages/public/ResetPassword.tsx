import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateResetPasswordForm } from "../../utils/validation";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

    // Clear confirm password error if both fields match
    if (
      name === "confirmPassword" &&
      errors.confirmPassword &&
      value === formData.password
    ) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateResetPasswordForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    console.log("Reset password form submitted:", formData);

    // In a real app, you would make an API call here
    // Then redirect to login page
    alert("رمز عبور با موفقیت تغییر کرد.");
    navigate("/login");
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
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
                        {/* Logo SVG */}
                      </svg>
                    </span>
                  </span>
                  <span className="app-brand-text demo text-heading fw-bold">
                    فروشگاه
                  </span>
                </Link>
              </div>

              <h4 className="mb-1">تنظیم رمز عبور جدید 🔒</h4>
              <p className="mb-6">
                <span className="fw-medium">
                  رمز عبور جدید باید با رمزهای قبلی شما متفاوت باشد
                </span>
              </p>

              <form id="formAuthentication" onSubmit={handleSubmit} noValidate>
                <div className="mb-6 form-password-toggle form-control-validation">
                  <label className="form-label" htmlFor="password">
                    رمز عبور جدید
                  </label>
                  <div
                    className={`input-group input-group-merge ${errors.password ? "is-invalid" : ""}`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      name="password"
                      placeholder="••••••••••••"
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

                <div className="mb-6 form-password-toggle form-control-validation">
                  <label className="form-label" htmlFor="confirm-password">
                    تکرار رمز عبور
                  </label>
                  <div
                    className={`input-group input-group-merge ${errors.confirmPassword ? "is-invalid" : ""}`}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      name="confirmPassword"
                      placeholder="••••••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span
                      className="input-group-text cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`icon-base ti ${showConfirmPassword ? "tabler-eye" : "tabler-eye-off"}`}
                      ></i>
                    </span>
                  </div>
                  {errors.confirmPassword && (
                    <div className="fv-plugins-message-container invalid-feedback d-block">
                      <div className="fv-help-block">
                        {errors.confirmPassword}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary d-grid w-100 mb-6"
                  type="submit"
                >
                  ثبت رمز عبور جدید
                </button>

                <div className="text-center">
                  <Link to="/login" className="d-flex justify-content-center">
                    بازگشت به صفحه ورود
                    <i className="icon-base ti tabler-chevron-right scaleX-n1-rtl ms-1_5"></i>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
