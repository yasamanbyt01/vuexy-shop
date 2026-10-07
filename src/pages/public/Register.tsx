import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateRegisterForm } from "../../utils/validation";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    terms?: string;
  }>({});

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateRegisterForm(formData);

    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await register({
        name: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "ثبت‌نام انجام نشد";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center mb-6">
                <span className="app-brand-text demo text-heading fw-bold">
                  فروشگاه
                </span>
              </div>

              <h4 className="mb-1">همین‌جا شروع کن 🚀</h4>
              <p className="mb-6">ساخت حساب کاربری جدید</p>

              {submitError && (
                <div className="alert alert-danger" role="alert">
                  {submitError}
                </div>
              )}

              <form className="mb-6" onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <label htmlFor="username" className="form-label">
                    نام کاربری
                  </label>

                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="نام کاربری خود را وارد کنید"
                    value={formData.username}
                    onChange={handleChange}
                  />

                  {errors.username && (
                    <div className="fv-plugins-message-container invalid-feedback d-block">
                      <div className="fv-help-block">{errors.username}</div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="form-label">
                    ایمیل
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="ایمیل خود را وارد کنید"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  {errors.email && (
                    <div className="fv-plugins-message-container invalid-feedback d-block">
                      <div className="fv-help-block">{errors.email}</div>
                    </div>
                  )}
                </div>

                <div className="mb-6 form-password-toggle">
                  <label htmlFor="password" className="form-label">
                    رمز عبور
                  </label>

                  <div
                    className={`input-group input-group-merge ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
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
                        className={`icon-base ti ${
                          showPassword ? "tabler-eye" : "tabler-eye-off"
                        }`}
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
                  <div className="form-check ms-2">
                    <input
                      className={`form-check-input ${
                        errors.terms ? "is-invalid" : ""
                      }`}
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                    />

                    <label className="form-check-label" htmlFor="terms">
                      <a href="#">با قوانین و سیاست حفظ حریم خصوصی</a> موافقم
                    </label>

                    {errors.terms && (
                      <div className="fv-plugins-message-container invalid-feedback d-block">
                        <div className="fv-help-block">{errors.terms}</div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-grid w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
                </button>
              </form>

              <p className="text-center">
                <span>قبلاً ثبت‌نام کرده‌اید؟</span>{" "}
                <Link to="/login">ورود به حساب</Link>
              </p>

              <div className="divider my-6">
                <div className="divider-text">یا</div>
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
        </div>
      </div>
    </div>
  );
};

export default Register;
