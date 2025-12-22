import { useState } from 'react'
import styles from './Product.module.css'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const Product = () => {
  const [activeCategory, setActiveCategory] = useState('MAN')
  const [favorites, setFavorites] = useState({})

  const categories = ['CLOTHS', 'SHOES', 'ACCESSORIES']

  const products = [
    {
      id: 1,
      name: 'WINTER MAN JACKET',
      price: 100,
      salePrice: 90,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      discount: '10% OFF',
      category: 'MAN'
    },
    {
      id: 2,
      name: 'WINTER MAN HOODIE',
      price: 100,
      salePrice: 90,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      category: 'MAN'
    },
    {
      id: 3,
      name: 'MAN TSHIRT',
      price: 100,
      salePrice: 90,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category: 'MAN'
    },
    {
      id: 4,
      name: 'WINTER MAN JACKET',
      price: 100,
      salePrice: 90,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
      discount: '20% OFF',
      category: 'MAN'
    },
  ]

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const navigate = useNavigate();

  const handleBuynow = () => {
    toast.info("Login to buy products");
    navigate('/login');
  }

  return (
    <div className={styles.products_container}>
      <div className={styles.products_header}>
        <h2 className={styles.section_title}>Top Categories</h2>
        
        <div className={styles.category_tabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.category_tab} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.products_grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.product_card}>
            {/* Product Image */}
            <div className={styles.product_image_wrapper}>
              <img 
                src={product.image} 
                alt={product.name} 
                className={styles.product_image}
              />
              
              {/* Discount Badge */}
              {product.discount && (
                <span className={styles.discount_badge}>{product.discount}</span>
              )}
              
              {/* Favorite Icon */}
              <button 
                className={styles.favorite_btn}
                onClick={() => toggleFavorite(product.id)}
              >
                {favorites[product.id] ? (
                  <BsHeartFill className={styles.heart_filled} />
                ) : (
                  <BsHeart className={styles.heart_outline} />
                )}
              </button>
              
              {/* Add to Cart Button */}
              <button className={styles.add_to_cart_btn} onClick={() => handleBuynow()}>
                Buy Now
              </button>
            </div>

            {/* Product Info */}
            <div className={styles.product_info}>
              <h3 className={styles.product_name}>{product.name}</h3>
              <div className={styles.product_price}>
                <span className={styles.original_price}>${product.price}</span>
                <span className={styles.sale_price}>${product.salePrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Product