import { useState } from "react";
import { MdClose, MdWarning } from "react-icons/md";
import styles from "./CancelOrderModal.module.css";

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found cheaper elsewhere",
  "Delivery is too slow",
  "Product not needed anymore",
  "Other",
];

const CancelOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderItemId,
  productName,
}) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(orderItemId, reason);
    setReason(""); // Reset after confirm
  };

  const handleClose = () => {
    setReason(""); // Reset on close
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <MdClose size={24} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <MdWarning size={32} />
          </div>
          <h3 className={styles.title}>Cancel Item</h3>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.message}>
            Are you sure you want to cancel{" "}
            <strong className={styles.productName}>{productName}</strong>?
          </p>
          <p className={styles.warning}>
            This action cannot be undone. Please select a reason below.
          </p>

          {/* Reason Select */}
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Reason for cancellation</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.select}
            >
              <option value="">Select a reason</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.keepBtn} onClick={handleClose}>
            Keep Order
          </button>
          <button
            className={styles.cancelBtn}
            disabled={!reason}
            onClick={handleConfirm}
          >
            Cancel Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
