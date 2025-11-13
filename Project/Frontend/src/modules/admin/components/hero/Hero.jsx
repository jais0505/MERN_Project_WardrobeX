
import styles from './Hero.module.css'
import AdminRoutes from '../../../../routes/AdminRoutes'

const Hero = () => {
  return (
    <div className={styles.hero_container}>
        <AdminRoutes />
    </div>
  )
}

export default Hero