import { useState, useEffect } from 'react'
import styles from './HeroBanner.module.css'
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router'

const HeroBanner = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Winter Collection 2024',
      subtitle: 'Stay Warm, Look Cool',
      description: 'Discover our premium winter collection with up to 50% off on selected items',
      buttonText: 'Shop Now',
      buttonLink: '/user/viewproducts',
      image: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      backgroundColor: '#1a1a2e'
    },
    {
      id: 2,
      title: 'New Season Arrivals',
      subtitle: 'Fresh Styles Just Dropped',
      description: 'Explore the latest trends and elevate your wardrobe with our new collection',
      buttonText: 'Explore Collection',
      buttonLink: '/user/viewproducts',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
      backgroundColor: '#2d3436'
    },
    {
      id: 3,
      title: 'Summer Sale',
      subtitle: 'Up to 70% Off',
      description: 'Limited time offer on selected summer essentials. Refresh your style today',
      buttonText: 'Shop Sale',
      buttonLink: '/user/viewproducts',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200',
      backgroundColor: '#16213e'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlide])

  return (
    <div className={styles.heroBanner}>
      <div className={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundColor: slide.backgroundColor }}
          >
            {/* Background Image */}
            <div 
              className={styles.slideImage}
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>

            {/* Content Overlay */}
            <div className={styles.slideContent}>
              <div className={styles.contentWrapper}>
                <span className={styles.subtitle}>{slide.subtitle}</span>
                <h1 className={styles.title}>{slide.title}</h1>
                <p className={styles.description}>{slide.description}</p>
                <button 
                  className={styles.ctaButton}
                  onClick={() => navigate(slide.buttonLink)}
                >
                  {slide.buttonText}
                  <FaArrowRight className={styles.arrowIcon} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className={styles.navButton} onClick={prevSlide} style={{ left: '20px' }}>
        <FaChevronLeft />
      </button>
      <button className={styles.navButton} onClick={nextSlide} style={{ right: '20px' }}>
        <FaChevronRight />
      </button>

      {/* Slide Indicators */}
      <div className={styles.indicators}>
        {slides.map((_, index) => (
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

export default HeroBanner