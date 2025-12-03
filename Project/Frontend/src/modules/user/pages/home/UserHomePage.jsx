import styles from './UserHomePage.module.css'
import { Link } from 'react-router'
import Navbar from '../../components/navbar/Navbar'
import UserRoutes from '../../../../routes/UserRoutes'
import HeroBanner from '../../components/herobanner/HeroBanner'

const UserHomePage = () => {
  return (
    <div className={styles.homePage}>
        <Navbar />
        <div className={styles.home_content}>
          <UserRoutes />
          <HeroBanner />
        </div>
      </div>
  )
}

export default UserHomePage