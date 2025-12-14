import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>WARDROBE</h1>
          <p className={styles.heroSubtitle}>Redefining Men's Fashion, One Piece at a Time</p>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.contentWrapper}>
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <h2 className={styles.sectionTitle}>Our Story</h2>
              <p className={styles.paragraph}>
                WARDROBE was born from a simple belief: every man deserves access to quality fashion 
                that reflects his personality and style. We connect discerning shoppers with curated 
                collections from the finest retailers across the country.
              </p>
              <p className={styles.paragraph}>
                Our platform bridges the gap between independent boutiques and fashion-forward men, 
                creating a seamless marketplace where style meets convenience.
              </p>
            </div>
            <div className={styles.imageBox}></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitleCenter}>What We Stand For</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>01</div>
              <h3 className={styles.valueTitle}>Quality First</h3>
              <p className={styles.valueText}>
                Every product on our platform is carefully curated to ensure the highest standards 
                of craftsmanship and style.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>02</div>
              <h3 className={styles.valueTitle}>Empowering Shops</h3>
              <p className={styles.valueText}>
                We provide independent retailers with the tools and platform to reach a wider 
                audience and grow their business.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>03</div>
              <h3 className={styles.valueTitle}>Seamless Experience</h3>
              <p className={styles.valueText}>
                From browsing to checkout, we've designed every touchpoint to be intuitive, 
                elegant, and effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.missionBox}>
            <h2 className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              To revolutionize men's fashion retail by creating a unified platform that celebrates 
              individuality, supports local businesses, and delivers exceptional style to every doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Partner Shops</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Happy Customers</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>100K+</div>
              <div className={styles.statLabel}>Products Available</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>99%</div>
              <div className={styles.statLabel}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to Elevate Your Style?</h2>
            <p className={styles.ctaText}>
              Join thousands of men who trust WARDROBE for their fashion needs.
            </p>
            <button className={styles.ctaButton}>Start Shopping</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;