import { useState, useEffect } from "react";
import {
  MdDownload,
  MdCheckCircle,
  MdAccessTime,
  MdLocalShipping,
  MdInventory,
} from "react-icons/md";
import styles from "./OrderDetails.module.css";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import CancelOrderModal from "../cancelordermodal/CancelOrderModal";
import { toast } from "react-toastify";
import { RiQuestionLine, RiStarFill } from "react-icons/ri";

const OrderDetails = () => {
  // const userId = sessionStorage.getItem('uid');
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderItemId: null,
    productName: "",
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/order/details/${orderId}`
      );

      // Assuming backend response structure:
      // { order: {...}, items: [...] }
      const { order, items } = res.data;

      setOrderData({
        ...order,
        products: items, // map backend items directly
        deliveryInfo: {
          customerName: order.userName,
          contactNo: order.contactNo,
          address: order.deliveryAddress,
        },
        pricing: {
          subtotal: order.totalAmount, // or calculate sum of items
          deliveryFee: 0,
          discount: 0,
          tax: 0,
        },
        timeline: items.map((item) => ({
          status: item.itemStatus,
          completed: item.itemStatus.toLowerCase() !== "processing",
          date: order.orderDate,
        })),
      });

      setLoading(false);
      console.log("Order Data:", res.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortenOrderId = (id) => {
    if (!id || id.length < 10) return id;
    return `${id.slice(0, 8)}...${id.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading order details...</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>Order not found</div>
      </div>
    );
  }

  const BASE_ITEM_STAGES = [
    { key: "processing", label: "Processing" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "outForDelivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const getItemTimeline = (itemStatus) => {
    if (!itemStatus) return [];

    // CASE 1: Cancelled item
    if (itemStatus === "cancelled") {
      const cancelIndex = BASE_ITEM_STAGES.findIndex(
        (stage) => stage.key === "processing"
      );

      console.info("CancelIndex:", cancelIndex);

      return [
        {
          key: "processing",
          label: "Processing",
          completed: true,
          current: false,
          isFinal: false,
        },
        {
          key: "cancelled",
          label: "Cancelled",
          completed: true,
          current: true,
          isFinal: true,
        },
      ];
    }

    // CASE 2: Normal flow
    const currentIndex = BASE_ITEM_STAGES.findIndex(
      (stage) => stage.key === itemStatus
    );

    return BASE_ITEM_STAGES.map((stage, index) => ({
      ...stage,
      completed: index < currentIndex,
      current: index === currentIndex,
      isFinal: stage.key === "delivered" && itemStatus === "delivered",
    }));
  };

  const handleCancelClick = (orderItemId, productName) => {
    setCancelModal({
      isOpen: true,
      orderItemId,
      productName,
    });
  };

  const handleCloseCancelModal = () => {
    setCancelModal({
      isOpen: false,
      orderItemId: null,
      productName: "",
    });
  };

  const handleConfirmCancel = async (orderItemId, reason) => {
    try {
      const res = await axios.patch(
        `http://127.0.0.1:5000/order-item/${orderItemId}/cancel`,
        { reason }
      );

      const { refundAmount, refundEta } = res.data;

      toast.info(
        `Item cancelled successfully. ₹${refundAmount} will be refunded to your original payment method within ${refundEta}.`,
        {
          autoClose: 5000,
        }
      );
      handleCloseCancelModal();

      await fetchOrderDetails();
    } catch (error) {
      toast.error("Cancellation failed");
      console.error("Cancel failed:", error);
      alert(error.response?.data?.message || "Unable to cancel item");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Back Button */}
        <button
          className={styles.backBtn}
          onClick={() => navigate("/user/myorders")}
        >
          ← Back to Orders
        </button>

        {/* Order Summary Header */}
        <div className={styles.headerCard}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>Order Details</h1>
              <div className={styles.orderMeta}>
                <span className={styles.metaItem}>
                  <strong>Order ID:</strong> {shortenOrderId(orderData.orderId)}
                </span>
                <span className={styles.metaDivider}>|</span>
                <span className={styles.metaItem}>
                  <strong>Date:</strong> {formatDateTime(orderData.orderDate)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerBottom}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Payment Method</div>
                <div className={styles.summaryValue}>Online Payment</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Total Amount</div>
                <div className={styles.summaryValue}>
                  ₹{orderData.totalAmount}
                </div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Payment ID</div>
                <div className={styles.summaryValueSmall}>
                  {orderData.razorpayPaymentId}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Ordered Items */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Ordered Items</h2>
              <div className={styles.productsList}>
                {orderData.products.map((product) => (
                  <div key={product.orderItemId} className={styles.productItem}>
                    {/* Main Product Section */}
                    <div className={styles.productMainSection}>
                      <div className={styles.productImageBox}>
                        <img
                          src={`http://127.0.0.1:5000/images/${product.productImage}`}
                          alt={product.productName}
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productDetails}>
                        <h3 className={styles.productName}>
                          {product.productName}
                        </h3>
                        <p className={styles.productBrand}>
                          {product.brandName}
                        </p>
                        <div className={styles.productSpecs}>
                          <span>
                            Size: <strong>{product.sizeName}</strong>
                          </span>
                          <span className={styles.dot}>•</span>
                          <span>
                            Color: <strong>{product.colorName}</strong>
                          </span>
                          <span className={styles.dot}>•</span>
                          <span>
                            Qty: <strong>{product.quantity}</strong>
                          </span>
                        </div>
                      </div>
                      <div className={styles.productPricing}>
                        {/* Add this inside the div with className={styles.productPricing} */}

                        {(orderData.orderStatus === "paymentSuccess" ||
                          product.itemStatus === "delivered") && (
                          <button
                            className={styles.needHelpBtn}
                            onClick={() => {
                              console.log("orderItemId:", product.orderItemId);
                      
                              navigate(`/user/complaints/new`, {
                                state: {
                                  orderItemId: product.orderItemId,
                                },
                              });
                            }}
                          >
                            <RiQuestionLine className={styles.helpIcon} />
                            <span>Need Help?</span>
                          </button>
                        )}

                        <div className={styles.itemPrice}>₹{product.price}</div>
                        {product.quantity > 1 && (
                          <div className={styles.itemTotal}>
                            Total: ₹{product.price * product.quantity}
                          </div>
                        )}

                        {product.itemStatus === "cancelled" &&
                          product.refundStatus === "completed" && (
                            <div className={styles.refundText}>
                              Cancelled & Refunded
                            </div>
                          )}

                        {product.itemStatus === "cancelled" &&
                          product.refundStatus !== "completed" && (
                            <div className={styles.refundText}>
                              Cancelled (Refund in progress)
                            </div>
                          )}

                        {![
                          "cancelled",
                          "shipped",
                          "outForDelivery",
                          "delivered",
                        ].includes(product.itemStatus) && (
                          <button
                            className={styles.cancelItemBtn}
                            onClick={() =>
                              handleCancelClick(
                                product.orderItemId,
                                product.productName
                              )
                            }
                          >
                            Cancel Item
                          </button>
                        )}

                        {product.itemStatus === "delivered" &&
                          !product.isReviewed && (
                            <button
                              className={styles.rateProductBtn}
                              onClick={() =>
                                navigate(
                                  `/user/rate&review/${product.orderItemId}`
                                )
                              }
                            >
                              <RiStarFill className={styles.starIcon} />
                              <span>Rate Product</span>
                            </button>
                          )}
                      </div>
                    </div>

                    {/* ITEM TIMELINE SECTION */}
                    <div className={styles.itemTimelineWrapper}>
                      <div className={styles.itemTimelineTitle}>
                        Order Status
                      </div>
                      <div className={styles.itemTimeline}>
                        {getItemTimeline(product.itemStatus).map((step) => (
                          <div
                            key={step.key}
                            className={`${styles.itemTimelineStep}
              ${step.completed ? styles.itemStepCompleted : ""}
              ${step.current ? styles.itemStepCurrent : ""}`}
                          >
                            <div className={styles.itemTimelineDot}>
                              {step.completed || step.isFinal ? (
                                <MdCheckCircle size={14} />
                              ) : (
                                <MdAccessTime size={14} />
                              )}
                            </div>

                            <div className={styles.itemTimelineLabel}>
                              {step.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* USER REVIEW SECTION - Separate section below timeline */}
                    {product.itemStatus === "delivered" &&
                      product.isReviewed && (
                        <div className={styles.userReviewSection}>
                          <div className={styles.reviewSectionHeader}>
                            <RiStarFill className={styles.reviewStarIcon} />
                            <span className={styles.reviewSectionTitle}>
                              Your Review
                            </span>
                          </div>
                          <div className={styles.reviewRating}>
                            <span className={styles.ratingLabel}>Rating:</span>
                            <div className={styles.ratingStars}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <RiStarFill
                                  key={star}
                                  className={
                                    star <= product.ratingValue
                                      ? styles.starFilled
                                      : styles.starEmpty
                                  }
                                />
                              ))}
                            </div>
                            <span className={styles.ratingValue}>
                              {product.ratingValue}/5
                            </span>
                          </div>
                          <div className={styles.reviewTextBox}>
                            <span className={styles.reviewLabel}>
                              Your feedback:
                            </span>
                            <p className={styles.reviewText}>
                              {product.reviewContent}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className={styles.pricingBreakdown}>
                <h3 className={styles.breakdownTitle}>Price Breakdown</h3>
                <div className={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>₹{orderData.pricing.subtotal}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Delivery Fee</span>
                  <span>
                    {orderData.pricing.deliveryFee === 0
                      ? "FREE"
                      : `₹${orderData.pricing.deliveryFee}`}
                  </span>
                </div>
                {
                  <div className={styles.priceRow}>
                    <span>Discount</span>
                    <span className={styles.discountAmount}>
                      -₹{orderData.pricing.discount}
                    </span>
                  </div>
                }
                {
                  <div className={styles.priceRow}>
                    <span>Tax</span>
                    <span>₹{orderData.pricing.tax}</span>
                  </div>
                }
                <div className={styles.divider}></div>
                <div className={styles.priceRowTotal}>
                  <span>Order Total</span>
                  <span>₹{orderData.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Delivery Information */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Delivery Information</h2>
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Customer Name</div>
                  <div className={styles.infoValue}>
                    {orderData.deliveryInfo.customerName}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Contact Number</div>
                  <div className={styles.infoValue}>
                    {orderData.deliveryInfo.contactNo}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Delivery Address</div>
                  <div className={styles.infoValue}>
                    {orderData.deliveryInfo.address}
                  </div>
                </div>
                {orderData.deliveryInfo.expectedDelivery && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Expected Delivery</div>
                    <div className={styles.infoValue}>
                      {formatDate(orderData.deliveryInfo.expectedDelivery)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Payment Details</h2>
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Payment Status</div>
                  <div
                    className={`${styles.infoValue} ${styles.paymentSuccess}`}
                  >
                    <MdCheckCircle />{" "}
                    {orderData.orderStatus === "paymentSuccess" ||
                    orderData.orderStatus === "partiallyCancelled"
                      ? "Success"
                      : orderData.orderStatus}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Payment Method</div>
                  <div className={styles.infoValue}>Online Payment</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Payment ID</div>
                  <div className={styles.infoValueSmall}>
                    {orderData.razorpayPaymentId}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Amount Paid</div>
                  <div className={styles.infoValueBold}>
                    ₹{orderData.totalAmount}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Refund Amount</div>
                  <div className={styles.infoValueBold}>
                    ₹{orderData.refundedAmount || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel Modal */}
      <CancelOrderModal
        isOpen={cancelModal.isOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        orderItemId={cancelModal.orderItemId}
        productName={cancelModal.productName}
      />
    </div>
  );
};

export default OrderDetails;
