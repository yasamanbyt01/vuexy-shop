import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCategories, type ApiCategory } from "../../services/categories";
import {
  createProduct,
  getProductById,
  getProductImageUrl,
  updateProduct,
  type ApiProduct,
  type ProductColor,
  type ProductWritePayload,
} from "../../services/products";

interface SpecificationRow {
  key: string;
  value: string;
}

interface ProductFormState {
  name: string;
  sku: string;
  seller: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  rating: string;
  stockCount: string;
  description: string;
  longDescription: string;
  imagesText: string;
  featuresText: string;
  sizesText: string;
  tagsText: string;
  colors: ProductColor[];
  specifications: SpecificationRow[];
  shippingFreeOver: string;
  shippingDelivery: string;
  shippingReturns: string;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  sku: "",
  seller: "",
  categoryId: "",
  price: "",
  originalPrice: "",
  rating: "",
  stockCount: "0",
  description: "",
  longDescription: "",
  imagesText: "",
  featuresText: "",
  sizesText: "",
  tagsText: "",
  colors: [],
  specifications: [{ key: "", value: "" }],
  shippingFreeOver: "0",
  shippingDelivery: "",
  shippingReturns: "",
};

function linesToArray(value: string): string[] {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function productToForm(product: ApiProduct): ProductFormState {
  const specifications = Object.entries(product.specifications ?? {}).map(([key, value]) => ({ key, value: String(value) }));
  return {
    name: product.name ?? "",
    sku: product.sku ?? "",
    seller: product.seller ?? "",
    categoryId: String(product.category?.id ?? ""),
    price: String(product.price ?? ""),
    originalPrice: product.originalPrice == null ? "" : String(product.originalPrice),
    rating: product.rating == null ? "" : String(product.rating),
    stockCount: String(product.stockCount ?? 0),
    description: product.description ?? "",
    longDescription: product.longDescription ?? "",
    imagesText: (product.images ?? []).join("\n"),
    featuresText: (product.features ?? []).join("\n"),
    sizesText: (product.sizes ?? []).join("\n"),
    tagsText: (product.tags ?? []).join("\n"),
    colors: product.colors ?? [],
    specifications: specifications.length ? specifications : [{ key: "", value: "" }],
    shippingFreeOver: String(product.shippingInfo?.freeOver ?? 0),
    shippingDelivery: product.shippingInfo?.delivery ?? "",
    shippingReturns: product.shippingInfo?.returns ?? "",
  };
}

const ProductForm = () => {
  const { id } = useParams();
  const productId = id ? Number(id) : null;
  const isEditing = productId !== null && Number.isInteger(productId) && productId > 0;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(Boolean(isEditing));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const categoryResult = await getCategories();
        let productResult: ApiProduct | null = null;
        if (isEditing && productId !== null) productResult = await getProductById(productId);
        if (cancelled) return;
        setCategories(categoryResult);
        setForm(productResult ? productToForm(productResult) : { ...EMPTY_FORM, specifications: [{ key: "", value: "" }] });
      } catch (requestError) {
        if (!cancelled) setLoadError(requestError instanceof Error ? requestError.message : "دریافت اطلاعات فرم ناموفق بود.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (id && !isEditing) {
      setLoadError("شناسه محصول معتبر نیست.");
      setLoading(false);
      return;
    }
    void load();
    return () => { cancelled = true; };
  }, [id, isEditing, productId]);

  const updateField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("نشست مدیر معتبر نیست. لطفاً دوباره وارد شوید.");
      return;
    }

    if (form.price.trim() === "") {
      setError("قیمت فروش الزامی است.");
      return;
    }
    if (form.stockCount.trim() === "") {
      setError("وارد کردن تعداد موجودی الزامی است.");
      return;
    }
    if (form.shippingFreeOver.trim() === "") {
      setError("حداقل مبلغ ارسال رایگان الزامی است.");
      return;
    }

    const price = Number(form.price);
    const stockCount = Number(form.stockCount);
    const categoryId = Number(form.categoryId);
    const shippingFreeOver = Number(form.shippingFreeOver);
    const rating = form.rating.trim() === "" ? undefined : Number(form.rating);
    const originalPrice = form.originalPrice.trim() === "" ? null : Number(form.originalPrice);

    if (!Number.isFinite(price) || price < 0) {
      setError("قیمت فروش باید عددی صفر یا بزرگ‌تر باشد.");
      return;
    }
    if (!Number.isInteger(stockCount) || stockCount < 0) {
      setError("موجودی باید عدد صحیح صفر یا بزرگ‌تر باشد.");
      return;
    }
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      setError("یک دسته‌بندی معتبر انتخاب کنید.");
      return;
    }
    if (!Number.isFinite(shippingFreeOver) || shippingFreeOver < 0) {
      setError("حداقل مبلغ ارسال رایگان باید عددی صفر یا بزرگ‌تر باشد.");
      return;
    }
    if (rating !== undefined && (!Number.isFinite(rating) || rating < 0 || rating > 5)) {
      setError("امتیاز باید بین صفر و پنج باشد.");
      return;
    }
    if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice < 0)) {
      setError("قیمت قبل از تخفیف باید صفر یا بزرگ‌تر باشد.");
      return;
    }

    const colors = form.colors.filter((color) => color.name.trim() || color.value.trim() || color.hex.trim());
    if (colors.some((color) => !color.name.trim() || !color.value.trim() || !color.hex.trim())) {
      setError("برای هر رنگ، نام، مقدار و کد رنگ را کامل کنید یا ردیف خالی را حذف کنید.");
      return;
    }

    const specifications = Object.fromEntries(
      form.specifications.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value.trim()]),
    );

    const payload: ProductWritePayload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      seller: form.seller.trim(),
      categoryId,
      price,
      originalPrice,
      ...(rating !== undefined ? { rating } : {}),
      stockCount,
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      images: linesToArray(form.imagesText),
      features: linesToArray(form.featuresText),
      sizes: linesToArray(form.sizesText),
      tags: linesToArray(form.tagsText),
      colors,
      specifications,
      shippingInfo: {
        freeOver: shippingFreeOver,
        delivery: form.shippingDelivery.trim(),
        returns: form.shippingReturns.trim(),
      },
    };

    if (!payload.name || !payload.sku || !payload.seller || !payload.description || !payload.longDescription || !payload.shippingInfo.delivery || !payload.shippingInfo.returns) {
      setError("فیلدهای نام، SKU، فروشنده، توضیحات، توضیحات کامل و اطلاعات ارسال و بازگشت الزامی هستند.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && productId !== null) {
        await updateProduct(token, productId, payload);
        navigate("/admin/products", { replace: true, state: { adminSuccess: "محصول با موفقیت ویرایش شد." } });
      } else {
        await createProduct(token, payload);
        navigate("/admin/products", { replace: true, state: { adminSuccess: "محصول جدید با موفقیت ایجاد شد." } });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "ذخیره محصول ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-page text-center py-5" dir="rtl" role="status"><div className="spinner-border text-primary mb-3" aria-hidden="true" /><p className="text-body-secondary mb-0">در حال دریافت اطلاعات محصول...</p></div>;
  }

  return (
    <div className="admin-page" dir="rtl">
      <div className="admin-page-heading">
        <div><h2 className="mb-1">{isEditing ? "ویرایش محصول" : "افزودن محصول جدید"}</h2><p className="text-body-secondary mb-0">اطلاعات محصول را وارد کنید. فیلدهای ستاره‌دار الزامی هستند.</p></div>
        <Link to="/admin/products" className="btn btn-label-secondary"><i className="icon-base ti tabler-arrow-right me-1" aria-hidden="true" />بازگشت به محصولات</Link>
      </div>

      {loadError && <div className="alert alert-danger" role="alert">{loadError}</div>}
      {!loadError && categories.length === 0 && <div className="alert alert-warning" role="alert">برای ثبت محصول، ابتدا باید حداقل یک دسته‌بندی ایجاد کنید. <Link to="/admin/categories" className="alert-link">مدیریت دسته‌بندی‌ها</Link></div>}
      {!loadError && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            <div className="col-12 col-xl-8">
              <section className="card mb-4">
                <div className="card-header"><h5 className="card-title mb-0">اطلاعات محصول</h5></div>
                <div className="card-body"><div className="row g-3">
                  <div className="col-12"><label htmlFor="product-name" className="form-label">نام محصول *</label><input id="product-name" className="form-control" value={form.name} onChange={(event) => updateField("name", event.target.value)} required /></div>
                  <div className="col-12 col-md-6"><label htmlFor="product-sku" className="form-label">SKU *</label><input id="product-sku" className="form-control" value={form.sku} onChange={(event) => updateField("sku", event.target.value)} dir="ltr" required /><small className="text-body-secondary">باید در کل محصولات یکتا باشد.</small></div>
                  <div className="col-12 col-md-6"><label htmlFor="product-seller" className="form-label">فروشنده *</label><input id="product-seller" className="form-control" value={form.seller} onChange={(event) => updateField("seller", event.target.value)} required /></div>
                  <div className="col-12"><label htmlFor="product-description" className="form-label">توضیح کوتاه *</label><textarea id="product-description" className="form-control" rows={2} value={form.description} onChange={(event) => updateField("description", event.target.value)} required /></div>
                  <div className="col-12"><label htmlFor="product-long-description" className="form-label">توضیحات کامل *</label><textarea id="product-long-description" className="form-control" rows={5} value={form.longDescription} onChange={(event) => updateField("longDescription", event.target.value)} required /></div>
                </div></div>
              </section>

              <section className="card mb-4">
                <div className="card-header"><h5 className="card-title mb-0">تصاویر محصول</h5></div>
                <div className="card-body">
                  <label htmlFor="product-images" className="form-label">مسیر یا URL تصاویر</label>
                  <textarea id="product-images" className="form-control" rows={4} dir="ltr" placeholder="https://example.com/product.jpg&#10;/uploads/products/product-1.jpg" value={form.imagesText} onChange={(event) => updateField("imagesText", event.target.value)} />
                  <small className="text-body-secondary d-block mt-2">هر تصویر را در یک خط وارد کنید. بارگذاری مستقیم فایل در API فعلی پیاده‌سازی نشده است.</small>
                  {linesToArray(form.imagesText).length > 0 && <div className="d-flex flex-wrap gap-2 mt-3">{linesToArray(form.imagesText).map((image, index) => <img key={`${image}-${index}`} className="admin-product-thumb admin-product-form-image" src={getProductImageUrl(image)} alt={`پیش‌نمایش ${index + 1}`} />)}</div>}
                </div>
              </section>

              <section className="card mb-4">
                <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><h5 className="card-title mb-0">رنگ‌ها و گزینه‌ها</h5><button type="button" className="btn btn-label-primary btn-sm" onClick={() => updateField("colors", [...form.colors, { name: "", value: "", hex: "#000000" }])}><i className="icon-base ti tabler-plus me-1" aria-hidden="true" />افزودن رنگ</button></div>
                <div className="card-body">
                  {form.colors.length === 0 ? <p className="text-body-secondary small mb-0">برای محصول بدون گزینه رنگ، این بخش را خالی بگذارید.</p> : <div className="d-grid gap-3">{form.colors.map((color, index) => <div className="row g-2 align-items-end" key={`color-${index}`}>
                    <div className="col-12 col-md-4"><label className="form-label" htmlFor={`color-name-${index}`}>نام رنگ</label><input id={`color-name-${index}`} className="form-control" value={color.name} onChange={(event) => updateField("colors", form.colors.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} /></div>
                    <div className="col-6 col-md-4"><label className="form-label" htmlFor={`color-value-${index}`}>مقدار/شناسه</label><input id={`color-value-${index}`} className="form-control" value={color.value} onChange={(event) => updateField("colors", form.colors.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} /></div>
                    <div className="col-4 col-md-3"><label className="form-label" htmlFor={`color-hex-${index}`}>کد رنگ</label><input id={`color-hex-${index}`} type="text" className="form-control" dir="ltr" value={color.hex} onChange={(event) => updateField("colors", form.colors.map((item, i) => i === index ? { ...item, hex: event.target.value } : item))} /></div>
                    <div className="col-2 col-md-1"><button type="button" className="btn btn-icon btn-label-danger" aria-label="حذف رنگ" onClick={() => updateField("colors", form.colors.filter((_, i) => i !== index))}><i className="icon-base ti tabler-trash" aria-hidden="true" /></button></div>
                  </div>)}</div>}
                </div>
              </section>

              <section className="card mb-4">
                <div className="card-header"><h5 className="card-title mb-0">ویژگی‌ها و مشخصات</h5></div>
                <div className="card-body"><div className="row g-3">
                  <div className="col-12 col-md-6"><label htmlFor="product-features" className="form-label">ویژگی‌ها</label><textarea id="product-features" className="form-control" rows={4} placeholder="هر ویژگی در یک خط" value={form.featuresText} onChange={(event) => updateField("featuresText", event.target.value)} /></div>
                  <div className="col-12 col-md-6"><label htmlFor="product-sizes" className="form-label">سایزها</label><textarea id="product-sizes" className="form-control" rows={4} placeholder="هر سایز در یک خط" value={form.sizesText} onChange={(event) => updateField("sizesText", event.target.value)} /></div>
                  <div className="col-12"><label htmlFor="product-tags" className="form-label">برچسب‌ها</label><textarea id="product-tags" className="form-control" rows={2} placeholder="هر برچسب در یک خط" value={form.tagsText} onChange={(event) => updateField("tagsText", event.target.value)} /></div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4 mb-2"><h6 className="mb-0">مشخصات فنی</h6><button type="button" className="btn btn-label-secondary btn-sm" onClick={() => updateField("specifications", [...form.specifications, { key: "", value: "" }])}><i className="icon-base ti tabler-plus me-1" aria-hidden="true" />افزودن مشخصه</button></div>
                <div className="d-grid gap-2">{form.specifications.map((row, index) => <div className="row g-2" key={`spec-${index}`}><div className="col-5"><input className="form-control" aria-label={`نام مشخصه ${index + 1}`} placeholder="مثلاً جنس" value={row.key} onChange={(event) => updateField("specifications", form.specifications.map((item, i) => i === index ? { ...item, key: event.target.value } : item))} /></div><div className="col-5"><input className="form-control" aria-label={`مقدار مشخصه ${index + 1}`} placeholder="مثلاً پنبه" value={row.value} onChange={(event) => updateField("specifications", form.specifications.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} /></div><div className="col-2"><button type="button" className="btn btn-icon btn-label-danger" aria-label="حذف مشخصه" onClick={() => updateField("specifications", form.specifications.filter((_, i) => i !== index))}><i className="icon-base ti tabler-trash" aria-hidden="true" /></button></div></div>)}</div>
                </div>
              </section>
            </div>

            <div className="col-12 col-xl-4">
              <section className="card mb-4">
                <div className="card-header"><h5 className="card-title mb-0">دسته‌بندی</h5></div>
                <div className="card-body"><label htmlFor="product-category" className="form-label">دسته‌بندی محصول *</label><select id="product-category" className="form-select" value={form.categoryId} onChange={(event) => updateField("categoryId", event.target.value)} required><option value="">انتخاب دسته‌بندی</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select><Link to="/admin/categories" className="btn btn-text-primary btn-sm mt-3 px-0"><i className="icon-base ti tabler-plus me-1" aria-hidden="true" />مدیریت دسته‌بندی‌ها</Link></div>
              </section>

              <section className="card mb-4">
                <div className="card-header"><h5 className="card-title mb-0">قیمت و موجودی</h5></div>
                <div className="card-body d-grid gap-3">
                  <div><label htmlFor="product-price" className="form-label">قیمت فروش *</label><div className="input-group"><input id="product-price" type="number" min="0" step="any" className="form-control" value={form.price} onChange={(event) => updateField("price", event.target.value)} required /><span className="input-group-text">تومان</span></div></div>
                  <div><label htmlFor="product-original-price" className="form-label">قیمت قبل از تخفیف</label><div className="input-group"><input id="product-original-price" type="number" min="0" step="any" className="form-control" value={form.originalPrice} onChange={(event) => updateField("originalPrice", event.target.value)} /><span className="input-group-text">تومان</span></div></div>
                  <div><label htmlFor="product-stock" className="form-label">تعداد موجودی *</label><input id="product-stock" type="number" min="0" step="1" className="form-control" value={form.stockCount} onChange={(event) => updateField("stockCount", event.target.value)} required /></div>
                  <div><label htmlFor="product-rating" className="form-label">امتیاز (اختیاری)</label><input id="product-rating" type="number" min="0" max="5" step="0.1" className="form-control" value={form.rating} onChange={(event) => updateField("rating", event.target.value)} /><small className="text-body-secondary">عددی بین صفر تا پنج.</small></div>
                </div>
              </section>

              <section className="card mb-4">
                <div className="card-header"><h5 className="card-title mb-0">ارسال و بازگشت</h5></div>
                <div className="card-body d-grid gap-3">
                  <div><label htmlFor="product-free-over" className="form-label">حداقل مبلغ ارسال رایگان *</label><input id="product-free-over" type="number" min="0" step="any" className="form-control" value={form.shippingFreeOver} onChange={(event) => updateField("shippingFreeOver", event.target.value)} required /></div>
                  <div><label htmlFor="product-delivery" className="form-label">اطلاعات ارسال *</label><textarea id="product-delivery" className="form-control" rows={3} value={form.shippingDelivery} onChange={(event) => updateField("shippingDelivery", event.target.value)} required /></div>
                  <div><label htmlFor="product-returns" className="form-label">قوانین بازگشت *</label><textarea id="product-returns" className="form-control" rows={3} value={form.shippingReturns} onChange={(event) => updateField("shippingReturns", event.target.value)} required /></div>
                </div>
              </section>
            </div>
          </div>

          {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
          <div className="admin-form-actions d-flex flex-wrap justify-content-end gap-2 mt-3"><Link to="/admin/products" className="btn btn-label-secondary">انصراف</Link><button type="submit" className="btn btn-primary" disabled={saving || categories.length === 0}>{saving ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />در حال ذخیره...</> : <><i className="icon-base ti tabler-device-floppy me-1" aria-hidden="true" />{isEditing ? "ذخیره تغییرات" : "ایجاد محصول"}</>}</button></div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
