import React, { useState } from 'react';
import { 
  FiPackage, 
  FiCalendar, 
  FiCreditCard, 
  FiCheckCircle, 
  FiUser, 
  FiPhone, 
  FiMapPin,
  FiArrowLeft,
  FiAlertCircle
} from 'react-icons/fi';
import styles from './OrderDetails.module.css';

const OrderDetails = () => {
  // Sample order data
  const [orderData] = useState({
    id: 'ORD-2847',
    date: '2024-12-14',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    currentStatus: 'processing',
    totalAmount: 8999,
    customer: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '123, MG Road, Koramangala, Bangalore, Karnataka - 560034'
    },
    items: [
      {
        id: 1,
        image: '👔',
        name: 'Premium Cotton Shirt',
        size: 'L',
        color: 'Navy Blue',
        quantity: 2,
        price: 2999,
        status: 'processing'
      },
      {
        id: 2,
        image: '👖',
        name: 'Slim Fit Denim Jeans',
        size: '32',
        color: 'Dark Blue',
        quantity: 1,
        price: 3499,
        status: 'processing'
      }
    ]
  });

  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusConfig = {
    payment_success: { label: 'Payment Success', color: '#10b981', canUpdate: false },
    processing: { label: 'Processing', color: '#f59e0b', canUpdate: true },
    shipped: { label: 'Shipped', color: '#3b82f6', canUpdate: true },
    delivered: { label: 'Delivered', color: '#8b5cf6', canUpdate: true },
    cancelled: { label: 'Cancelled', color: '#ef4444', canUpdate: true },
    inCart: { label: 'In Cart', color: '#6b7280', canUpdate: false },
    buyNow: { label: 'Buy Now', color: '#6b7280', canUpdate: false },
    paymentPending: { label: 'Payment Pending', color: '#f59e0b', canUpdate: false }
  };

  const updatableStatuses = [
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      alert(`Order status updated to: ${updatableStatuses.find(s => s.value === selectedStatus)?.label}`);
      setSelectedStatus('');
    }, 1000);
  };

  const calculateSubtotal = () => {
    return orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn}>
          <FiArrowLeft size={20} />
          Back to Orders
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Order Details</h1>
          <span className={styles.orderId}>{orderData.id}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* LEFT SIDE - Order Summary & Customer Info */}
        <div className={styles.leftSection}>
          {/* Order Summary */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiPackage size={20} />
              Order Summary
            </h2>
            <div className={styles.cardContent}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <FiPackage size={16} />
                  Order ID
                </span>
                <span className={styles.summaryValue}>{orderData.id}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <FiCalendar size={16} />
                  Order Date
                </span>
                <span className={styles.summaryValue}>{formatDate(orderData.date)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <FiCreditCard size={16} />
                  Payment Method
                </span>
                <span className={styles.summaryValue}>{orderData.paymentMethod}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <FiCheckCircle size={16} />
                  Payment Status
                </span>
                <span className={styles.paymentBadge}>
                  <FiCheckCircle size={14} />
                  Paid
                </span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabelBold}>Total Amount</span>
                <span className={styles.summaryValueAmount}>{formatAmount(orderData.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiUser size={20} />
              Customer Information
            </h2>
            <div className={styles.cardContent}>
              <div className={styles.customerRow}>
                <FiUser size={18} className={styles.customerIcon} />
                <div className={styles.customerInfo}>
                  <span className={styles.customerLabel}>Name</span>
                  <span className={styles.customerValue}>{orderData.customer.name}</span>
                </div>
              </div>
              <div className={styles.customerRow}>
                <FiPhone size={18} className={styles.customerIcon} />
                <div className={styles.customerInfo}>
                  <span className={styles.customerLabel}>Phone</span>
                  <span className={styles.customerValue}>{orderData.customer.phone}</span>
                </div>
              </div>
              <div className={styles.customerRow}>
                <FiMapPin size={18} className={styles.customerIcon} />
                <div className={styles.customerInfo}>
                  <span className={styles.customerLabel}>Delivery Address</span>
                  <span className={styles.customerValue}>{orderData.customer.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER - Ordered Items */}
        <div className={styles.centerSection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiPackage size={20} />
              Ordered Items ({orderData.items.length})
            </h2>
            <div className={styles.itemsList}>
              {orderData.items.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.itemImage}>
                    <span className={styles.itemIcon}>{item.image}</span>
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemMetaItem}>
                        <strong>Size:</strong> {item.size}
                      </span>
                      <span className={styles.itemMetaDot}>•</span>
                      <span className={styles.itemMetaItem}>
                        <strong>Color:</strong> {item.color}
                      </span>
                      <span className={styles.itemMetaDot}>•</span>
                      <span className={styles.itemMetaItem}>
                        <strong>Qty:</strong> {item.quantity}
                      </span>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatAmount(item.price)} × {item.quantity} = <strong>{formatAmount(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Total Summary */}
              <div className={styles.itemsTotal}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{formatAmount(calculateSubtotal())}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className={styles.totalDivider}></div>
                <div className={styles.totalRowFinal}>
                  <span>Total</span>
                  <span>{formatAmount(orderData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Status Update */}
        <div className={styles.rightSection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiAlertCircle size={20} />
              Order Status
            </h2>
            <div className={styles.cardContent}>
              <div className={styles.statusSection}>
                <span className={styles.statusLabel}>Current Status</span>
                <span 
                  className={styles.currentStatusBadge}
                  style={{ 
                    backgroundColor: `${statusConfig[orderData.currentStatus].color}15`,
                    color: statusConfig[orderData.currentStatus].color 
                  }}
                >
                  {statusConfig[orderData.currentStatus].label}
                </span>
              </div>

              {statusConfig[orderData.currentStatus]?.canUpdate ? (
                <>
                  <div className={styles.statusDivider}></div>
                  <div className={styles.updateSection}>
                    <label className={styles.updateLabel}>Update Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="">Select New Status</option>
                      {updatableStatuses
                        .filter(s => s.value !== orderData.currentStatus)
                        .map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))
                      }
                    </select>
                    <button
                      className={styles.updateBtn}
                      onClick={handleStatusUpdate}
                      disabled={!selectedStatus || isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.cannotUpdateNotice}>
                  <FiAlertCircle size={18} />
                  <p>This order status cannot be updated at this time.</p>
                </div>
              )}

              {/* Status Timeline */}
              <div className={styles.statusDivider}></div>
              <div className={styles.timeline}>
                <h3 className={styles.timelineTitle}>Order Timeline</h3>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineLabel}>Order Placed</span>
                    <span className={styles.timelineDate}>{formatDate(orderData.date)}</span>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineLabel}>Payment Confirmed</span>
                    <span className={styles.timelineDate}>{formatDate(orderData.date)}</span>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDotActive}></div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineLabel}>Processing</span>
                    <span className={styles.timelineDate}>Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails