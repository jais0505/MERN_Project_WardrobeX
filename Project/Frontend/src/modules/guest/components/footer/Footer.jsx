import React from 'react'
import styles from './Footer.module.css'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        {/* Brand Section */}
        <div className={styles.footer_section}>
          <h2 className={styles.brand}>WARDROBE</h2>
          <p className={styles.tagline}>Elevate your style, define your wardrobe.</p>
          <div className={styles.social_links}>
            <a href="#" className={styles.social_icon} aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className={styles.social_icon} aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className={styles.social_icon} aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className={styles.social_icon} aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footer_section}>
          <h3 className={styles.section_title}>Quick Links</h3>
          <ul className={styles.footer_links}>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className={styles.footer_section}>
          <h3 className={styles.section_title}>Customer Service</h3>
          <ul className={styles.footer_links}>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Return & Exchange</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footer_section}>
          <h3 className={styles.section_title}>Get In Touch</h3>
          <ul className={styles.contact_info}>
            <li>
              <MdEmail className={styles.contact_icon} />
              <span>contact@wardrobe.com</span>
            </li>
            <li>
              <MdPhone className={styles.contact_icon} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <MdLocationOn className={styles.contact_icon} />
              <span>123 Fashion St, Style City</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footer_bottom}>
        <p>&copy; 2024 Wardrobe. All rights reserved.</p>
        <p>Crafted with passion for fashion</p>
      </div>
    </footer>
  )
}

export default Footer