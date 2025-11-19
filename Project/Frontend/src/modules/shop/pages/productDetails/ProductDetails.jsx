import axios from 'axios';
import styles from './ProductDetails.module.css'
import { MdEdit, MdDelete, MdAdd, MdArrowBack, MdViewList, MdInventory } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/Product/${id}`);
      if (res.data.product) {
        setProduct(res.data.product);
        console.log(res.data.product);
      }
    } catch (err) {
      console.error("Error fetching product details", err);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <>
      {!product ? (
        <div className={`${styles.loading} ${styles.dots}`}>Loading product</div>
      ) : (
        <div className={styles.container}>
          {/* Back Button */}
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <MdArrowBack /> Back to Products
          </button>

          <div className={styles.detailsWrapper}>
            {/* Product Image Section */}
            <div className={styles.imageSection}>
              <div className={styles.mainImageWrapper}>
                <img
                  src={`http://127.0.0.1:5000/images/${product.productImage}`}
                  alt={product.productName}
                  className={styles.mainImage}
                />
              </div>
              <div className={styles.stockInfo}>
                <span className={styles.stockLabel}>Available Stock:</span>
                <span className={styles.stockValue}>{product.stock} units</span>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.header}>
                <div>
                  <span className={styles.category}>{product.subcategoryId?.categoryId?.categoryName}</span>
                  <h1 className={styles.productTitle}>{product.productName}</h1>
                  {/* <p className={styles.sku}>SKU: {product.sku}</p> */}
                </div>
                <div className={styles.priceTag}>
                  <span className={styles.priceLabel}>Price</span>
                  <span className={styles.price}>₹{product.productPrice}</span>
                </div>
              </div>

              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Product Description</h3>
                <p className={styles.description}>{product.productDescription}</p>
              </div>

              <div className={styles.specsSection}>
                <h3 className={styles.sectionTitle}>Specifications</h3>
                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Brand</span>
                    <span className={styles.specValue}>{product.brandId?.brandName}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Material</span>
                    <span className={styles.specValue}>{product.materialId?.materialName}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Fitting</span>
                    <span className={styles.specValue}>{product.fitId?.fitName}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Subcategory</span>
                    <span className={styles.specValue}>{product.subcategoryId?.subcategoryName}</span>
                  </div>
                  
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Type</span>
                    <span className={styles.specValue}>{product.typeId?.typeName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>

                <button className={styles.addVariantBtn} onClick={() => navigate(`/shop/addvariant/${product._id}`)}>
                  <MdAdd /> Add Variant
                </button>

                <button className={styles.editBtn} onClick={() => navigate(`/shop/viewvariants/${product._id}`)}>
                  <MdViewList /> View Variants
                </button>
                
                <button className={styles.stockBtn} onClick={() => navigate(`/shop/addstock/${product._id}`)}>
                  <MdInventory /> Manage Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetails
