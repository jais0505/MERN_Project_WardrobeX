import styles from './UserHomePage.module.css'
import { Link, useLocation } from 'react-router'
import Navbar from '../../components/navbar/Navbar'
import UserRoutes from '../../../../routes/UserRoutes'
import HeroBanner from '../../components/herobanner/HeroBanner'
import Footer from '../../components/footer/Footer'
import ViewProducts from '../viewProducts/ViewProducts'
import ProductsGrid from '../../components/productsgrid/ProductsGrid'

const UserHomePage = () => {
   const location = useLocation();

  const isHome = location.pathname === "/user/home" || location.pathname === "/";
  return (
    <div className={styles.homePage}>
        <Navbar />
        <div className={styles.home_content}>
          <UserRoutes />
          { isHome && <HeroBanner />}
          { isHome && <ViewProducts />}
        </div>
        <Footer />
      </div>
  )
}

export default UserHomePage