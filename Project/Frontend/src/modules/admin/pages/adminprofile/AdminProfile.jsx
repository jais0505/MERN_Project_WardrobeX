import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiEdit2, FiLock } from 'react-icons/fi';
import styles from './AdminProfile.module.css';

const AdminProfile = () => {
  // Sample admin data - replace with actual data from API/context
  const [adminData] = useState({
    name: 'John Anderson',
    email: 'admin@example.com',
    contact: '+91 98765 43210',
    role: 'Administrator',
    joinedDate: 'January 2024'
  });

  const handleEditProfile = () => {
    console.log('Edit Profile clicked');
    // Navigate to edit profile page or open modal
  };

  const handleChangePassword = () => {
    console.log('Change Password clicked');
    // Navigate to change password page or open modal
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Admin Profile</h1>
          <p className={styles.pageSubtitle}>Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <FiUser size={48} />
            </div>
            <div className={styles.roleInfo}>
              <h2 className={styles.adminName}>{adminData.name}</h2>
              <span className={styles.roleBadge}>{adminData.role}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiUser size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>{adminData.name}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiMail size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Email Address</span>
                <span className={styles.infoValue}>{adminData.email}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiPhone size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Contact Number</span>
                <span className={styles.infoValue}>{adminData.contact}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                <FiUser size={24} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Member Since</span>
                <span className={styles.infoValue}>{adminData.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.btnEditProfile} onClick={handleEditProfile}>
              <FiEdit2 size={20} />
              <span>Edit Profile</span>
            </button>
            <button className={styles.btnChangePassword} onClick={handleChangePassword}>
              <FiLock size={20} />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>Admin Access</span>
              <span className={styles.statLabel}>Full System Control</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔒</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>Secure Account</span>
              <span className={styles.statLabel}>2FA Enabled</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
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