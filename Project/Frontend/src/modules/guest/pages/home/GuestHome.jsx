import About from '../../components/about/About'
import AnnouncementBar from '../../components/announcementBar/AnnouncementBar'
import Footer from '../../components/footer/Footer'
import Hero from '../../components/hero/Hero'
import Navbar from '../../components/navbar/Navbar'
import Product from '../../components/products/Product'
import styles from './GuestHome.module.css'
const GuestHome = () => {
  return (
    <div className={styles.home_container}>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <Product />
      <About />
      <Footer />
    </div>
  )
}

export default GuestHome