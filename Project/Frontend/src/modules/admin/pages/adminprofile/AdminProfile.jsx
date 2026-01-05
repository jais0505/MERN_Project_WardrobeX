import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiEdit2, FiLock } from 'react-icons/fi';
import styles from './AdminProfile.module.css';
import { FaChartBar } from 'react-icons/fa';
import { SlLock } from 'react-icons/sl';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { useNavigate } from 'react-router';

const AdminProfile = () => {
  
  const adminId = sessionStorage.getItem("aid");

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchAdmin = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/AdminById/${adminId}`
        );
        setAdminData(res.data.admin);
      } catch (err) {
        console.log("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchAdmin();
  }, [adminId]);

  if (loading) return <h2 style={{textAlign:"center"}}>Loading...</h2>;

  if (!adminData) return <h2 style={{textAlign:"center"}}>Admin not found</h2>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Admin Profile</h1>
          <p className={styles.pageSubtitle}>Manage your account information</p>
        </div>

        <div className={styles.profileCard}>
          
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <FiUser size={48} />
            </div>
            <div className={styles.roleInfo}>
              <h2 className={styles.adminName}>{adminData.adminName}</h2>
              <span className={styles.roleBadge}>Administrator</span>
            </div>
          </div>

          <div className={styles.infoGrid}>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiUser size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>{adminData.adminName}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiMail size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Email Address</span>
                <span className={styles.infoValue}>{adminData.adminEmail}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiPhone size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Contact Number</span>
                <span className={styles.infoValue}>{adminData.adminContact}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.btnEditProfile} onClick={() => navigate('/admin/editprofile')}>
              <FiEdit2 size={20} />
              <span>Edit Profile</span>
            </button>
            <button className={styles.btnChangePassword} onClick={() => navigate('/admin/changepassword')}>
              <FiLock size={20} />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartBar />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>Admin Access</span>
              <span className={styles.statLabel}>Full System Control</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <SlLock />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>Secure Account</span>
              <span className={styles.statLabel}>Password Protected</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <RiVerifiedBadgeFill />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>Verified</span>
              <span className={styles.statLabel}>Email Confirmed</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
