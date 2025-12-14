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
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

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

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "paymentsuccess":
        return styles.statusPayment;
      case "processing":
        return styles.statusProcessing;
      case "shipped":
        return styles.statusShipped;
      case "delivered":
        return styles.statusDelivered;
      case "cancelled":
        return styles.statusCancelled;
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
                  <div
                    className={`${styles.statusBadge} ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
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
