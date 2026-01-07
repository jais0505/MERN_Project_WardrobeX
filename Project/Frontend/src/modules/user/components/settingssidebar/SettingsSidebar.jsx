import { useState } from 'react'
import styles from './SettingsSidebar.module.css'
import { FaHome, FaUser, FaMapMarkerAlt, FaCreditCard, FaWallet, FaGift, FaChevronRight } from 'react-icons/fa'
import { FaPowerOff } from 'react-icons/fa6'
import { useNavigate } from 'react-router'

const SettingsSidebar = () => {
  const [activeMenu, setActiveMenu] = useState('profile')

  const userName = sessionStorage.getItem('userName') || 'User';

  const navigate = useNavigate();

  return (
    <div className={styles.settings_sidebar}>
      {/* User Profile Header */}
      <div className={styles.profile_header}>
        <div className={styles.avatar}>
          <span className={styles.avatar_text}>{userName.charAt(0).toUpperCase()}</span>
        </div>
        <div className={styles.profile_info}>
          <p className={styles.greeting}>Hello,</p>
          <h3 className={styles.user_name}>{userName}</h3>
        </div>
      </div>

      {/* My Orders Section */}
      <div className={styles.menu_section}>
        <div className={styles.menu_item_large}>
          <div className={styles.menu_icon_wrapper}>
            <FaHome className={styles.menu_icon} />
          </div>
          <span className={styles.menu_label}>MY ORDERS</span>
          <FaChevronRight className={styles.chevron_icon} />
        </div>
      </div>

      {/* Account Settings Section */}
      <div className={styles.menu_section}>
        <div className={styles.section_header}>
          <FaUser className={styles.section_icon} />
          <h4 className={styles.section_title}>ACCOUNT SETTINGS</h4>
        </div>
        
        <div className={styles.submenu}>
          <button
            className={`${styles.submenu_item} ${activeMenu === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveMenu('profile')}
          >
            Profile Information
          </button>
        </div>
      </div>

      {/* My Stuff Section */}
      <div className={styles.menu_section}>
        <div className={styles.section_header}>
          <FaGift className={styles.section_icon} />
          <h4 className={styles.section_title}>MY STUFF</h4>
        </div>
        
        <div className={styles.submenu}>
          <button
            className={`${styles.submenu_item} ${activeMenu === 'reviews' ? styles.active : ''}`}
            onClick={() => na}
          >
            My Reviews & Ratings
          </button>
          <button
            className={`${styles.submenu_item} ${activeMenu === 'wishlist' ? styles.active : ''}`}
            onClick={() => setActiveMenu('wishlist')}
          >
            My Wishlist
          </button>
        </div>
      </div>
      {/* Logout Section */}
      <div className={styles.menu_section}>
        <div className={styles.section_header}>
          <FaPowerOff  className={styles.section_icon} />
          <h4 className={styles.section_title}>Logout</h4>
        </div>
      </div>
    </div>
  )
}

export default SettingsSidebar
