import { useEffect, useState } from 'react'
import styles from './Wishlist.module.css'
import { MdClose, MdShoppingCart } from 'react-icons/md'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'

const Wishlist = () => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem('token');
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishListItems = async () => {
    try{
      const res = await axios.get(`http://localhost:5000/WishListDataFetch`,
        {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
      );
      if(res.data.wishlist){
        setWishlistItems(res.data.wishlist);
        console.log(res.data.wishlist);
      }
    } catch (err) {
      console.log("Error fetching items",err);
    }
  }


  const removeFromWishlist = async (wishlistId) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== wishlistId))
    console.log('Removed product:', wishlistId)
    
    try{
      const res = await axios.delete(`http://localhost:5000/WishListRemoveItem/${wishlistId}`);
      console.info("Info:", res.data.message);
      toast.info(res.data.message);
    } catch (err) {
      console.error("Error removing product from wishlist",err);
    }
  }


  useEffect(() => {
    fetchWishListItems();
  },[]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <BsHeartFill className={styles.heartIcon} />
            <div>
              <h1 className={styles.title}>My Wishlist</h1>
              <p className={styles.subtitle}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <div className={styles.wishlistGrid}>
            {wishlistItems.map((item) => (
              <div key={item._id} className={styles.wishlistCard}>
                {/* Remove Button */}
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromWishlist(item._id)}
                  title="Remove from wishlist"
                >
                  <MdClose />
                </button>

                {/* Product Image */}
                <div 
                  className={styles.imageWrapper}
                  onClick={() => navigate(`/user/productdetails/${item.productId._id}`)}
                >
                  <img
                    src={`http://127.0.0.1:5000/images/${item.productId?.productImage}`}
                    alt={item.productId?.productName}
                    className={styles.productImage}
                  />
                </div>

                {/* Product Info */}
                <div className={styles.productInfo}>
                  <span className={styles.category}>{item.productId?.subcategoryId?.subcategoryName}</span>
                  <h3 
                    className={styles.productName}
                    onClick={() => navigate(`/user/productdetails/${item.productId._id}`)}
                  >
                    {item.productId?.productName}
                  </h3>

                  <div className={styles.productDetails}>
                    <span className={styles.detailItem}>
                      <strong>Brand:</strong> {item.productId?.brandId?.brandName}
                    </span>
                  </div>

                  <div className={styles.shopInfo}>
                    <span className={styles.shopName}>by {item.productId?.shopId?.shopName}</span>
                  </div>

                  <div className={styles.priceSection}>
                    <span className={styles.price}>₹ {item.productId?.productPrice}</span>
                  </div>

                  {/* Action Button */}
                  {/* {item.inStock ? (
                    <button
                      className={styles.addToCartBtn}
                      onClick={() => addToCart(item)}
                    >
                      <MdShoppingCart /> Add to Cart
                    </button>
                  ) : (
                    <button className={styles.disabledBtn} disabled>
                      Out of Stock
                    </button>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BsHeart className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
            <p className={styles.emptyText}>
              Start adding products you love to your wishlist
            </p>
            <button 
              className={styles.shopNowBtn}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist