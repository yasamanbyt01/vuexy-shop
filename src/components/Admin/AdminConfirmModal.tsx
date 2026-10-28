interface AdminConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const AdminConfirmModal = ({
  show,
  title,
  message,
  confirmLabel = "حذف",
  loading = false,
  error = "",
  onCancel,
  onConfirm,
}: AdminConfirmModalProps) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block admin-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-modal-title"
        tabIndex={-1}
        dir="rtl"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 id="admin-confirm-modal-title" className="modal-title">{title}</h5>
              <button type="button" className="btn-close ms-auto" aria-label="بستن" onClick={onCancel} disabled={loading} />
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
              {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-label-secondary" onClick={onCancel} disabled={loading}>انصراف</button>
              <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />در حال انجام...</> : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminConfirmModal;
