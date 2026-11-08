import { useCallback, useEffect, useMemo, useState } from "react";
import "../../assets/css/admin-reviews.css";
import { useAuth } from "../../hooks/useAuth";
import {
  deleteAdminReview,
  getAdminReviews,
  updateAdminReviewStatus,
} from "../../services/reviews";
import type { AdminReview, ReviewStatus } from "../../types/reviews";

const PAGE_SIZE = 10;
const statusLabels: Record<ReviewStatus, string> = {
  pending: "در انتظار بررسی",
  approved: "منتشر شده",
  rejected: "رد شده",
};
const statusClasses: Record<ReviewStatus, string> = {
  pending: "bg-label-warning",
  approved: "bg-label-success",
  rejected: "bg-label-danger",
};
const dateLabel = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date);
};

const Reviews = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewPendingDeletion, setReviewPendingDeletion] =
    useState<AdminReview | null>(null);
  const [isDeleteModalClosing, setIsDeleteModalClosing] = useState(false);

  const closeReviewDeletion = useCallback(() => {
    if (
      !reviewPendingDeletion ||
      busyId === reviewPendingDeletion.id ||
      isDeleteModalClosing
    )
      return;
    setIsDeleteModalClosing(true);
  }, [reviewPendingDeletion, busyId, isDeleteModalClosing]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token) {
        setError("برای مدیریت نظرات باید با حساب مدیر وارد شوید.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const result = await getAdminReviews(token);
        if (active) setReviews(result);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت نظرات ناموفق بود.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [token, retry]);

  useEffect(() => {
    if (
      !reviewPendingDeletion ||
      busyId === reviewPendingDeletion.id ||
      isDeleteModalClosing
    )
      return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeReviewDeletion();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    reviewPendingDeletion,
    busyId,
    isDeleteModalClosing,
    closeReviewDeletion,
  ]);

  useEffect(() => {
    if (!isDeleteModalClosing) return;

    const timeoutId = window.setTimeout(() => {
      setReviewPendingDeletion(null);
      setIsDeleteModalClosing(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isDeleteModalClosing]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return reviews.filter((review) => {
      const matchesSearch =
        !term ||
        [
          review.id,
          String(review.productId),
          review.productName,
          String(review.userId),
          review.userName,
          review.comment,
        ].some((value) => value.toLocaleLowerCase().includes(term));
      return (
        matchesSearch &&
        (statusFilter === "all" || review.status === statusFilter)
      );
    });
  }, [reviews, search, statusFilter]);

  const stats = useMemo(() => {
    const approved = reviews.filter((review) => review.status === "approved");
    const pending = reviews.filter((review) => review.status === "pending");
    const rejected = reviews.filter((review) => review.status === "rejected");
    const average = approved.length
      ? approved.reduce((sum, review) => sum + review.rating, 0) /
        approved.length
      : 0;

    const starCounts: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    approved.forEach((review) => {
      const rating = Math.round(Number(review.rating));
      if (rating >= 1 && rating <= 5)
        starCounts[rating as 1 | 2 | 3 | 4 | 5] += 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      const count = reviews.filter((review) => {
        if (!review.createdAt) return false;
        const createdAt = new Date(review.createdAt);
        return (
          !Number.isNaN(createdAt.getTime()) &&
          createdAt.getFullYear() === day.getFullYear() &&
          createdAt.getMonth() === day.getMonth() &&
          createdAt.getDate() === day.getDate()
        );
      }).length;
      return {
        label: new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(
          day,
        ),
        count,
      };
    });

    const positiveCount = approved.filter(
      (review) => review.rating >= 4,
    ).length;
    const positivePercent = approved.length
      ? (positiveCount / approved.length) * 100
      : 0;

    return {
      total: reviews.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      average,
      starCounts,
      newThisWeek: weeklyActivity.reduce((sum, day) => sum + day.count, 0),
      positivePercent,
      weeklyActivity,
    };
  }, [reviews]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changeStatus = async (review: AdminReview, status: ReviewStatus) => {
    if (!token) return;
    setBusyId(review.id);
    setActionError("");
    setSuccess("");
    try {
      await updateAdminReviewStatus(token, review.id, status);
      setReviews((current) =>
        current.map((item) =>
          item.id === review.id ? { ...item, status } : item,
        ),
      );
      setSuccess(
        status === "approved"
          ? "نظر با موفقیت منتشر شد."
          : status === "rejected"
            ? "نظر رد شد."
            : "وضعیت نظر به‌روزرسانی شد.",
      );
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : "تغییر وضعیت نظر ناموفق بود.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const requestReviewDeletion = (review: AdminReview) => {
    setActionError("");
    setIsDeleteModalClosing(false);
    setReviewPendingDeletion(review);
  };

  const confirmReviewDeletion = async () => {
    const review = reviewPendingDeletion;
    if (!token || !review) return;

    setBusyId(review.id);
    setActionError("");
    setSuccess("");
    try {
      await deleteAdminReview(token, review.id);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      setIsDeleteModalClosing(true);
      setSuccess("نظر با موفقیت حذف شد.");
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : "حذف نظر ناموفق بود.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-page admin-reviews-page" dir="rtl">
      <div className="admin-page-heading">
        <div>
          <h2 className="mb-1">مدیریت نظرات</h2>
          <p className="text-body-secondary mb-0">
            بررسی، انتشار یا رد نظرات ثبت‌شده برای محصولات.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-label-secondary"
          onClick={() => setRetry((value) => value + 1)}
          disabled={loading}
        >
          <i className="icon-base ti tabler-refresh me-1" aria-hidden="true" />
          به‌روزرسانی
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          {
            label: "همه نظرات",
            value: stats.total,
            icon: "tabler-message-circle",
            tone: "primary",
          },
          {
            label: "در انتظار بررسی",
            value: stats.pending,
            icon: "tabler-clock",
            tone: "warning",
          },
          {
            label: "منتشر شده",
            value: stats.approved,
            icon: "tabler-circle-check",
            tone: "success",
          },
          {
            label: "رد شده",
            value: stats.rejected,
            icon: "tabler-circle-x",
            tone: "danger",
          },
        ].map((item) => (
          <div className="col-12 col-sm-6 col-xl-3" key={item.label}>
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span
                  className={`admin-review-stat-icon bg-label-${item.tone}`}
                  aria-hidden="true"
                >
                  <i className={`icon-base ti ${item.icon}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-body-secondary mb-1">{item.label}</p>
                  <h4 className="mb-0">{item.value.toLocaleString("fa-IR")}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4 admin-review-insights">
        <div className="col-12 col-xl-7">
          <section className="card h-100">
            <div className="card-header border-bottom">
              <h5 className="card-title mb-0">میانگین و توزیع امتیازها</h5>
            </div>
            <div className="card-body">
              <div className="row g-4 align-items-center">
                <div className="col-12 col-sm-4">
                  <div className="admin-review-average">
                    <div className="admin-review-average-value">
                      {stats.approved
                        ? stats.average.toLocaleString("fa-IR", {
                            maximumFractionDigits: 2,
                          })
                        : "—"}
                      <i
                        className="icon-base ti tabler-star-filled"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-body-secondary mb-1">میانگین امتیاز</p>
                    <strong>
                      {stats.approved.toLocaleString("fa-IR")} نظر منتشرشده
                    </strong>
                  </div>
                </div>
                <div className="col-12 col-sm-8">
                  <div className="admin-review-rating-breakdown">
                    {([5, 4, 3, 2, 1] as const).map((rating) => {
                      const count = stats.starCounts[rating];
                      const percent = stats.approved
                        ? (count / stats.approved) * 100
                        : 0;
                      return (
                        <div className="admin-review-rating-row" key={rating}>
                          <span className="admin-review-rating-label">
                            {rating.toLocaleString("fa-IR")} ستاره
                          </span>
                          <div
                            className="progress admin-review-rating-progress"
                            role="progressbar"
                            aria-label={`${rating} ستاره`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(percent)}
                          >
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="admin-review-rating-count">
                            {count.toLocaleString("fa-IR")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-5">
          <section className="card h-100">
            <div className="card-header border-bottom">
              <h5 className="card-title mb-0">آمار نظرات</h5>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="row g-3 mb-3">
                <div className="col-4">
                  <div className="admin-review-insight-metric">
                    <strong>{stats.newThisWeek.toLocaleString("fa-IR")}</strong>
                    <span>۷ روز اخیر</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="admin-review-insight-metric">
                    <strong>
                      {stats.approved
                        ? `${Math.round(stats.positivePercent).toLocaleString("fa-IR")}٪`
                        : "—"}
                    </strong>
                    <span>نظرات مثبت</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="admin-review-insight-metric">
                    <strong>{stats.pending.toLocaleString("fa-IR")}</strong>
                    <span>در انتظار</span>
                  </div>
                </div>
              </div>
              <div className="admin-review-weekly-wrap mt-auto">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small fw-medium">
                    روند ثبت نظر در ۷ روز گذشته
                  </span>
                  <span className="small text-body-secondary">
                    {stats.newThisWeek.toLocaleString("fa-IR")} نظر
                  </span>
                </div>
                <div
                  className="admin-review-weekly-chart"
                  role="img"
                  aria-label="تعداد نظرات ثبت‌شده در هر یک از هفت روز گذشته"
                >
                  {stats.weeklyActivity.map((day, index) => {
                    const maxCount = Math.max(
                      1,
                      ...stats.weeklyActivity.map((item) => item.count),
                    );
                    const height = day.count
                      ? Math.max(10, (day.count / maxCount) * 100)
                      : 3;
                    return (
                      <div
                        className="admin-review-weekly-day"
                        key={`${day.label}-${index}`}
                        title={`${day.label}: ${day.count.toLocaleString("fa-IR")} نظر`}
                      >
                        <span className="admin-review-weekly-count">
                          {day.count ? day.count.toLocaleString("fa-IR") : ""}
                        </span>
                        <div className="admin-review-weekly-track">
                          <div
                            className="admin-review-weekly-bar"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="admin-review-weekly-label">
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="card">
        <div className="card-header border-bottom admin-reviews-toolbar">
          <div>
            <h5 className="card-title mb-1">فهرست نظرات</h5>
            <p className="text-body-secondary small mb-0">
              {loading
                ? "در حال بارگذاری..."
                : `${filtered.length.toLocaleString("fa-IR")} نظر`}
              {!loading &&
                ` · میانگین امتیاز نظرات منتشرشده: ${stats.average.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} از ۵`}
            </p>
          </div>
          <div className="admin-reviews-filters">
            <div className="admin-reviews-search">
              <i className="icon-base ti tabler-search" aria-hidden="true" />
              <input
                className="form-control"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="جست‌وجوی محصول، مشتری یا متن نظر..."
                aria-label="جست‌وجوی نظرات"
              />
            </div>
            <select
              className="form-select admin-reviews-status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as "all" | ReviewStatus);
                setPage(1);
              }}
              aria-label="فیلتر وضعیت نظرات"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار بررسی</option>
              <option value="approved">منتشر شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>
        </div>

        {success && (
          <div className="alert alert-success mx-4 mt-4 mb-0" role="status">
            {success}
          </div>
        )}
        {(error || (actionError && !reviewPendingDeletion)) && (
          <div className="alert alert-danger mx-4 mt-4 mb-0" role="alert">
            {error || actionError}
            {error && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={() => setRetry((value) => value + 1)}
                disabled={loading}
              >
                تلاش دوباره
              </button>
            )}
          </div>
        )}

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" />
              <p className="text-body-secondary mb-0">در حال دریافت نظرات...</p>
            </div>
          ) : error ? null : visible.length === 0 ? (
            <div className="text-center py-5 px-3">
              <i
                className="icon-base ti tabler-message-circle-off icon-2xl text-body-secondary mb-3"
                aria-hidden="true"
              />
              <h6>نظری پیدا نشد</h6>
              <p className="text-body-secondary mb-0">
                عبارت جست‌وجو یا فیلتر وضعیت را تغییر دهید.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 admin-reviews-table">
                <thead>
                  <tr>
                    <th>محصول</th>
                    <th>نویسنده</th>
                    <th>نظر</th>
                    <th>امتیاز</th>
                    <th>تاریخ</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <div className="fw-medium">{review.productName}</div>
                        <small className="text-body-secondary">
                          شناسه محصول:{" "}
                          {review.productId.toLocaleString("fa-IR")}
                        </small>
                      </td>
                      <td>
                        <div className="fw-medium">{review.userName}</div>
                        <small className="text-body-secondary">
                          شناسه: {review.userId.toLocaleString("fa-IR")}
                        </small>
                      </td>
                      <td>
                        <div
                          className="admin-review-comment"
                          title={review.comment}
                        >
                          {review.comment}
                        </div>
                      </td>
                      <td className="text-nowrap">
                        <span
                          className="text-warning"
                          aria-label={`${review.rating} از ۵ ستاره`}
                        >
                          {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
                        </span>
                        <small className="text-body-secondary ms-1">
                          {review.rating.toLocaleString("fa-IR")}/۵
                        </small>
                      </td>
                      <td className="text-nowrap">
                        {dateLabel(review.createdAt)}
                      </td>
                      <td>
                        <span
                          className={`badge ${statusClasses[review.status]}`}
                        >
                          {statusLabels[review.status]}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1 admin-review-actions">
                          {review.status !== "approved" && (
                            <button
                              type="button"
                              className="btn btn-icon btn-text-success"
                              title="انتشار نظر"
                              aria-label="انتشار نظر"
                              disabled={busyId === review.id}
                              onClick={() =>
                                void changeStatus(review, "approved")
                              }
                            >
                              <i className="icon-base ti tabler-check" />
                            </button>
                          )}
                          {review.status !== "rejected" && (
                            <button
                              type="button"
                              className="btn btn-icon btn-text-danger"
                              title="رد نظر"
                              aria-label="رد نظر"
                              disabled={busyId === review.id}
                              onClick={() =>
                                void changeStatus(review, "rejected")
                              }
                            >
                              <i className="icon-base ti tabler-x" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-icon btn-text-secondary"
                            title="حذف نظر"
                            aria-label="حذف نظر"
                            disabled={busyId === review.id}
                            onClick={() => requestReviewDeletion(review)}
                          >
                            <i className="icon-base ti tabler-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && filtered.length > 0 && (
          <div className="card-footer admin-reviews-pagination">
            <div className="admin-reviews-pagination-content d-flex flex-wrap align-items-center justify-content-between gap-2">
              <small className="text-body-secondary">
                نمایش{" "}
                {Math.min(
                  (currentPage - 1) * PAGE_SIZE + 1,
                  filtered.length,
                ).toLocaleString("fa-IR")}{" "}
                تا{" "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length,
                ).toLocaleString("fa-IR")}{" "}
                از {filtered.length.toLocaleString("fa-IR")} نظر
              </small>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-label-secondary btn-sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  قبلی
                </button>
                <span className="small text-body-secondary">
                  {currentPage.toLocaleString("fa-IR")} /{" "}
                  {totalPages.toLocaleString("fa-IR")}
                </span>
                <button
                  type="button"
                  className="btn btn-label-secondary btn-sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setPage((value) => Math.min(totalPages, value + 1))
                  }
                >
                  بعدی
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {reviewPendingDeletion && (
        <div
          className={`admin-review-delete-overlay${isDeleteModalClosing ? " is-closing" : ""}`}
          role="presentation"
          onClick={closeReviewDeletion}
        >
          <section
            className="card admin-review-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-review-delete-title"
            aria-describedby="admin-review-delete-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="card-body p-4">
              <div className="admin-review-delete-icon mb-3">
                <i className="icon-base ti tabler-trash" aria-hidden="true" />
              </div>
              <h5 id="admin-review-delete-title" className="mb-2">
                حذف دائمی نظر
              </h5>
              <p
                id="admin-review-delete-description"
                className="text-body-secondary mb-3"
              >
                آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست.
              </p>
              <div className="admin-review-delete-summary mb-4">
                <div className="fw-medium">
                  {reviewPendingDeletion.userName} ·{" "}
                  {reviewPendingDeletion.productName}
                </div>
                <div className="small text-body-secondary admin-review-delete-comment">
                  {reviewPendingDeletion.comment}
                </div>
              </div>
              {actionError && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {actionError}
                </div>
              )}
              <div className="d-flex justify-content-end flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={closeReviewDeletion}
                  disabled={
                    busyId === reviewPendingDeletion.id || isDeleteModalClosing
                  }
                  autoFocus
                >
                  انصراف
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => void confirmReviewDeletion()}
                  disabled={
                    busyId === reviewPendingDeletion.id || isDeleteModalClosing
                  }
                >
                  {busyId === reviewPendingDeletion.id ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      در حال حذف...
                    </>
                  ) : (
                    <>
                      <i
                        className="icon-base ti tabler-trash me-1"
                        aria-hidden="true"
                      />
                      حذف دائمی
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Reviews;
