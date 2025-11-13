import styles from './Navbar.module.css'
import { BsCart3 } from 'react-icons/bs'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { IoMdSearch } from 'react-icons/io'
import { HiMenu, HiX } from 'react-icons/hi'

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.nav_logo}>
        <p>WARDROBE</p>
      </div>

      {/* Hamburger Menu Icon */}
      <button 
        className={styles.hamburger}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Navigation Menu */}
      <ul className={`${styles.nav_menu} ${mobileMenuOpen ? styles.nav_menu_active : ''}`}>
        <li onClick={() => handleMenuClick("home")}>
          <Link to="/" className={styles.link}>HOME</Link>
          {menu === "home" ? <hr /> : <></>}
        </li>
        <li onClick={() => handleMenuClick("about")}>
          <Link to="/" className={styles.link}>ABOUT</Link>
          {menu === "about" ? <hr /> : <></>}
        </li>
        <li onClick={() => handleMenuClick("userreg")}>
          <Link to="/userreg" className={styles.link}>USER REGISTRATION</Link>
          {menu === "userreg" ? <hr /> : <></>}
        </li>
        <li onClick={() => handleMenuClick("shopreg")}>
          <Link to="/shopreg" className={styles.link}>SHOP REGISTRATION</Link>
          {menu === "shopreg" ? <hr /> : <></>}
        </li>
      </ul>

      {/* Login and Cart Section */}
      <div className={styles.nav_login_cart}>
        <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}>Login</button>
        <div className={styles.nav_icons}>
          <IoMdSearch className={styles.search_icon} />
          <div className={styles.cart_wrapper}>
            <BsCart3 className={styles.cart_icon} />
            <div className={styles.nav_cart_count}>0</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar