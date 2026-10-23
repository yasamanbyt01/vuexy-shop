import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import profileBanner from "../../assets/img/pages/profile-banner.png";
import { cancelOrder, getMyOrders } from "../../services/orders";
import type { OrderStatus, UserOrder } from "../../services/orders";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../services/addresses";
import type { AddressInput } from "../../services/addresses";
import type { Address } from "../../types/address";
import { getFavorites, removeFavorite } from "../../services/favorites";
import type { FavoriteProduct } from "../../services/favorites";
import { updateMyProfile } from "../../services/users";
import { formatPrice } from "../../utils/price";
import { toFarsiNumber } from "../../utils/numbers";

import "../../assets/vendor/css/pages/page-profile.css";
import "../../assets/css/customer-profile.css";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  processing: "در حال پردازش",
  shipped: "ززززززززز",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-label-warning",
  processing: "bg-label-info",
  shipped: "bg-label-primary",
  delivered: "bg-label-success",
  cancelled: "bg-label-danger",
};

type OrderFilter = "all" | OrderStatus;

const ORDER_FILTERS: Array<{
  value: OrderFilter;
  label: string;
  icon: string;
}> = [
  { value: "all", label: "همه سفارش‌ها", icon: "tabler-package" },
  { value: "pending", label: "در انتظار بررسی", icon: "tabler-clock" },
  { value: "processing", label: "در حال پردازش", icon: "tabler-loader" },
  { value: "shipped", label: "در حال ارسال", icon: "tabler-truck-delivery" },
  { value: "delivered", label: "تحویل داده شده", icon: "tabler-circle-check" },
  { value: "cancelled", label: "لغو شده", icon: "tabler-circle-x" },
];

const EMPTY_ADDRESS_FORM: AddressInput = {
  name: "",
  type: "home",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  isDefault: false,
};

function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "در ارتباط با سرور مشکلی پیش آمد. لطفاً دوباره تلاش کنید.";
}

const Profile = () => {
  const { user, token, updateAuthUser } = useAuth();

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [isCancelModalClosing, setIsCancelModalClosing] = useState(false);
  const cancelModalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null,
  );
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] =
    useState<AddressInput>(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressFormError, setAddressFormError] = useState<string | null>(null);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [addressActionId, setAddressActionId] = useState<number | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isAddressDeleteModalClosing, setIsAddressDeleteModalClosing] =
    useState(false);
  const addressDeleteModalTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [addressDeleteError, setAddressDeleteError] = useState<string | null>(
    null,
  );

  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [favoriteActionId, setFavoriteActionId] = useState<number | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profileEmail, setProfileEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setOrdersError("برای مشاهده سفارش‌ها دوباره وارد حساب کاربری شوید.");
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    setOrdersError(null);
    try {
      setOrders(await getMyOrders(token));
    } catch (error) {
      setOrdersError(getErrorMessage(error));
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      setAddressesError("برای مشاهده آدرس‌ها دوباره وارد حساب کاربری شوید.");
      setAddressesLoading(false);
      return;
    }

    setAddressesLoading(true);
    setAddressesError(null);
    try {
      setAddresses(await getAddresses(token));
    } catch (error) {
      setAddressesError(getErrorMessage(error));
    } finally {
      setAddressesLoading(false);
    }
  }, [token]);

  const loadFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      setFavoritesError(null);
      setFavoritesLoading(false);
      return;
    }

    setFavoritesLoading(true);
    setFavoritesError(null);
    try {
      setFavorites(await getFavorites(token));
    } catch (error) {
      setFavoritesError(getErrorMessage(error));
    } finally {
      setFavoritesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadOrders();
    void loadAddresses();
    void loadFavorites();
  }, [loadOrders, loadAddresses, loadFavorites]);

  useEffect(() => {
    setProfileName(user?.name ?? "");
    setProfileEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  useEffect(() => {
    return () => {
      if (cancelModalTimeoutRef.current !== null) {
        clearTimeout(cancelModalTimeoutRef.current);
      }
      if (addressDeleteModalTimeoutRef.current !== null) {
        clearTimeout(addressDeleteModalTimeoutRef.current);
      }
    };
  }, []);

  const openCancelModal = (orderId: number) => {
    if (cancelModalTimeoutRef.current !== null) {
      clearTimeout(cancelModalTimeoutRef.current);
      cancelModalTimeoutRef.current = null;
    }
    setIsCancelModalClosing(false);
    setCancelError(null);
    setOrderToCancel(orderId);
  };

  const closeCancelModal = (force = false) => {
    if (cancellingOrderId !== null && !force) return;
    if (orderToCancel === null || isCancelModalClosing) return;

    setIsCancelModalClosing(true);
    if (cancelModalTimeoutRef.current !== null) {
      clearTimeout(cancelModalTimeoutRef.current);
    }
    cancelModalTimeoutRef.current = setTimeout(() => {
      setOrderToCancel(null);
      setCancelError(null);
      setIsCancelModalClosing(false);
      cancelModalTimeoutRef.current = null;
    }, 180);
  };

  const handleCancelOrder = async () => {
    if (orderToCancel === null || !token) return;

    const orderId = orderToCancel;
    setCancellingOrderId(orderId);
    setCancelError(null);

    try {
      const updatedOrder = await cancelOrder(orderId, token);
      setOrders((current) =>
        current.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );
      closeCancelModal(true);
    } catch (error) {
      setCancelError(getErrorMessage(error));
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const name = profileName.trim();
    const email = profileEmail.trim();

    if (!name || !email) {
      setProfileError("نام و ایمیل را وارد کنید.");
      return;
    }

    setSavingProfile(true);
    setProfileError(null);
    setProfileMessage(null);

    try {
      const updatedUser = await updateMyProfile({ name, email }, token);
      updateAuthUser(updatedUser);
      setProfileName(updatedUser.name);
      setProfileEmail(updatedUser.email);
      setIsEditingProfile(false);
      setProfileMessage("اطلاعات حساب با موفقیت به‌روزرسانی شد.");
    } catch (error) {
      setProfileError(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const openAddressForm = (address?: Address) => {
    setEditingAddress(address ?? null);
    setAddressForm(
      address
        ? {
            name: address.name,
            type: address.type,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 ?? "",
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            phone: address.phone,
            isDefault: address.isDefault,
          }
        : { ...EMPTY_ADDRESS_FORM },
    );
    setAddressFormError(null);
    setAddressMessage(null);
    setAddressFormOpen(true);
  };

  const handleSaveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setSavingAddress(true);
    setAddressFormError(null);
    setAddressMessage(null);

    const payload: AddressInput = {
      ...addressForm,
      name: addressForm.name.trim(),
      addressLine1: addressForm.addressLine1.trim(),
      addressLine2: addressForm.addressLine2?.trim() ?? "",
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      zipCode: addressForm.zipCode.trim(),
      phone: addressForm.phone.trim(),
    };

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, payload, token);
        setAddressMessage("آدرس با موفقیت ویرایش شد.");
      } else {
        await createAddress(payload, token);
        setAddressMessage("آدرس جدید با موفقیت ثبت شد.");
      }
      setAddressFormOpen(false);
      setEditingAddress(null);
      await loadAddresses();
    } catch (error) {
      setAddressFormError(getErrorMessage(error));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    if (!token) return;
    setAddressActionId(addressId);
    setAddressMessage(null);
    setAddressesError(null);
    try {
      await setDefaultAddress(addressId, token);
      setAddressMessage("آدرس پیش‌فرض تغییر کرد.");
      await loadAddresses();
    } catch (error) {
      setAddressesError(getErrorMessage(error));
    } finally {
      setAddressActionId(null);
    }
  };

  const openAddressDeleteModal = (address: Address) => {
    if (addressDeleteModalTimeoutRef.current !== null) {
      clearTimeout(addressDeleteModalTimeoutRef.current);
      addressDeleteModalTimeoutRef.current = null;
    }
    setIsAddressDeleteModalClosing(false);
    setAddressDeleteError(null);
    setAddressToDelete(address);
  };

  const closeAddressDeleteModal = (force = false) => {
    if (addressActionId !== null && !force) return;
    if (addressToDelete === null || isAddressDeleteModalClosing) return;

    setIsAddressDeleteModalClosing(true);
    if (addressDeleteModalTimeoutRef.current !== null) {
      clearTimeout(addressDeleteModalTimeoutRef.current);
    }
    addressDeleteModalTimeoutRef.current = setTimeout(() => {
      setAddressToDelete(null);
      setAddressDeleteError(null);
      setIsAddressDeleteModalClosing(false);
      addressDeleteModalTimeoutRef.current = null;
    }, 180);
  };

  const handleDeleteAddress = async () => {
    if (!token || !addressToDelete) return;

    const address = addressToDelete;
    setAddressActionId(address.id);
    setAddressDeleteError(null);
    setAddressMessage(null);
    setAddressesError(null);

    try {
      await deleteAddress(address.id, token);
      setAddressMessage("آدرس حذف شد.");
      await loadAddresses();
      closeAddressDeleteModal(true);
    } catch (error) {
      setAddressDeleteError(getErrorMessage(error));
    } finally {
      setAddressActionId(null);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    if (!token) return;
    setFavoriteActionId(productId);
    setFavoritesError(null);
    try {
      await removeFavorite(productId, token);
      setFavorites((current) =>
        current.filter((item) => item.id !== productId),
      );
    } catch (error) {
      setFavoritesError(getErrorMessage(error));
    } finally {
      setFavoriteActionId(null);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user.name.trim() || "کاربر";
  // One Unicode code point avoids awkward two-initial combinations in Persian names.
  const avatarInitial = Array.from(displayName)[0] ?? "؟";
  const roleLabel = user.role === "admin" ? "مدیر" : "کاربر";
  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  return (
    <main className="container-xxl flex-grow-1 container-p-y customer-profile-page">
      <div className="row">
        <div className="col-12">
          <div className="card mb-6 overflow-hidden">
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
                  {avatarInitial}
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

      <div className="row g-6 mb-6">
        <div className="col-12 col-xl-5">
          <section
            id="profile-information"
            className="card h-100"
            aria-labelledby="profile-information-heading"
          >
            <div className="card-header d-flex justify-content-between align-items-center gap-2">
              <h5 id="profile-information-heading" className="card-title mb-0">
                اطلاعات حساب کاربری
              </h5>
              {!isEditingProfile && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setProfileError(null);
                    setProfileMessage(null);
                    setIsEditingProfile(true);
                  }}
                >
                  <i className="ti tabler-edit me-1" /> ویرایش
                </button>
              )}
            </div>
            <div className="card-body">
              {profileMessage && (
                <div className="alert alert-success" role="status">
                  {profileMessage}
                </div>
              )}
              {profileError && (
                <div className="alert alert-danger" role="alert">
                  {profileError}
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-4">
                    <label htmlFor="profile-name" className="form-label">
                      نام کامل
                    </label>
                    <input
                      id="profile-name"
                      className="form-control"
                      value={profileName}
                      onChange={(event) => setProfileName(event.target.value)}
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={120}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="profile-email" className="form-label">
                      ایمیل
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      className="form-control"
                      value={profileEmail}
                      onChange={(event) => setProfileEmail(event.target.value)}
                      autoComplete="email"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={savingProfile}
                    >
                      {savingProfile ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-label-secondary"
                      disabled={savingProfile}
                      onClick={() => {
                        setProfileName(user.name);
                        setProfileEmail(user.email);
                        setProfileError(null);
                        setIsEditingProfile(false);
                      }}
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              ) : (
                <ul className="list-unstyled mb-0 customer-profile-details">
                  <li>
                    <i className="ti tabler-user icon-lg" />
                    <span className="fw-medium">نام کامل:</span>
                    <span>{displayName}</span>
                  </li>
                  <li>
                    <i className="ti tabler-mail icon-lg" />
                    <span className="fw-medium">ایمیل:</span>
                    <span dir="ltr" className="text-break">
                      {user.email}
                    </span>
                  </li>
                  <li>
                    <i className="ti tabler-shield-check icon-lg" />
                    <span className="fw-medium">نوع حساب:</span>
                    <span>{roleLabel}</span>
                  </li>
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-7">
          <section
            className="card h-100 customer-account-shortcuts"
            aria-labelledby="account-shortcuts-heading"
          >
            <div className="card-body">
              <div className="customer-account-shortcuts-heading d-flex flex-wrap align-items-start justify-content-between gap-3 mb-2">
                <div>
                  <h5
                    id="account-shortcuts-heading"
                    className="card-title mb-2"
                  >
                    حساب کاربری شما
                  </h5>
                  <p className="text-body-secondary mb-0">
                    برای دسترسی سریع، یکی از بخش‌های حساب خود را انتخاب کنید.
                  </p>
                </div>
                <span
                  className="customer-account-welcome-icon"
                  aria-hidden="true"
                >
                  <i className="ti tabler-user-circle" />
                </span>
              </div>

              <nav
                className="customer-profile-shortcuts mt-4"
                aria-label="دسترسی سریع حساب کاربری"
              >
                <a href="#my-orders" className="customer-profile-shortcut">
                  <span className="customer-profile-shortcut-icon">
                    <i className="ti tabler-package" />
                  </span>
                  <span className="customer-profile-shortcut-copy">
                    <span className="customer-profile-shortcut-title">
                      سفارش‌های من
                    </span>
                    <span className="customer-profile-shortcut-subtitle">
                      پیگیری سفارش‌ها
                    </span>
                  </span>
                  <span className="customer-profile-shortcut-count">
                    {toFarsiNumber(orders.length)}
                  </span>
                </a>
                <a href="#my-addresses" className="customer-profile-shortcut">
                  <span className="customer-profile-shortcut-icon">
                    <i className="ti tabler-map-pin" />
                  </span>
                  <span className="customer-profile-shortcut-copy">
                    <span className="customer-profile-shortcut-title">
                      آدرس‌های من
                    </span>
                    <span className="customer-profile-shortcut-subtitle">
                      مدیریت نشانی‌ها
                    </span>
                  </span>
                  <span className="customer-profile-shortcut-count">
                    {toFarsiNumber(addresses.length)}
                  </span>
                </a>
                <a href="#favorites" className="customer-profile-shortcut">
                  <span className="customer-profile-shortcut-icon">
                    <i className="ti tabler-heart" />
                  </span>
                  <span className="customer-profile-shortcut-copy">
                    <span className="customer-profile-shortcut-title">
                      علاقه‌مندی‌ها
                    </span>
                    <span className="customer-profile-shortcut-subtitle">
                      محصولات ذخیره‌شده
                    </span>
                  </span>
                  <span className="customer-profile-shortcut-count">
                    {toFarsiNumber(favorites.length)}
                  </span>
                </a>
                <a
                  href="#profile-information"
                  className="customer-profile-shortcut"
                >
                  <span className="customer-profile-shortcut-icon">
                    <i className="ti tabler-user-edit" />
                  </span>
                  <span className="customer-profile-shortcut-copy">
                    <span className="customer-profile-shortcut-title">
                      اطلاعات حساب
                    </span>
                    <span className="customer-profile-shortcut-subtitle">
                      ویرایش نام و ایمیل
                    </span>
                  </span>
                  <span
                    className="customer-profile-shortcut-arrow"
                    aria-hidden="true"
                  >
                    <i className="ti tabler-chevron-left" />
                  </span>
                </a>
              </nav>

              <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
                <Link to="/products" className="btn btn-primary">
                  <i className="ti tabler-shopping-bag me-2" />
                  مشاهده محصولات
                </Link>
                <Link to="/checkout" className="btn btn-outline-primary">
                  <i className="ti tabler-shopping-cart me-2" />
                  سبد خرید
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="row mb-6" id="my-orders">
        <div className="col-12">
          <section className="card" aria-labelledby="my-orders-heading">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h5 id="my-orders-heading" className="card-title mb-1">
                  سفارش‌های من
                </h5>
                <p className="text-body-secondary mb-0">
                  وضعیت و جزئیات سفارش‌های ثبت‌شده را بر اساس وضعیت فیلتر کنید.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => void loadOrders()}
                disabled={ordersLoading}
              >
                <i className="ti tabler-refresh me-1" />
                {ordersLoading ? "در حال دریافت..." : "به‌روزرسانی"}
              </button>
            </div>
            <div className="card-body">
              {ordersLoading ? (
                <div className="text-center py-5" role="status">
                  <div className="spinner-border text-primary mb-3" />
                  <p className="mb-0 text-body-secondary">
                    در حال دریافت سفارش‌ها...
                  </p>
                </div>
              ) : ordersError ? (
                <div className="alert alert-danger mb-0" role="alert">
                  {ordersError}
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                      onClick={() => void loadOrders()}
                    >
                      تلاش دوباره
                    </button>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="ti tabler-shopping-bag icon-3x text-body-secondary mb-3" />
                  <h6>هنوز سفارشی ثبت نکرده‌اید</h6>
                  <p className="text-body-secondary mb-4">
                    بعد از ثبت سفارش، جزئیات آن در این بخش نمایش داده می‌شود.
                  </p>
                  <Link to="/products" className="btn btn-primary">
                    مشاهده محصولات
                  </Link>
                </div>
              ) : (
                <>
                  <div
                    className="customer-order-filter-grid mb-4"
                    role="group"
                    aria-label="فیلتر سفارش‌ها"
                  >
                    {ORDER_FILTERS.map((filter) => {
                      const count =
                        filter.value === "all"
                          ? orders.length
                          : orders.filter(
                              (order) => order.status === filter.value,
                            ).length;
                      const isActive = orderFilter === filter.value;
                      return (
                        <button
                          key={filter.value}
                          type="button"
                          className={`customer-order-filter${isActive ? " is-active" : ""}`}
                          aria-pressed={isActive}
                          onClick={() => setOrderFilter(filter.value)}
                        >
                          <span
                            className="customer-order-filter-icon"
                            aria-hidden="true"
                          >
                            <i className={`ti ${filter.icon}`} />
                          </span>
                          <span className="customer-order-filter-label">
                            {filter.label}
                          </span>
                          <span className="customer-order-filter-count">
                            {toFarsiNumber(count)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="customer-order-filter-empty text-center py-5">
                      <i
                        className="ti tabler-filter-off icon-2x text-body-secondary mb-3"
                        aria-hidden="true"
                      />
                      <h6 className="mb-2">سفارشی با این وضعیت ندارید</h6>
                      <p className="text-body-secondary mb-3">
                        می‌توانید وضعیت دیگری را انتخاب کنید تا سفارش‌های آن را
                        ببینید.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setOrderFilter("all")}
                      >
                        نمایش همه سفارش‌ها
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive d-none d-xl-block customer-orders-desktop">
                        <table className="table table-hover align-middle mb-0 customer-orders-table">
                          <thead>
                            <tr>
                              <th>سفارش</th>
                              <th>محصولات</th>
                              <th>مبلغ کل</th>
                              <th>وضعیت</th>
                              <th>عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <tr key={order.id}>
                                <td className="text-nowrap">
                                  <div className="fw-medium">
                                    شماره {toFarsiNumber(order.id)}
                                  </div>
                                  <small className="text-body-secondary">
                                    {formatOrderDate(order.createdAt)}
                                  </small>
                                </td>
                                <td>
                                  <div className="d-flex flex-column gap-2 customer-order-items">
                                    {order.items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="d-flex align-items-center gap-2"
                                      >
                                        {item.productImage && (
                                          <img
                                            src={item.productImage}
                                            alt=""
                                            aria-hidden="true"
                                            className="rounded customer-order-thumbnail"
                                          />
                                        )}
                                        <span>
                                          {item.productName}
                                          <small className="text-body-secondary d-block">
                                            تعداد:{" "}
                                            {toFarsiNumber(item.quantity)}
                                          </small>
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="text-nowrap fw-medium">
                                  {formatPrice(order.total)}
                                </td>
                                <td className="text-nowrap">
                                  <span
                                    className={`badge ${ORDER_STATUS_CLASSES[order.status]}`}
                                  >
                                    {ORDER_STATUS_LABELS[order.status]}
                                  </span>
                                </td>
                                <td className="text-nowrap">
                                  {order.status === "pending" ? (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      disabled={cancellingOrderId !== null}
                                      onClick={() => openCancelModal(order.id)}
                                    >
                                      <i className="ti tabler-x me-1" />
                                      لغو سفارش
                                    </button>
                                  ) : (
                                    <span className="text-body-secondary">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="customer-order-cards d-grid gap-3 d-xl-none">
                        {filteredOrders.map((order) => (
                          <article
                            className="card customer-order-card"
                            key={order.id}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start gap-3 customer-order-card-heading">
                                <div className="min-w-0">
                                  <div className="fw-semibold">
                                    سفارش شماره {toFarsiNumber(order.id)}
                                  </div>
                                  <small className="text-body-secondary">
                                    {formatOrderDate(order.createdAt)}
                                  </small>
                                </div>
                                <span
                                  className={`badge flex-shrink-0 ${ORDER_STATUS_CLASSES[order.status]}`}
                                >
                                  {ORDER_STATUS_LABELS[order.status]}
                                </span>
                              </div>

                              <hr className="my-3" />

                              <div className="customer-order-card-items d-grid gap-3">
                                {order.items.map((item) => (
                                  <div
                                    className="d-flex align-items-center gap-3"
                                    key={item.id}
                                  >
                                    {item.productImage && (
                                      <img
                                        src={item.productImage}
                                        alt=""
                                        aria-hidden="true"
                                        className="rounded customer-order-thumbnail"
                                      />
                                    )}
                                    <div className="flex-grow-1 min-w-0">
                                      <div
                                        className="customer-order-mobile-product-name"
                                        title={item.productName}
                                      >
                                        {item.productName}
                                      </div>
                                      <small className="text-body-secondary d-block mt-1">
                                        تعداد: {toFarsiNumber(item.quantity)}
                                      </small>
                                      <small className="text-body-secondary d-block">
                                        قیمت واحد: {formatPrice(item.unitPrice)}
                                      </small>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="customer-order-mobile-total d-flex align-items-center justify-content-between gap-3 mt-3 pt-3">
                                <span className="text-body-secondary">
                                  مبلغ کل سفارش
                                </span>
                                <strong className="text-primary text-nowrap">
                                  {formatPrice(order.total)}
                                </strong>
                              </div>

                              {order.status === "pending" && (
                                <div className="customer-order-card-actions">
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm customer-order-cancel-button"
                                    disabled={cancellingOrderId !== null}
                                    onClick={() => openCancelModal(order.id)}
                                  >
                                    <i
                                      className="ti tabler-x me-1"
                                      aria-hidden="true"
                                    />
                                    لغو سفارش
                                  </button>
                                </div>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="row mb-6" id="my-addresses">
        <div className="col-12">
          <section className="card" aria-labelledby="my-addresses-heading">
            <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h5 id="my-addresses-heading" className="card-title mb-1">
                  آدرس‌های من
                </h5>
                <p className="text-body-secondary mb-0">
                  آدرس‌های ارسال خود را مدیریت کنید.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => openAddressForm()}
              >
                <i className="ti tabler-plus me-1" />
                افزودن آدرس
              </button>
            </div>
            <div className="card-body">
              {addressMessage && (
                <div className="alert alert-success" role="status">
                  {addressMessage}
                </div>
              )}
              {addressesError && (
                <div className="alert alert-danger" role="alert">
                  {addressesError}
                  <button
                    type="button"
                    className="btn btn-link p-0 mx-2"
                    onClick={() => void loadAddresses()}
                  >
                    تلاش دوباره
                  </button>
                </div>
              )}

              {addressFormOpen && (
                <form
                  className="customer-address-form border rounded p-4 mb-5"
                  onSubmit={handleSaveAddress}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="mb-0">
                      {editingAddress ? "ویرایش آدرس" : "ثبت آدرس جدید"}
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="بستن فرم"
                      onClick={() => {
                        setAddressFormOpen(false);
                        setEditingAddress(null);
                      }}
                    />
                  </div>
                  {addressFormError && (
                    <div className="alert alert-danger" role="alert">
                      {addressFormError}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="address-name">
                        عنوان آدرس (مثلاً خانه)
                      </label>
                      <input
                        id="address-name"
                        className="form-control"
                        required
                        maxLength={100}
                        value={addressForm.name}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="address-type">
                        نوع آدرس
                      </label>
                      <select
                        id="address-type"
                        className="form-select"
                        value={addressForm.type}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            type: e.target.value as AddressInput["type"],
                          })
                        }
                      >
                        <option value="home">خانه</option>
                        <option value="office">محل کار</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="address-line1">
                        آدرس اصلی
                      </label>
                      <input
                        id="address-line1"
                        className="form-control"
                        required
                        maxLength={255}
                        value={addressForm.addressLine1}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="address-line2">
                        جزئیات تکمیلی (اختیاری)
                      </label>
                      <input
                        id="address-line2"
                        className="form-control"
                        maxLength={255}
                        value={addressForm.addressLine2 ?? ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label" htmlFor="address-city">
                        شهر
                      </label>
                      <input
                        id="address-city"
                        className="form-control"
                        required
                        maxLength={100}
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label" htmlFor="address-state">
                        استان
                      </label>
                      <input
                        id="address-state"
                        className="form-control"
                        required
                        maxLength={100}
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label" htmlFor="address-zip">
                        کد پستی
                      </label>
                      <input
                        id="address-zip"
                        className="form-control"
                        required
                        maxLength={20}
                        value={addressForm.zipCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="address-phone">
                        شماره تماس گیرنده
                      </label>
                      <input
                        id="address-phone"
                        className="form-control"
                        type="tel"
                        required
                        maxLength={30}
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          id="address-default"
                          className="form-check-input"
                          type="checkbox"
                          checked={Boolean(addressForm.isDefault)}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address-default"
                        >
                          ثبت به‌عنوان آدرس پیش‌فرض
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={savingAddress}
                    >
                      {savingAddress ? "در حال ذخیره..." : "ذخیره آدرس"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-label-secondary"
                      disabled={savingAddress}
                      onClick={() => {
                        setAddressFormOpen(false);
                        setEditingAddress(null);
                      }}
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              )}

              {addressesLoading ? (
                <div className="text-center py-4" role="status">
                  <div className="spinner-border spinner-border-sm text-primary me-2" />
                  در حال دریافت آدرس‌ها...
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4">
                  <i className="ti tabler-map-pin icon-3x text-body-secondary mb-3" />
                  <h6>هنوز آدرسی ثبت نکرده‌اید</h6>
                  <p className="text-body-secondary mb-0">
                    یک آدرس اضافه کنید تا هنگام ثبت سفارش راحت‌تر باشید.
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {addresses.map((address) => (
                    <div className="col-12 col-lg-6" key={address.id}>
                      <article
                        className={`card h-100 customer-address-card ${address.isDefault ? "is-default" : ""}`}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <h6 className="mb-0">{address.name}</h6>
                              {address.isDefault && (
                                <span className="badge bg-label-success">
                                  پیش‌فرض
                                </span>
                              )}
                            </div>
                            <span className="badge bg-label-secondary">
                              {address.type === "office" ? "محل کار" : "خانه"}
                            </span>
                          </div>
                          <p className="mb-2">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-body-secondary mb-2">
                              {address.addressLine2}
                            </p>
                          )}
                          <p className="text-body-secondary mb-2">
                            {address.city}، {address.state} — کد پستی:{" "}
                            {toFarsiNumber(address.zipCode)}
                          </p>
                          <p className="text-body-secondary mb-4">
                            تلفن: <span dir="ltr">{address.phone}</span>
                          </p>
                          <div className="d-flex flex-wrap gap-2 mt-auto">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openAddressForm(address)}
                            >
                              <i className="ti tabler-edit me-1" />
                              ویرایش
                            </button>
                            {!address.isDefault && (
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                disabled={addressActionId === address.id}
                                onClick={() =>
                                  void handleSetDefaultAddress(address.id)
                                }
                              >
                                تنظیم پیش‌فرض
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              disabled={addressActionId === address.id}
                              onClick={() => openAddressDeleteModal(address)}
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="row mb-6" id="favorites">
        <div className="col-12">
          <section className="card" aria-labelledby="favorites-heading">
            <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h5 id="favorites-heading" className="card-title mb-1">
                  علاقه‌مندی‌های من
                </h5>
                <p className="text-body-secondary mb-0">
                  محصولاتی که برای خرید بعدی ذخیره کرده‌اید
                </p>
              </div>
              <Link to="/products" className="btn btn-outline-primary btn-sm">
                مشاهده محصولات
              </Link>
            </div>
            <div className="card-body">
              {favoritesError && (
                <div className="alert alert-danger" role="alert">
                  {favoritesError}
                  <button
                    type="button"
                    className="btn btn-link p-0 mx-2"
                    onClick={() => void loadFavorites()}
                  >
                    تلاش دوباره
                  </button>
                </div>
              )}
              {favoritesLoading ? (
                <div className="text-center py-4" role="status">
                  <div className="spinner-border spinner-border-sm text-primary me-2" />
                  در حال دریافت علاقه‌مندی‌ها...
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-5">
                  <i className="ti tabler-heart icon-3x text-body-secondary mb-3" />
                  <h6>فهرست علاقه‌مندی‌ها خالی است</h6>
                  <p className="text-body-secondary mb-4">
                    از صفحه جزئیات محصولات، آن‌ها را به علاقه‌مندی‌های خود اضافه
                    کنید.
                  </p>
                  <Link to="/products" className="btn btn-primary">
                    گشت‌وگذار در فروشگاه
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {favorites.map((product) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={product.id}>
                      <article className="card h-100 customer-favorite-card">
                        <Link
                          to={`/products/${product.id}`}
                          className="customer-favorite-image-wrap"
                        >
                          <img
                            src={product.images[0] || profileBanner}
                            alt={product.name}
                            className="card-img-top customer-favorite-image"
                          />
                        </Link>
                        <div className="card-body d-flex flex-column">
                          <Link
                            to={`/products/${product.id}`}
                            className="fw-medium text-heading mb-2"
                          >
                            {product.name}
                          </Link>
                          <div className="text-primary fw-semibold mb-3">
                            {formatPrice(product.price)}
                          </div>
                          {!product.inStock && (
                            <span className="badge bg-label-danger align-self-start mb-3">
                              ناموجود
                            </span>
                          )}
                          <div className="d-flex gap-2 mt-auto">
                            <Link
                              to={`/products/${product.id}`}
                              className="btn btn-primary btn-sm flex-grow-1"
                            >
                              مشاهده محصول
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="حذف از علاقه‌مندی‌ها"
                              aria-label={`حذف ${product.name} از علاقه‌مندی‌ها`}
                              disabled={favoriteActionId === product.id}
                              onClick={() =>
                                void handleRemoveFavorite(product.id)
                              }
                            >
                              <i className="ti tabler-heart-off" />
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {orderToCancel !== null && (
        <div
          className={`customer-profile-modal-backdrop${isCancelModalClosing ? " is-closing" : ""}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCancelModal();
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            dir="rtl"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="cancel-order-title">
                  لغو سفارش
                </h5>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  aria-label="بستن"
                  disabled={cancellingOrderId !== null || isCancelModalClosing}
                  onClick={() => closeCancelModal()}
                />
              </div>
              <div className="modal-body">
                <p className="mb-2">
                  آیا از لغو سفارش شماره {toFarsiNumber(orderToCancel)} مطمئن
                  هستید؟
                </p>
                <p className="text-body-secondary small mb-0">
                  سفارش حذف نمی‌شود و وضعیت آن به «لغو شده» تغییر می‌کند.
                </p>
                {cancelError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {cancelError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  disabled={cancellingOrderId !== null || isCancelModalClosing}
                  onClick={() => closeCancelModal()}
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={cancellingOrderId !== null || isCancelModalClosing}
                  onClick={() => void handleCancelOrder()}
                >
                  {cancellingOrderId !== null
                    ? "در حال لغو..."
                    : "بله، لغو سفارش"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {addressToDelete !== null && (
        <div
          className={`customer-profile-modal-backdrop${isAddressDeleteModalClosing ? " is-closing" : ""}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAddressDeleteModal();
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-address-title"
            dir="rtl"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="delete-address-title">
                  حذف آدرس
                </h5>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  aria-label="بستن"
                  disabled={
                    addressActionId === addressToDelete.id ||
                    isAddressDeleteModalClosing
                  }
                  onClick={() => closeAddressDeleteModal()}
                />
              </div>
              <div className="modal-body">
                <p className="mb-2">
                  آیا از حذف آدرس «{addressToDelete.name}» مطمئن هستید؟
                </p>
                <p className="text-body-secondary small mb-0">
                  این آدرس از فهرست آدرس‌های شما حذف خواهد شد.
                </p>
                {addressDeleteError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {addressDeleteError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  disabled={
                    addressActionId === addressToDelete.id ||
                    isAddressDeleteModalClosing
                  }
                  onClick={() => closeAddressDeleteModal()}
                >
                  انصراف
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={
                    addressActionId === addressToDelete.id ||
                    isAddressDeleteModalClosing
                  }
                  onClick={() => void handleDeleteAddress()}
                >
                  {addressActionId === addressToDelete.id
                    ? "در حال حذف..."
                    : "بله، حذف آدرس"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
