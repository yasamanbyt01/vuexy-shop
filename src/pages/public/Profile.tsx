import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import profileBanner from "../../assets/img/pages/profile-banner.png";

import "../../assets/vendor/css/pages/page-profile.css";

const Profile = () => {
  const { user } = useAuth();

  // The profile should only be accessible to authenticated users.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user.name.trim() || "کاربر";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  const roleLabel = user.role === "admin" ? "مدیر" : "کاربر";

  return (
    <main className="container-xxl flex-grow-1 container-p-y">
      {/* Profile header */}
      <div className="row">
        <div className="col-12">
          <div className="card mb-6">
            <div className="user-profile-header-banner">
              <img
                src={profileBanner}
                alt=""
                aria-hidden="true"
                className="rounded-top"
              />
            </div>

            <div className="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-5">
              <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                <div
                  className="user-profile-img profile-avatar-initials rounded d-flex align-items-center justify-content-center"
                  role="img"
                  aria-label={`آواتار ${displayName}`}
                >
                  {initials}
                </div>
              </div>

              <div className="flex-grow-1 mt-3 mt-lg-5">
                <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-4 flex-md-row flex-column gap-4">
                  <div className="user-profile-info">
                    <h4 className="mb-2 mt-lg-6">{displayName}</h4>

                    <ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 my-2">
                      <li className="list-inline-item d-flex gap-2 align-items-center">
                        <i className="icon-base ti tabler-mail icon-lg" />
                        <span className="fw-medium text-break" dir="ltr">
                          {user.email}
                        </span>
                      </li>

                      <li className="list-inline-item d-flex gap-2 align-items-center">
                        <i className="icon-base ti tabler-user-check icon-lg" />
                        <span className="fw-medium">{roleLabel}</span>
                      </li>
                    </ul>
                  </div>

                  <Link to="/products" className="btn btn-primary mb-1">
                    <i className="icon-base ti tabler-shopping-bag icon-xs me-2" />
                    ادامه خرید
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="row">
        {/* Account information */}
        <div className="col-12 col-lg-5">
          <div className="card mb-6">
            <div className="card-body">
              <h5 className="card-title mb-4">اطلاعات حساب کاربری</h5>

              <ul className="list-unstyled my-3 py-1 mb-0">
                <li className="d-flex align-items-start flex-wrap mb-4">
                  <i className="icon-base ti tabler-user icon-lg" />

                  <span className="fw-medium mx-2">نام کامل:</span>

                  <span>{displayName}</span>
                </li>

                <li className="d-flex align-items-start flex-wrap mb-4">
                  <i className="icon-base ti tabler-mail icon-lg" />

                  <span className="fw-medium mx-2">ایمیل:</span>

                  <span className="text-break" dir="ltr">
                    {user.email}
                  </span>
                </li>

                <li className="d-flex align-items-start flex-wrap">
                  <i className="icon-base ti tabler-shield-check icon-lg" />

                  <span className="fw-medium mx-2">نوع حساب:</span>

                  <span>{roleLabel}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Account actions */}
        <div className="col-12 col-lg-7">
          <div className="card mb-6 h-100">
            <div className="card-body">
              <h5 className="card-title mb-2">به فروشگاه خوش آمدید!</h5>

              <p className="text-body-secondary mb-5">
                از این بخش می‌توانید به فروشگاه برگردید یا به سبد خرید خود
                دسترسی داشته باشید.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-primary">
                  <i className="icon-base ti tabler-shopping-bag me-2" />
                  مشاهده محصولات
                </Link>

                <Link to="/checkout" className="btn btn-outline-primary">
                  <i className="icon-base ti tabler-shopping-cart me-2" />
                  سبد خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
