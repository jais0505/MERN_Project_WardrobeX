import { useState, useEffect } from 'react';
import { MdCheckCircle, MdPending, MdRefresh } from 'react-icons/md';
import axios from 'axios';
import styles from './Refunds.module.css';

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, initiated, approved, completed

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:5000/admin/refunds');
      setRefunds(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      setLoading(false);
    }
  };

  const handleUpdateRefundStatus = async (orderItemId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/admin/order-item/${orderItemId}/refund`, {
        refundStatus: newStatus
      });
      
      // Update local state
      setRefunds(refunds.map(refund => 
        refund.orderItemId === orderItemId 
          ? { ...refund, refundStatus: newStatus }
          : refund
      ));
      
      alert(`Refund ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating refund:', error);
      alert('Failed to update refund status');
    }
  };

  const shortenId = (id) => {
    if (!id || id.length < 8) return id;
    return `#${id.slice(-8)}`;
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'initiated':
        return styles.statusInitiated;
      case 'approved':
        return styles.statusApproved;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  const filteredRefunds = filter === 'all' 
    ? refunds 
    : refunds.filter(r => r.refundStatus.toLowerCase() === filter);

 const displayRefunds = filteredRefunds;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loader}></div>
          <span>Loading refunds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Refund Management</h1>
            <p className={styles.pageSubtitle}>
              Manage cancelled order refunds and approvals
            </p>
          </div>
          <button className={styles.refreshBtn} onClick={fetchRefunds}>
            <MdRefresh size={20} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Refunds</div>
            <div className={styles.statValue}>{displayRefunds.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Pending Approval</div>
            <div className={styles.statValue}>
              {displayRefunds.filter(r => r.refundStatus === 'initiated').length}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Approved</div>
            <div className={styles.statValue}>
              {displayRefunds.filter(r => r.refundStatus === 'approved').length}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Completed</div>
            <div className={styles.statValue}>
              {displayRefunds.filter(r => r.refundStatus === 'completed').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All Refunds
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'initiated' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('initiated')}
          >
            Initiated
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'approved' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'completed' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Item ID</th>
                  <th>User</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayRefunds.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyState}>
                      No refunds found
                    </td>
                  </tr>
                ) : (
                  displayRefunds.map((refund) => (
                    <tr key={refund.orderItemId}>
                      <td>
                        <span className={styles.idText}>
                          {shortenId(refund.orderId)}
                        </span>
                      </td>
                      <td>
                        <span className={styles.idText}>
                          {shortenId(refund.orderItemId)}
                        </span>
                      </td>
                      <td>
                        <span className={styles.userName}>{refund.userName}</span>
                      </td>
                      <td>
                        <span className={styles.productName}>{refund.productName}</span>
                      </td>
                      <td>
                        <span className={styles.quantity}>{refund.quantity}</span>
                      </td>
                      <td>
                        <span className={styles.amount}>
                          ₹{(refund.price * refund.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td>  
                        <span className={styles.amount}>
                          {refund.reason || "Not provided"}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(refund.refundStatus)}`}>
                          {refund.refundStatus}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          {refund.refundStatus === 'initiated' && (
                            <button
                              className={styles.approveBtn}
                              onClick={() => handleUpdateRefundStatus(refund.orderItemId, 'approved')}
                            >
                              Approve
                            </button>
                          )}
                          {refund.refundStatus === 'approved' && (
                            <button
                              className={styles.completeBtn}
                              onClick={() => handleUpdateRefundStatus(refund.orderItemId, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                          {refund.refundStatus === 'completed' && (
                            <span className={styles.completedText}>
                              <MdCheckCircle size={16} /> Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refunds;