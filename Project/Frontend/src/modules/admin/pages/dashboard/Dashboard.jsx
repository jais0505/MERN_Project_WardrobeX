import React from 'react'
import styles from './Dashboard.module.css'
import SideBar from '../../components/sidebar/SideBar'
import NavBar from '../../components/navbar/NavBar'
import Hero from '../../components/hero/Hero'
import AdminRoutes from '../../../../routes/AdminRoutes'

const Dashboard = () => {
    return (
        <div className={styles.dashboard_container}>
            <div className={styles.left_container}>
                <SideBar />
            </div>
            <div className={styles.right_container}>
                <div className={styles.navbar_wrapper}>
                    <NavBar />
                </div>
                <div className={styles.hero_container}>
                    <AdminRoutes />
                </div>
            </div>
        </div>
    )
}

export default Dashboard