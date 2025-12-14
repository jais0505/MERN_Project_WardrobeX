import { FiSearch, FiShoppingCart } from "react-icons/fi";
import styles from "./Navbar.module.css";
import { Link } from "react-router";
import { HiOutlineUserCircle } from "react-icons/hi";
import { CiShop } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarWrapper}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <h1 className={styles.logoText}>WARDROBE</h1>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinksSection}>
          <Link to="/shop/home" className={styles.link}>
            <span className={styles.navLink}>HOME</span>
          </Link>
          <Link to="/shop/orders" className={styles.link}>
            <span className={styles.navLink}>ORDERS</span>
          </Link>
          <Link to="/shop/product" className={styles.link}>
            <span className={styles.navLink}>ADD PRODUCT</span>
          </Link>
          <Link to="/shop/viewproducts" className={styles.link}>
            <span className={styles.navLink}>VIEW PRODUCTS</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className={styles.navActionsSection}>
          <button className={styles.searchButton}>
            <FiSearch className={styles.navIocns} />
          </button>
          <Link to="/shop/profile" className={styles.link}>
            <button className={styles.searchButton}>
              <CgProfile className={styles.navIocns} />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
