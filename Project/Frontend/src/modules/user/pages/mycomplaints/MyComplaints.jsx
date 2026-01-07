import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  RiCustomerService2Line,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import axios from "axios";
import styles from "./MyComplaints.module.css";

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const userToken = sessionStorage.getItem("token");
      const res = await axios.get(
        `http://127.0.0.1:5000/complaint/user`,{
          headers: {
            Authorization: `Bearer ${userToken}`,  
          }
        }
      );
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <RiTimeLine />;
      case "resolved":
        return <RiCheckboxCircleLine />;
      case "rejected":
        return <RiCloseCircleLine />;
      default:
        return <RiCustomerService2Line />;
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading your tickets...</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>My Complaints</h1>
          <p className={styles.subtitle}>
            Track and manage your support tickets
          </p>
        </header>

        {complaints.length === 0 ? (
          <div className={styles.emptyState}>
            <RiCustomerService2Line size={48} />
            <h3>No complaints found</h3>
            <p>
              If you have an issue with an order, go to Order Details to file a
              complaint.
            </p>
            <button
              onClick={() => navigate("/user/myorders")}
              className={styles.browseBtn}
            >
              Go to My Orders
            </button>
          </div>
        ) : (
          <div className={styles.complaintList}>
            {complaints.map((item) => (
              <div key={item._id} className={styles.complaintCard}>
                <div className={styles.cardMain}>
                  <img
                    src={`http://127.0.0.1:5000/images/${item.productId.productImage}`}
                    alt={item.productId.productName}
                    className={styles.productImg}
                  />

                  <div className={styles.details}>
                    <div className={styles.topRow}>
                      <span className={styles.orderId}>
                        Order #{item.orderItemId._id.slice(-8)}
                      </span>
                      <div
                        className={`${styles.statusBadge} ${
                          styles[item.complaintStatus.toLowerCase()]
                        }`}
                      >
                        {getStatusIcon(item.complaintStatus)}
                        {item.complaintStatus}
                      </div>
                    </div>

                    <h3 className={styles.productName}>
                      {item.productId.productName}
                    </h3>
                    <h4 className={styles.complaintTitle}>
                      {item.complaintTitle}
                    </h4>
                    <p className={styles.description}>
                      {item.complaintDescription}
                    </p>
                  </div>
                </div>

                {item.complaintReply && (
                  <div className={styles.adminReplyBox}>
                    <div className={styles.replyHeader}>
                      <strong>Support Team Reply:</strong>
                    </div>
                    <p>{item.complaintReply}</p>
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    Submitted on {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {/* <button className={styles.viewBtn}>
                    View Thread <RiArrowRightSLine />
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
