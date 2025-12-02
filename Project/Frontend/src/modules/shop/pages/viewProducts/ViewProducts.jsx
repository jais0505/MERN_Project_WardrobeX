import { useEffect, useState } from 'react'
import styles from './ViewProducts.module.css'
import { BsEye, BsSearch } from 'react-icons/bs'
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router'
import axios from 'axios'

const ViewProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ products, setProducts] =useState([]);
  const navigate = useNavigate();
  const shopId = sessionStorage.getItem('sid');
  console.log("ShopId:", shopId);

  const fetchProducts = async () => {
    try{
        const res = await axios.get(`http://localhost:5000/Product/Shop/${shopId}`);
        if(res.data.products){
          setProducts(res.data.products);
          console.log("Products:", res.data.products);
        }
    } catch (err) {
      console.error("Error Fetching products", err);
    }
  }

  useEffect(() => {
    fetchProducts();
  },[]);


  const filteredProducts = products.filter(products =>
    products.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    products.subcategoryId?.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>View Products</h1>
          <p className={styles.subtitle}>View and manage all your products</p>
        </div>
        
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <BsSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      
      <div className={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={`http://127.0.0.1:5000/images/${product.productImage}`}
                  alt={product.productName}
                  className={styles.productImage}
                />
                {/* <div className={styles.stockBadge}>
                  Stock: {product.stock}
                </div> */}
              </div>

              <div className={styles.productContent}>
                <span className={styles.category}>{product.subcategoryId?.subcategoryName}</span>
                <h3 className={styles.productName}>{product.productName}</h3>
                <p className={styles.productDescription}>
                  {product.productDescription.length > 100
                    ? `${product.productDescription.substring(0, 100)}...`
                    : product.productDescription}
                </p>
                <div className={styles.priceSection}>
                  <span className={styles.price}>₹{product.productPrice}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => navigate(`/shop/productdetails/${product._id}`)}
                >
                  <BsEye /> View More
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No products found</p>
          </div>
        )}
      </div>

      
    </div>
  )
}

export default ViewProducts