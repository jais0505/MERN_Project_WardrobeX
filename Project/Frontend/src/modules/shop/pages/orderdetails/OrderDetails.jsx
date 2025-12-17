import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import styles from "./OrderDetails.module.css";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orderItemId } = useParams();
  console.log("ItemId:", orderItemId);
  const navigate = useNavigate();

  const [orderItem, setOrderItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderItem = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/order-item/${orderItemId}`
      );
      setOrderItem(res.data);
    } catch (err) {
      console.error("Failed to fetch order item", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderItemId) fetchOrderItem();
  }, [orderItemId]);

  const [isUpdating, setIsUpdating] = useState(false);

  const timelineStages = [
    { key: "processing", label: "Processing" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "outForDelivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const isCancelled = orderItem?.orderItemStatus === "cancelled";

  const getCurrentStageIndex = () => {
    if (!orderItem) return -1;
    if (orderItem.orderItemStatus === "cancelled") return -1;
    return timelineStages.findIndex(
      (stage) => stage.key === orderItem.orderItemStatus
    );
  };

  const getNextAction = () => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex === -1 || currentIndex >= timelineStages.length - 1) {
      return null;
    }
    return timelineStages[currentIndex + 1];
  };

  const handleStatusUpdate = async () => {
    const nextAction = getNextAction();
    if (!nextAction) return;

    try {
      setIsUpdating(true);

      await axios.patch(
        `http://localhost:5000/order-item/status/${orderItemId}`,
        { status: nextAction.key }
      );

      setOrderItem((prev) => ({
        ...prev,
        orderItemStatus: nextAction.key,
      }));

      // ✅ Success toast
      toast.success(`Order marked as ${nextAction.label}`);
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!orderItem) {
    return (
      <div className={styles.errorContainer}>
        <FiPackage size={64} />
        <h2>Order Not Found</h2>
        <button
          onClick={() => navigate("/shop/orders")}
          className={styles.errorBtn}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const currentStageIndex = getCurrentStageIndex();
  const nextAction = getNextAction();

  const CancelledTimeline = () => (
    <div className={styles.cancelledTimeline}>
      <div className={styles.timelineStepCompleted}>
        <div className={styles.timelineMarker}>
          <MdCheckCircle size={22} />
        </div>
        <div className={styles.timelineLabel}>Processing</div>
      </div>

      <div className={styles.cancelledConnector}></div>

      <div className={styles.timelineStepCancelled}>
        <div className={styles.timelineMarkerCancelled}>
          <MdCheckCircle size={22} />
        </div>
        <div className={styles.timelineLabelCancelled}>Cancelled</div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/shop/orders")}
        >
          <FiArrowLeft size={20} />
          <span>Back to Orders</span>
        </button>

        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Order Item Details</h1>
            <span className={styles.orderItemId}>
              #{orderItem._id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className={styles.headerRight}>
            <span
              className={styles.statusBadge}
              style={{
                backgroundColor: isCancelled
                  ? "#ef444415"
                  : currentStageIndex === timelineStages.length - 1
                  ? "#10b98115"
                  : "#f59e0b15",
                color: isCancelled
                  ? "#ef4444"
                  : currentStageIndex === timelineStages.length - 1
                  ? "#10b981"
                  : "#f59e0b",
              }}
            >
              <span className={styles.statusDot}></span>
              {isCancelled
                ? "Cancelled"
                : timelineStages[currentStageIndex]?.label}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Product Showcase - Hero Section */}
          <div className={styles.productShowcase}>
            <div className={styles.productImageContainer}>
              <img
                src={`http://localhost:5000/images/${orderItem.productImage}`}
                alt={orderItem.productName}
                className={styles.productImage}
              />
            </div>
            <div className={styles.productDetails}>
              <h2 className={styles.productName}>{orderItem.productName}</h2>

              <div className={styles.productVariants}>
                <div className={styles.variantChip}>
                  <span className={styles.variantLabel}>Color</span>
                  <span className={styles.variantValue}>
                    {orderItem.colorName}
                  </span>
                </div>
                <div className={styles.variantChip}>
                  <span className={styles.variantLabel}>Size</span>
                  <span className={styles.variantValue}>
                    {orderItem.sizeName}
                  </span>
                </div>
              </div>

              <div className={styles.productMetrics}>
                <div className={styles.metricBox}>
                  <FiPackage size={24} className={styles.metricIcon} />
                  <div className={styles.metricContent}>
                    <span className={styles.metricLabel}>Quantity</span>
                    <span className={styles.metricValue}>
                      {orderItem.quantity}
                    </span>
                  </div>
                </div>
                <div className={styles.metricBox}>
                  <FiCreditCard size={24} className={styles.metricIcon} />
                  <div className={styles.metricContent}>
                    <span className={styles.metricLabel}>Item Price</span>
                    <span className={styles.metricValue}>
                      {formatAmount(orderItem.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWrapper}>
                <FiMapPin size={22} />
                <h3 className={styles.cardTitle}>Delivery Information</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              {isCancelled ? (
                <div className={styles.cancelledTimeline}>
                  <MdCheckCircle size={28} className={styles.cancelledIcon} />
                  <h4 className={styles.cancelledTitle}>Order Cancelled</h4>
                  <p className={styles.cancelledReason}>
                    Reason: {orderItem.cancellationReason || "Not provided"}
                  </p>
                  <p className={styles.refundInfo}>
                    Refund of ₹{orderItem.price * orderItem.quantity} initiated.
                    <br />
                    Expected within 5 business days.
                  </p>
                </div>
              ) : (
                <div className={styles.timeline}>
                  {timelineStages.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`${styles.timelineStep}
              ${isCompleted ? styles.timelineStepCompleted : ""}
              ${isCurrent ? styles.timelineStepCurrent : ""}`}
                      >
                        <div className={styles.timelineMarker}>
                          {isCompleted ? (
                            <MdCheckCircle size={20} />
                          ) : (
                            <div className={styles.timelineDotEmpty}></div>
                          )}
                        </div>
                        <div className={styles.timelineLabel}>
                          {stage.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWrapper}>
                <FiCreditCard size={22} />
                <h3 className={styles.cardTitle}>Payment Information</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.paymentGrid}>
                <div className={styles.paymentItem}>
                  <span className={styles.paymentLabel}>Payment Status</span>
                  <span className={styles.paymentBadge}>
                    <FiCheckCircle size={16} />
                    Paid
                  </span>
                </div>
                <div className={styles.paymentItem}>
                  <span className={styles.paymentLabel}>Payment Method</span>
                  <span className={styles.paymentValue}>Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Timeline Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWrapper}>
                <FiPackage size={22} />
                <h3 className={styles.cardTitle}>Order Timeline</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              {isCancelled ? (
                <CancelledTimeline />
              ) : (
                <div className={styles.timeline}>
                  {timelineStages.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`${styles.timelineStep} ${
                          isCompleted ? styles.timelineStepCompleted : ""
                        } ${isCurrent ? styles.timelineStepCurrent : ""}`}
                      >
                        <div className={styles.timelineMarker}>
                          {isCompleted ? (
                            <MdCheckCircle size={20} />
                          ) : (
                            <div className={styles.timelineDotEmpty}></div>
                          )}
                        </div>
                        <div className={styles.timelineLabel}>
                          {stage.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Card */}
          <div className={styles.actionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWrapper}>
                <FiCheckCircle size={22} />
                <h3 className={styles.cardTitle}>Update Status</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              {isCancelled ? (
                <div className={styles.completedState}>
                  <div className={styles.completedIconWrapper}>
                    <MdCheckCircle size={48} />
                  </div>
                  <h3 className={styles.completedTitle}>Order Cancelled</h3>
                  <p className={styles.completedText}>
                    This item was cancelled by the customer. No further action
                    is required.
                  </p>
                </div>
              ) : nextAction ? (
                <div className={styles.actionContent}>
                  <div className={styles.currentStatusBox}>
                    <span className={styles.currentStatusLabel}>
                      Current Status
                    </span>
                    <span className={styles.currentStatusValue}>
                      {timelineStages[currentStageIndex]?.label}
                    </span>
                  </div>

                  <button
                    className={styles.updateButton}
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className={styles.buttonLoader}></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={20} />
                        Mark as {nextAction.label}
                      </>
                    )}
                  </button>

                  <p className={styles.actionHint}>
                    This will move the order to the next stage
                  </p>
                </div>
              ) : (
                <div className={styles.completedState}>
                  <div className={styles.completedIconWrapper}>
                    <FiCheckCircle size={48} />
                  </div>
                  <h3 className={styles.completedTitle}>Order Delivered!</h3>
                  <p className={styles.completedText}>
                    This order item has been successfully delivered to the
                    customer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
