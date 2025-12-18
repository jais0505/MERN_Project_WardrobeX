import { useState, useEffect } from "react";
import styles from "./MyOrders.module.css";
import { useNavigate } from "react-router";
import axios from "axios";

const MyOrders = () => {
  const userId = sessionStorage.getItem("uid");

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/order/user/${userId}`
        );
        setOrders(res.data.orders || []);
        // console.log("MYOrderData:", res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const ORDER_STATUS_LABELS = {
    inCart: "In Cart",
    buyNow: "Order Initiated",
    paymentPending: "Payment Pending",
    paymentSuccess: "Order Placed",
    partiallyCancelled: "Partially Cancelled",
    cancelled: "Order Cancelled",
    refunded: "Refunded",
  };

  // const getDeliveryLabel = (status) => {
  //   if (!status) return "Processing";

  //   switch (status.toLowerCase()) {
  //     case "packed":
  //       return "Packed";
  //     case "shipped":
  //       return "Shipped";
  //     case "out for delivery":
  //       return "Out for Delivery";
  //     case "delivered":
  //       return "Delivered";
  //     default:
  //       return "Processing";
  //   }
  // };

  const getOrderSummaryText = (order) => {
    if (order.orderStatus === "partiallyCancelled") {
      return "Some items in this order were cancelled";
    }

    if (order.orderStatus === "cancelled") {
      return "Order cancelled";
    }

    return null;
  };

  const shortenOrderId = (orderId) => {
    if (!orderId || orderId.length < 10) return orderId;
    return `#${orderId.slice(0, 5)}...${orderId.slice(-3)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "paymentSuccess":
        return styles.statusPayment;
      case "paymentPending":
        return styles.statusProcessing;
      case "partiallyCancelled":
      return styles.statusPartial;
      case "cancelled":
        return styles.statusCancelled;
      case "refunded":
        return styles.statusDefault;
      default:
        return styles.statusDefault;
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/user/order-details/${orderId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No Orders Yet</h2>
          <p className={styles.emptyText}>
            Start shopping to see your orders here
          </p>
          <button className={styles.shopBtn} onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.pageTitle}>My Orders</h1>

        <div className={styles.ordersList}>
          {orders.map((order) => {
            const firstProduct = order.previewItem;
            const additionalItems = order.totalItems - 1;

            return (
              <div key={order.orderId} className={styles.orderCard}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>
                      {shortenOrderId(order.orderId)}
                    </span>
                    <span className={styles.orderDate}>
                      Ordered on {formatDate(order.orderDate)}
                    </span>
                  </div>
                  <div className={styles.statusWrapper}>
                    <span
                      className={`${styles.statusBadge} ${getOrderStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {ORDER_STATUS_LABELS[order.orderStatus]}
                    </span>

                    {getOrderSummaryText(order) && (
                      <div className={styles.orderSummaryText}>
                        {getOrderSummaryText(order)}
                      </div>
                    )}

                    {/* <span className={styles.deliveryStatus}>
                      {order.orderStatus === "partiallyCancelled"
                        ? "Partially cancelled"
                        : getDeliveryLabel(order.previewItem?.itemStatus)}
                    </span> */}
                  </div>
                </div>

                {/* Order Content */}
                <div className={styles.orderContent}>
                  {/* Product Snapshot */}
                  <div className={styles.productSnapshot}>
                    <div className={styles.productImageBox}>
                      <img
                        src={`http://127.0.0.1:5000/images/${firstProduct.productImage}`}
                        alt={firstProduct.productName}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>
                        {firstProduct.productName}
                      </h3>
                      <p className={styles.productBrand}>
                        {firstProduct.brandName}
                      </p>
                      <div className={styles.productVariants}>
                        <span>Size: {firstProduct.sizeName}</span>
                        <span className={styles.dot}>•</span>
                        <span>Color: {firstProduct.colorName}</span>
                      </div>
                      {additionalItems > 0 && (
                        <p className={styles.moreItems}>
                          +{additionalItems} more item
                          {additionalItems > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Total Amount</span>

                      <span className={styles.detailValue}>
                        ₹{order.totalAmount}
                      </span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Delivery To</span>
                      <span className={styles.detailValue}>
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    className={styles.viewDetailsBtn}
                    onClick={() => handleViewDetails(order.orderId)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
