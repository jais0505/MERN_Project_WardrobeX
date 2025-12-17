import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiArrowRight,
  FiBox,
  FiTruck,
  FiCheckCircle,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { MdCancel, MdPendingActions } from "react-icons/md";
import styles from "./ShopOrders.module.css";
import { useNavigate } from "react-router";
import axios from "axios";

const ShopOrders = () => {
  const navigate = useNavigate();

  const shopId = sessionStorage.getItem("sid");
  console.log("ShopId:", shopId);

  const [statusFilter, setStatusFilter] = useState("all");
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/OrderItemFetch/${shopId}`
        );

        setOrderItemsData(res.data.shopOrderItems);
      } catch (err) {
        console.error("Failed to fetch shop orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchShopOrders();
  }, [shopId]);

  const statusConfig = {
    processing: {
      label: "Processing",
      color: "#f59e0b",
      icon: MdPendingActions,
    },
    packed: {
      label: "Packed",
      color: "#3b82f6",
      icon: FiBox,
    },
    shipped: {
      label: "Shipped",
      color: "#8b5cf6",
      icon: FiTruck,
    },
    outForDelivery: {
      label: "Out for Delivery",
      color: "#0ea5e9",
      icon: FiTruck,
    },
    delivered: {
      label: "Delivered",
      color: "#10b981",
      icon: FiCheckCircle,
    },
    cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    icon: MdCancel,
  },
  };

  // Filter items
  const filteredItems = orderItemsData.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.orderItemStatus === statusFilter;
    return matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Calculate stats
  const totalItems = orderItemsData.length;
  const processingItems = orderItemsData.filter(
    (i) => i.orderItemStatus === "processing"
  ).length;
  const packedItems = orderItemsData.filter(
    (i) => i.orderItemStatus === "packed"
  ).length;
  const shippedItems = orderItemsData.filter(
    (i) => i.orderItemStatus === "shipped"
  ).length;
  const deliveredItems = orderItemsData.filter(
    (i) => i.orderItemStatus === "delivered"
  ).length;

  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: FiPackage,
      color: "#000000",
    },
    {
      label: "Processing",
      value: processingItems,
      icon: MdPendingActions,
      color: "#f59e0b",
    },
    { label: "Packed", value: packedItems, icon: FiBox, color: "#3b82f6" },
    { label: "Shipped", value: shippedItems, icon: FiTruck, color: "#8b5cf6" },
    {
      label: "Delivered",
      value: deliveredItems,
      icon: FiCheckCircle,
      color: "#10b981",
    },
  ];

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Fulfillment Center</h1>
            <p className={styles.heroSubtitle}>
              Manage and process your order items efficiently
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>
                {processingItems + packedItems}
              </span>
              <span className={styles.heroStatLabel}>Pending Action</span>
            </div>
            <div className={styles.heroDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{totalItems}</span>
              <span className={styles.heroStatLabel}>Total Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={styles.statCard}
              style={{ borderTopColor: stat.color }}
            >
              <div
                className={styles.statIconWrapper}
                style={{ backgroundColor: `${stat.color}10` }}
              >
                <IconComponent size={24} style={{ color: stat.color }} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <div className={styles.statusFilters}>
          <div className={styles.filterLabel}>
            <FiFilter size={16} />
            <span>Status:</span>
          </div>
          {[
            { value: "all", label: "All Items" },
            { value: "processing", label: "Processing" },
            { value: "packed", label: "Packed" },
            { value: "shipped", label: "Shipped" },
            { value: "outForDelivery", label: "Out for Delivery" },
            { value: "delivered", label: "Delivered" },
          ].map((filter) => (
            <button
              key={filter.value}
              className={`${styles.filterChip} ${
                statusFilter === filter.value ? styles.filterChipActive : ""
              }`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className={styles.itemsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Order Items</h2>
          <span className={styles.itemCount}>{filteredItems.length} items</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <FiPackage size={64} />
            </div>
            <h3 className={styles.emptyTitle}>No Items Found</h3>
          </div>
        ) : (
          <div className={styles.itemsList}>
            {filteredItems.map((item) => {
              const StatusIcon = statusConfig[item.orderItemStatus].icon;
              return (
                <div key={item.orderItemId} className={styles.itemRow}>
                  <div className={styles.itemMainContent}>
                    {/* Product Image & Info */}
                    <div className={styles.productSection}>
                      <div className={styles.productImageWrapper}>
                        <img
                          src={`http://localhost:5000/images/${item.productImage}`}
                          alt={item.productName}
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>
                          {item.productName}
                        </h3>
                        <div className={styles.productMeta}>
                          <span className={styles.metaItem}>
                            Size: <strong>{item.sizeName}</strong>
                          </span>
                          <span className={styles.metaDivider}>•</span>
                          <span className={styles.metaItem}>
                            Color: <strong>{item.colorName}</strong>
                          </span>
                          <span className={styles.metaDivider}>•</span>
                          <span className={styles.metaItem}>
                            Qty: <strong>{item.quantity}</strong>
                          </span>
                        </div>
                        <div className={styles.productPrice}>
                          <span className={styles.priceCalc}>
                            {formatAmount(item.price)} × {item.quantity}
                          </span>
                          <span className={styles.priceTotal}>
                            {formatAmount(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className={styles.orderDetails}>
                      <div className={styles.detailItem}>
                        <FiCalendar size={16} className={styles.detailIcon} />
                        <span className={styles.detailText}>
                          {formatDate(item.orderDate)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <FiMapPin size={16} className={styles.detailIcon} />
                        <span className={styles.detailText}>
                          {item.deliveryAddress}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={styles.statusSection}>
                      <div
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: `${
                            statusConfig[item.orderItemStatus].color
                          }15`,
                          color: statusConfig[item.orderItemStatus].color,
                          borderColor: statusConfig[item.orderItemStatus].color,
                        }}
                      >
                        <StatusIcon size={16} />
                        {statusConfig[item.orderItemStatus].label}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className={styles.actionSection}>
                      <button
                        className={styles.actionButton}
                        onClick={() =>
                          navigate(`/shop/order-details/${item.orderItemId}`)
                        }
                      >
                        <span>View & Update</span>
                        <FiArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrders;
