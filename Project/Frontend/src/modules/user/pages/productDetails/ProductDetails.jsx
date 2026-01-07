import { useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { FaCircleCheck } from "react-icons/fa6";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { RiStarFill, RiStarLine } from "react-icons/ri";

const ProductDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [variants, setVariants] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState(null);

  const userToken = sessionStorage.getItem("token");

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [selectedVariant, setSeletedVariant] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
  });

  const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now - past) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};


  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/Product/${id}`);
      if (res.data.product) {
        setProduct(res.data.product);
        // console.log("Product Details:", res.data.product);
        setReviewsData({
          averageRating: res.data.averageRating,
          totalReviews: res.data.totalReviews,
          reviews: res.data.reviews,  
        });
        console.log("Reviews Data:", res.data);
      }
    } catch (err) {
      console.error("Error fetching product details", err);
    }
  };

  const fetchVariants = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/Variant/Product/${id}`
      );
      if (res.data.variants) {
        setVariants(res.data.variants);

        if (res.data.variants.length > 0) {
          const firstVariantId = res.data.variants[0]._id;
          setSeletedVariant(firstVariantId);
          fetchVariantSizes(firstVariantId);
        }
      }
    } catch (err) {
      console.error("Error fetching variants of products", err);
    }
  };

  const fetchVariantSizes = async (variantId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/WithStockByVariant/${variantId}`
      );

      if (res.data.sizes) {
        // filter only sizes that have stock > 0
        const availableSizes = res.data.sizes.filter((s) => s.stockQty > 0);

        setSizes(availableSizes);

        // if NO size has stock → show global out of stock
        if (availableSizes.length === 0) {
          setStock({ stockQuantity: 0 });
        }
      }
    } catch (err) {
      console.error("Error fetching variant sizes", err);
    }
  };

  const fetchVariantImages = async (variantId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/VarinatImages/${variantId}`
      );
      if (res.data.images) {
        setImages(res.data.images);

        if (res.data.images.length > 0) {
          setMainImage(res.data.images[0].productImage);
        }
      }
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  const fetchStockDetails = async (variantSizeId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/VariantSize/WithStock/${variantSizeId}`
      );
      if (res.data.stock) {
        setStock(res.data.stock);
        console.log("Stock{}", stock);
      } else if (!res.data.stock) {
        console.log("Not stock for this size", res.data.stock);
      }
    } catch (err) {
      console.error("Error fetching stock data", err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchVariants();
    checkWishlist();
  }, []);

  useEffect(() => {
    if (selectedVariant) {
      fetchVariantSizes(selectedVariant);
      fetchVariantImages(selectedVariant);
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (selectedSize) {
      fetchStockDetails(selectedSize);
      console.log("VariantSizeId:", selectedSize);
    }
  }, [selectedSize]);

  const handleVariantSelect = (variantId) => {
    setSeletedVariant(variantId);
  };

  const handleSizeSelect = (variantSizeId) => {
    setSelectedSize(variantSizeId);
    setStock(null);
    fetchStockDetails(variantSizeId);
  };

  const checkWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/WishListDataFetch`,{
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (res.data.wishlist) {
        const isFound = res.data.wishlist?.some(
          (item) => item.productId._id === id
        );
        setIsWishlisted(isFound);
        console.log("wishlist item founded");
      } else {
        console.log("No wishlist item founded");
      }
    } catch (error) {
      console.error("Error checking wishlist", error);
    }
  };

  const toggleWishList = async (productId) => {
    try {
      if (isWishlisted) {
        // REMOVE FROM WISHLIST
        const res = await axios.delete(`http://localhost:5000/WishList/${productId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });

        setIsWishlisted(false);
        toast.info(res.data.message);
        console.log(res.data.message);
      } else {
        // ADD TO WISHLIST
        const res = await axios.post("http://localhost:5000/WishList", {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

        setIsWishlisted(true);
        toast.info(res.data.message);
        console.log(res.data.message);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  const addToCart = async (variantSizeId, orderItemPrice) => {
    try {
      if (!selectedSize) return toast.warn("Please select a size");
      const res = await axios.post("http://localhost:5000/OrderItem", {
        variantSizeId,
        orderItemPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
      console.log(res.data);
      if (res.data.action === "info") {
        toast.info(res.data.message);
      } else if (res.data.action === "success") {
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error("Error adding item to cart", err);
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!selectedSize) {
        toast.warn("Please select a size");
        return;
      }

      const buyNowItem = {
        productId: product._id,
        productName: product.productName,
        variantId: selectedVariant,
        variantSizeId: selectedSize,
        price: product.productPrice,
        quantity: 1,
        brand: product.brandId?.brandName,
        size: sizes.find((s) => s.variantSizeId === selectedSize)?.sizeName,
        color: variants.find((v) => v._id === selectedVariant)?.colorId
          ?.colorName,
        image: mainImage,
      };

      const res = await axios.post("http://localhost:5000/buyNowOrder", {
        product: buyNowItem,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

      if (res.data.orderId) {
        navigate("/user/checkout", {
          state: { buyNowData: buyNowItem, orderId: res.data.orderId },
        });
      }
    } catch (err) {
      console.error("Error in buy now", err);
      toast.error("Failed to create order");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Image Gallery Section */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            <img
              src={`http://127.0.0.1:5000/images/${mainImage}`}
              alt={product.productName}
              className={styles.mainImage}
            />
          </div>
          <div className={styles.thumbnailWrapper}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`http://127.0.0.1:5000/images/${img.productImage}`}
                alt={`${images.productImage} view ${idx + 1}`}
                className={`${styles.thumbnail} ${
                  mainImage === img.productImage ? styles.thumbnailActive : ""
                }`}
                onClick={() => setMainImage(img.productImage)}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.breadcrumb}>
            {product.subcategoryId?.subcategoryName} /{" "}
            {product.typeId?.typeName}
          </div>

          <h1 className={styles.productName}>{product.productName}</h1>

          <div className={styles.brandShop}>
            <span className={styles.brand}>{product.brandId?.brandName}</span>
            <span className={styles.divider}>•</span>
            <span className={styles.shop}>{product.shopId?.shopName}</span>
          </div>

          <div className={styles.price}>₹{product.productPrice}</div>

          <p className={styles.description}>{product.productDescription}</p>

          {/* Product Specifications */}
          <div className={styles.specs}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Fit:</span>
              <span className={styles.specValue}>{product.fitId?.fitName}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Material:</span>
              <span className={styles.specValue}>
                {product.materialId?.materialName}
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div className={styles.variantSection}>
            <div className={styles.variantLabel}>
              <strong>Available Color Variants:</strong>
            </div>
            <div className={styles.colorOptions}>
              {variants.map((variant) => (
                <div key={variant._id} className={styles.colorItem}>
                  <button
                    className={`
          ${styles.colorButton} 
          ${selectedVariant === variant._id ? styles.activeColor : ""}
        `}
                    style={{ backgroundColor: variant.colorId?.colorName }}
                    onClick={() => handleVariantSelect(variant._id)}
                  ></button>

                  <span className={styles.colorLabel}>
                    {variant.colorId?.colorName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className={styles.variantSection}>
            <div className={styles.variantLabel}>
              <strong>Available Sizes:</strong>
            </div>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button
                  key={size.variantSizeId}
                  className={`${styles.sizeButton} ${
                    selectedSize === size.variantSizeId ? styles.activeSize : ""
                  }`}
                  onClick={() => handleSizeSelect(size.variantSizeId)}
                >
                  {size.sizeName}
                  {selectedSize === size.variantSizeId && (
                    <span className={styles.tickSize}>
                      <FaCircleCheck />
                    </span>
                  )}
                </button>
              ))}
              {sizes.length === 0 && (
                <div className={styles.outOfStockMsg}>Out of Stock</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.wishlistBtn}
              onClick={() => toggleWishList(product._id)}
            >
              {isWishlisted ? (
                <BsHeartFill className={styles.heartFilled} />
              ) : (
                <BsHeart className={styles.heartOutline} />
              )}
            </button>
            <button
              className={`${styles.addToCart}`}
              onClick={() => addToCart(selectedSize, product.productPrice)}
            >
              Add to Cart
            </button>
            <button className={styles.buyNow} onClick={() => handleBuyNow()}>
              Buy Now
            </button>
          </div>

          <div className={styles.ratingSection}>
            <div className={styles.averageRating}>
              <span>{reviewsData.averageRating.toFixed(1)}</span>
              {[1, 2, 3, 4, 5].map((i) =>
                i <= Math.round(reviewsData.averageRating) ? (
                  <RiStarFill key={i} color="#FFD700" />
                ) : (
                  <RiStarLine key={i} color="#FFD700" />
                )
              )}
              <span>({reviewsData.totalReviews} reviews)</span>
            </div>

            {/* Latest Reviews */}
            <div className={styles.latestReviews}>
              <h3>Latest Reviews</h3>
              {reviewsData.reviews.length === 0 ? (
                <p>No reviews yet</p>
              ) : (
                reviewsData.reviews.map((r) => (
                  <div key={r._id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <strong>{r.userId?.userName || "Anonymous"}</strong>
                      <span>
                        {[1, 2, 3, 4, 5].map((i) =>
                          i <= r.ratingValue ? (
                            <RiStarFill key={i} color="#FFD700" />
                          ) : (
                            <RiStarLine key={i} color="#FFD700" />
                          )
                        )}
                      </span>
                    </div>
                    <p>{r.reviewContent}</p>
                    <small>
                     {timeAgo(r.ratingReviewDate)}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
