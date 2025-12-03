import { useState, useEffect } from 'react'
import styles from './ShopHeroBanner.module.css'
import { FaBox, FaChartLine, FaUsers, FaStore } from 'react-icons/fa'
import { useNavigate } from 'react-router'

const ShopHeroBanner = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Background carousel images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600'
  ]

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Sample shop stats - Replace with actual data from API
  const stats = [
    { icon: <FaBox />, value: '156', label: 'Total Products', color: '#3b82f6' },
    { icon: <FaChartLine />, value: '2,450', label: 'Total Orders', color: '#10b981' },
    { icon: <FaUsers />, value: '1,234', label: 'Customers', color: '#f59e0b' },
    { icon: <FaStore />, value: '4.8★', label: 'Shop Rating', color: '#ef4444' }
  ]

  const shopName = sessionStorage.getItem('shopName') || 'Shop';

  return (
    <div className={styles.heroBanner}>
      {/* Background Carousel */}
      <div className={styles.backgroundCarousel}>
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`${styles.backgroundSlide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.content}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.textContent}>
            <span className={styles.greeting}>Welcome back,</span>
            <h1 className={styles.shopName}>{shopName}</h1>
            <p className={styles.subtitle}>
              Manage your products, track orders, and grow your business
            </p>
            
            <div className={styles.quickActions}>
              <button 
                className={styles.primaryBtn}
                onClick={() => navigate('/shop/product')}
              >
                <FaBox /> Add New Product
              </button>
              <button 
                className={styles.secondaryBtn}
                onClick={() => navigate('')}
              >
                View Orders
              </button>
            </div>
          </div>

          {/* Illustration/Image */}
          <div className={styles.illustration}>
            <div className={styles.illustrationBg}>
              <FaStore className={styles.storeIcon} />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div 
                className={styles.statIcon}
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className={styles.indicators}>
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ShopHeroBanner
