import { FaArrowRight } from 'react-icons/fa'
import styles from './Hero.module.css'
import hero_image from '../../../../assets/images/model2-New.png'

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero_content}>
        <div className={styles.hero_left}>
          <span className={styles.hero_badge}>EXCLUSIVE FLASH SALE</span>
          
          <h1 className={styles.hero_title}>
            20% OFF YOUR<br />
            FAVORITE STYLES!
          </h1>
          
          <p className={styles.hero_description}>
            Shop Now For Chic Styles And Enjoy A Limited-Time 20% Off With Our
            Exclusive Flash Sale. Elevate Your Wardrobe Today!
          </p>
          
          <button className={styles.hero_btn}>
            <span>SHOP NOW</span>
            <FaArrowRight className={styles.btn_icon} />
          </button>
        </div>
        
        <div className={styles.hero_right}>
          <div className={styles.hero_img_wrapper}>
            <img className={styles.hero_img} src={hero_image} alt="Fashion Model" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero