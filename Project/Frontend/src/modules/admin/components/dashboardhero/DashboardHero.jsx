import { FaUsers } from 'react-icons/fa'
import styles from './DashboardHero.module.css'
import { BsShop } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'
import { HiOutlineCurrencyDollar } from 'react-icons/hi'
import { MdTimeline } from 'react-icons/md'

const DashboardHero = () => {
  return (
    <div className={styles.hero_card}>
      <div className={styles.info_card}>
        <div className={styles.graph_dummy}>
          <div className={styles.graph_line}></div>
          <div className={styles.graph_line}></div>
          <div className={styles.graph_line}></div>
          <div className={styles.graph_line}></div>
          <div className={styles.graph_curve}></div>
        </div>

        <div className={styles.row1}>
          <div className={styles.card}>
            <FaUsers className={styles.card_icon} />
            <h3>Total Users</h3>
            <p>10K</p>
          </div>
          <div className={styles.card}>
            <BsShop className={styles.card_icon} />
            <h3>Total Shops</h3>
            <p>42</p>
          </div>
          <div className={styles.card}>
            <FiShoppingCart className={styles.card_icon} /> 
            <h3>Total Orders</h3>
            <p>910</p>
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.card_large}>
            <MdTimeline className={styles.card_icon} /> 
            <h3>Recent Activity</h3>
            <p>+ 23 new users joined this week</p>
          </div>
          <div className={styles.card_large}>
            <HiOutlineCurrencyDollar className={styles.card_icon} /> 
            <h3>Sales Overview</h3>
            <p>₹ 1,24,500 total revenue</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardHero
