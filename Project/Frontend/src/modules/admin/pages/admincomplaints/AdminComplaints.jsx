import React, { useState, useEffect } from 'react';
import { RiFilter2Line, RiChatForwardLine, RiCloseLine, RiCheckLine, RiUserSettingsLine } from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './AdminComplaints.module.css';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Update State for the detail view
  const [reply, setReply] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(c => c.status === filter));
    }
  }, [filter, complaints]);

  const fetchAllComplaints = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/admin/complaints');
      setComplaints(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
      setLoading(false);
    }
  };

  const handleSelect = (complaint) => {
    setSelectedComplaint(complaint);
    setReply(complaint.adminReply || '');
    setStatusUpdate(complaint.status);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/admin/complaint/${selectedComplaint.complaintId}`, {
        adminReply: reply,
        status: statusUpdate
      });
      toast.success("Ticket Updated");
      fetchAllComplaints(); // Refresh list
      setSelectedComplaint(null); // Close panel
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) return <div className={styles.loader}>Accessing Database...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContent}>
        {/* Header & Filters */}
        <header className={styles.header}>
          <div>
            <h1>Customer Complaints</h1>
            <p>Resolve issues and manage customer tickets</p>
          </div>
          <div className={styles.filterBar}>
            <RiFilter2Line />
            {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(f => (
              <button 
                key={f} 
                className={filter === f ? styles.activeFilter : ''}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* Complaints Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.complaintTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Complaint Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(c => (
                <tr key={c.complaintId} onClick={() => handleSelect(c)}>
                  <td>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{c.user.name}</span>
                      <span className={styles.userId}>ID: {c.userId}</span>
                    </div>
                  </td>
                  <td>{c.product.name}</td>
                  <td className={styles.titleCell}>{c.title}</td>
                  <td>
                    <span className={`${styles.statusTag} ${styles[c.status.toLowerCase().replace(' ', '')]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className={styles.viewBtn}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-in Detail Panel */}
      {selectedComplaint && (
        <div className={styles.sidePanelOverlay} onClick={() => setSelectedComplaint(null)}>
          <div className={styles.sidePanel} onClick={e => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2>Ticket Details</h2>
              <button onClick={() => setSelectedComplaint(null)}><RiCloseLine /></button>
            </div>

            <div className={styles.panelBody}>
              <section className={styles.detailSection}>
                <label>Complaint Description</label>
                <p>{selectedComplaint.description}</p>
              </section>

              <hr />

              <section className={styles.updateSection}>
                <div className={styles.inputGroup}>
                  <label>Update Status</label>
                  <select 
                    value={statusUpdate} 
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Admin Reply</label>
                  <textarea 
                    value={reply} 
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your response to the customer..."
                  />
                </div>
              </section>
            </div>

            <div className={styles.panelFooter}>
              <button className={styles.saveBtn} onClick={handleUpdate}>
                <RiCheckLine /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;