import styles from './Navbar.module.css'
import { BsCart3 } from 'react-icons/bs'
import { useState } from 'react'
import { Link } from 'react-router'
import { IoMdSearch } from 'react-icons/io'
import { HiMenu, HiX } from 'react-icons/hi'
import { CgProfile } from 'react-icons/cg'
import { FaBell, FaBox, FaGift, FaHeart, FaRegHeart, FaStar, FaTag, FaUser } from 'react-icons/fa6'
import { TbCoinRupeeFilled } from 'react-icons/tb'
import { IoLogOutOutline } from 'react-icons/io5'

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName = sessionStorage.getItem('userName');

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.nav_logo}>
        <p>WARDROBE</p>
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <HiX /> : <HiMenu />}
      </button>

      <ul className={`${styles.nav_menu} ${mobileMenuOpen ? styles.nav_menu_active : ''}`}>
        <li onClick={() => handleMenuClick("home")}>
          <Link to="/user/home" className={styles.link}>HOME</Link>
          {menu === "home" ? <hr /> : <></>}
        </li>
        <li onClick={() => handleMenuClick("about")}>
          <Link to="/user/viewproducts" className={styles.link}>PRODUCTS</Link>
          {menu === "about" ? <hr /> : <></>}
        </li>
      </ul>

      <div className={styles.nav_icons}>
        <IoMdSearch className={styles.search_icon} />

        {/* Profile with Dropdown */}
        <div className={styles.profile_container}>
          <CgProfile className={styles.profile_icon} />
          <span className={styles.userName}>{userName}</span>

          {/* Dropdown Menu */}
          <div className={styles.profile_dropdown}>
            <Link to="/user/profilesettings" className={styles.dropdown_item}>
              <FaUser className={styles.dropdown_icon} />
              <span>My Profile</span>
            </Link>

            <Link to="/user/cart" className={styles.dropdown_item}>
              <FaBox className={styles.dropdown_icon} />
              <span>Orders</span>
            </Link>

            <Link to="/user/wishlist" className={styles.dropdown_item}>
              <FaHeart className={styles.dropdown_icon} />
              <span>Wishlist</span>
            </Link>

            <Link to="/user/giftcards" className={styles.dropdown_item}>
              <FaGift className={styles.dropdown_icon} />
              <span>Gift Cards</span>
            </Link>

            <Link to="/user/notifications" className={styles.dropdown_item}>
              <FaBell className={styles.dropdown_icon} />
              <span>Notifications</span>
            </Link>

            <div className={styles.dropdown_divider}></div>

            <button className={styles.dropdown_item} onClick={() => console.log('Logout')}>
              <IoLogOutOutline className={styles.dropdown_icon} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <Link to="/user/wishlist" className={styles.nav_link}>
          <FaRegHeart className={styles.wishlist_icon} />
        </Link>

        <div className={styles.cart_wrapper}>
          <Link to="/user/cart" className={styles.nav_link}>
            <BsCart3 className={styles.cart_icon} />
            <div className={styles.nav_cart_count}>0</div>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Navbar