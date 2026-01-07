import { useEffect, useState } from 'react'
import styles from './ViewProducts.module.css'
import { BsHeart, BsHeartFill, BsSearch } from 'react-icons/bs'
import { MdFilterList } from 'react-icons/md'
import { useNavigate } from 'react-router'
import axios from 'axios'

const ViewProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const userToken = sessionStorage.getItem('token');
  
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const categories = ['All', ...category.map(c => c.categoryName)];

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Category");
      if (res.data.category) {
        setCategory(res.data.category);
      }
    } catch (err) {
      console.log("Error fetching categories", err);
    }
  }

  const fetchProducts = async () => {
    try{
        const res = await axios.get('http://localhost:5000/Product');
        if(res.data.products){
            setProducts(res.data.products);
        }
    } catch (err) {
        console.error("Error fetching products",err);
    }
  }

  const fetchWishlist = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/WishListDataFetch`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
    if (res.data.wishlist) {
      setWishlist(res.data.wishlist.map(item => item.productId._id));
      console.log(res.data.wishlist);
    }
  } catch (err) {
    console.error("Error fetching wishlist:", err);
  }
};

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchWishlist();
  },[]);

  const toggleWishlist = async (productId) => {
  try {

    const isInWishlist = wishlist.includes(productId);

    if (isInWishlist) {
      // DELETE wishlist item
      await axios.delete(`http://localhost:5000/WishList/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
    );

      setWishlist(prev => prev.filter(id => id !== productId));

    } else {
      // ADD wishlist item
      await axios.post("http://localhost:5000/WishList", {
        productId
      },
      {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
    );

      setWishlist(prev => [...prev, productId]);
    }

  } catch (err) {
    console.error("Error toggling wishlist:", err);
  }
};



  

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.subcategoryId?.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brandId?.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.subcategoryId.categoryId?.categoryName === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.productPrice - b.productPrice
    if (sortBy === 'price-high') return b.productPrice - a.productPrice
    return 0 // featured
  })

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Discover Our Collection</h1>
          <p className={styles.subtitle}>Explore {sortedProducts.length} premium products</p>
        </div>

        {/* Search and Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <BsSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="featured">sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryTab} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {sortedProducts.map((product) => (
            <div 
              key={product._id} 
              className={styles.productCard}
              onClick={() => navigate(`/user/productdetails/${product._id}`)}
            >
              {/* Product Image */}
              <div className={styles.imageWrapper}>
                <img 
                  src={`http://127.0.0.1:5000/images/${product.productImage}`} 
                  alt={product.productName}
                  className={styles.productImage}
                />

                {/* Favorite Button */}
                <button 
                  className={styles.favoriteBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product._id)
                  }}
                >
                  {wishlist.includes(product._id) ? (
                    <BsHeartFill className={styles.heartFilled} />
                  ) : (
                    <BsHeart className={styles.heartOutline} />
                  )}
                </button>

                {/* Quick View Overlay */}
                <div className={styles.quickView}>
                  <span>View Details</span>
                </div>
              </div>

              {/* Product Info */}
              <div className={styles.productInfo}>
                <span className={styles.category}>{product.subcategoryId.subcategoryName}</span>
                <h3 className={styles.productName}>{product.productName}</h3>
                
                {/* Product Details */}
                <div className={styles.productDetails}>
                  <span className={styles.detailItem}>
                    <strong>Brand:</strong> {product.brandId?.brandName}
                  </span>
                </div>

                {/* Shop Name */}
                <div className={styles.shopInfo}>
                  <span className={styles.shopName}>by {product.shopId?.shopName}</span>
                </div>

                {/* Price */}
                <div className={styles.priceSection}>
                  <span className={styles.currentPrice}>₹{product.productPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No products found</p>
          <span>Try adjusting your search or filters</span>
        </div>
      )}
    </div>
  )
}

export default ViewProducts