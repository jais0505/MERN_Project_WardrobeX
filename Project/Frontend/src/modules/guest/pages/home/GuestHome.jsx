import AnnouncementBar from '../../components/announcementBar/AnnouncementBar'
import Footer from '../../components/footer/Footer'
import Hero from '../../components/hero/hero'
import Navbar from '../../components/navbar/Navbar'
import styles from './GuestHome.module.css'
const GuestHome = () => {
  return (
    <div className={styles.home_container}>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <Footer />
    </div>
  )
}

export default GuestHome