import { Link } from "react-router-dom";

const Categories = () => (
  <div className="admin-page" dir="rtl">
    <div className="admin-page-heading">
      <div>
        <h2 className="mb-1">دسته‌بندی‌ها</h2>
        <p className="text-body-secondary mb-0">
          این بخش در مرحله بعد به API دسته‌بندی‌ها متصل می‌شود.
        </p>
      </div>
    </div>
    <div className="card">
      <div className="card-body text-center py-5">
        <div className="avatar avatar-xl mx-auto mb-3">
          <span className="avatar-initial rounded bg-label-primary">
            <i
              className="icon-base ti tabler-category icon-2xl"
              aria-hidden="true"
            />
          </span>
        </div>
        <h4 className="mb-2">مدیریت دسته‌بندی‌ها در مرحله بعد</h4>
        <p className="text-body-secondary mb-4 mx-auto admin-placeholder-copy">
          سرویس و API دسته‌بندی‌ها در پروژه وجود دارند. در مرحله بعد، جدول
          دسته‌بندی‌ها، فرم افزودن و ویرایش، و حذف ایمن را پیاده‌سازی می‌کنیم.
        </p>
        <Link to="/admin" className="btn btn-primary">
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  </div>
);

export default Categories;
