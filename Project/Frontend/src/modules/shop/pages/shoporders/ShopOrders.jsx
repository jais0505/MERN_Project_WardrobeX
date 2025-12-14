import React, { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiCalendar, FiUser, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { MdPendingActions } from 'react-icons/md';
import { AiOutlineInbox } from 'react-icons/ai';
import styles from './ShopOrders.module.css';
import { useNavigate } from 'react-router';

const ShopOrders = () => {
      const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample orders data
  const ordersData = [
    {
      id: 'ORD-2847',
      date: '2024-12-14',
      customerName: 'Rajesh Kumar',
      totalAmount: 8999,
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      itemsCount: 3
    },
    {
      id: 'ORD-2846',
      date: '2024-12-14',
      customerName: 'Amit Sharma',
      totalAmount: 5499,
      orderStatus: 'shipped',
      paymentStatus: 'paid',
      itemsCount: 2
    },
    {
      id: 'ORD-2845',
      date: '2024-12-13',
      customerName: 'Vikram Singh',
      totalAmount: 12999,
      orderStatus: 'processing',
      paymentStatus: 'paid',
      itemsCount: 5
    },
    {
      id: 'ORD-2844',
      date: '2024-12-13',
      customerName: 'Arjun Reddy',
      totalAmount: 3299,
      orderStatus: 'payment_success',
      paymentStatus: 'paid',
      itemsCount: 1
    },
    {
      id: 'ORD-2843',
      date: '2024-12-12',
      customerName: 'Karthik Iyer',
      totalAmount: 15999,
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      itemsCount: 4
    },
    {
      id: 'ORD-2842',
      date: '2024-12-12',
      customerName: 'Rohit Mehta',
      totalAmount: 7499,
      orderStatus: 'shipped',
      paymentStatus: 'paid',
      itemsCount: 2
    },
    {
      id: 'ORD-2841',
      date: '2024-12-11',
      customerName: 'Suresh Patel',
      totalAmount: 9999,
      orderStatus: 'processing',
      paymentStatus: 'paid',
      itemsCount: 3
    },
    {
      id: 'ORD-2840',
      date: '2024-12-11',
      customerName: 'Deepak Verma',
      totalAmount: 4599,
      orderStatus: 'payment_success',
      paymentStatus: 'paid',
      itemsCount: 1
    }
  ];

  const statusConfig = {
    payment_success: { label: 'Payment Success', color: '#10b981' },
    processing: { label: 'Processing', color: '#f59e0b' },
    shipped: { label: 'Shipped', color: '#3b82f6' },
    delivered: { label: 'Delivered', color: '#8b5cf6' }
  };

  // Filter orders
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate stats
  const totalOrders = ordersData.length;
  const deliveredOrders = ordersData.filter(o => o.orderStatus === 'delivered').length;
  const processingOrders = ordersData.filter(o => o.orderStatus === 'processing').length;
  const shippedOrders = ordersData.filter(o => o.orderStatus === 'shipped').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Shop Orders</h1>
          <p className={styles.subtitle}>Manage and track all your orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiPackage size={28} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Orders</p>
            <h3 className={styles.statValue}>{totalOrders}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MdPendingActions size={28} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Processing</p>
            <h3 className={styles.statValue}>{processingOrders}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiTruck size={28} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Shipped</p>
            <h3 className={styles.statValue}>{shippedOrders}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCheckCircle size={28} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Delivered</p>
            <h3 className={styles.statValue}>{deliveredOrders}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="payment_success">Payment Success</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders List */}
      <div className={styles.ordersContainer}>
        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <AiOutlineInbox className={styles.emptyIcon} size={80} />
            <h3 className={styles.emptyTitle}>No orders found</h3>
            <p className={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Orders will appear here once customers place them'}
            </p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderIdSection}>
                    <span className={styles.orderIdLabel}>Order ID</span>
                    <span className={styles.orderId}>{order.id}</span>
                  </div>
                  <div className={styles.orderDate}>
                    <FiCalendar size={16} />
                    {formatDate(order.date)}
                  </div>
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.orderInfo}>
                    <div className={styles.infoGroup}>
                      <span className={styles.infoLabel}>
                        <FiUser size={14} /> Customer
                      </span>
                      <span className={styles.infoValue}>{order.customerName}</span>
                    </div>
                    <div className={styles.infoGroup}>
                      <span className={styles.infoLabel}>
                        <FiShoppingBag size={14} /> Items
                      </span>
                      <span className={styles.infoValue}>{order.itemsCount} items</span>
                    </div>
                    <div className={styles.infoGroup}>
                      <span className={styles.infoLabel}>Total Amount</span>
                      <span className={styles.infoValueAmount}>{formatAmount(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className={styles.orderStatus}>
                    <div className={styles.statusGroup}>
                      <span className={styles.statusLabel}>Order Status</span>
                      <span 
                        className={styles.statusBadge}
                        style={{ 
                          backgroundColor: `${statusConfig[order.orderStatus].color}15`,
                          color: statusConfig[order.orderStatus].color 
                        }}
                      >
                        {statusConfig[order.orderStatus].label}
                      </span>
                    </div>
                    <div className={styles.statusGroup}>
                      <span className={styles.statusLabel}>Payment</span>
                      <span className={styles.paymentBadge}>
                        <FiCheckCircle size={14} /> Paid
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.orderFooter}>
                  <button className={styles.viewDetailsBtn} onClick={() => navigate("/shop/order-details")}>
                    View Details <FiArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrders