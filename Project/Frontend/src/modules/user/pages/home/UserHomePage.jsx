import styles from './UserHomePage.module.css'
import { Link } from 'react-router'
import Navbar from '../../components/navbar/Navbar'
import UserRoutes from '../../../../routes/UserRoutes'

const UserHomePage = () => {
  return (
    <div className={styles.homePage}>
        <Navbar />
        <div className={styles.home_content}>
          <UserRoutes />
        </div>
      </div>
  )
}

export default UserHomePage