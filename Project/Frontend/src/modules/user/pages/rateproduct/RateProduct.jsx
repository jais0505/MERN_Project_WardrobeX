import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { MdStar, MdStarBorder } from "react-icons/md";
import styles from "./RateProduct.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const RateProduct = () => {
  const navigate = useNavigate();
  const { orderItemId } = useParams();
  const location = useLocation();

  const userToken = sessionStorage.getItem('token');

  const [productData, setProductData] = useState(
    location.state?.product || null
  );
  const [ratingValue, setRatingValue] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHARS = 500;

  useEffect(() => {
    if (!productData && orderItemId) {
      const fetchProductData = async () => {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/order/item/${orderItemId}`
          );
          
          setProductData(res.data);
        } catch (error) {
          console.error("Failed to fetch product data:", error);
        }
      };
      fetchProductData();
    }
  }, [orderItemId, productData]);

  const handleSubmit = async () => {
  if (ratingValue === 0 || !reviewContent.trim()) return;

  setSubmitting(true);

  try {
    const res = await axios.post('http://127.0.0.1:5000/review', {
      orderItemId,
      ratingValue,
      reviewContent
    },
    {
      headers: {
       Authorization: `Bearer ${userToken}`,
      }
    }
  );

    toast.info("Review submitted:", res.data);
    setSubmitted(true);
   setTimeout(() => {
      navigate(-1);
    }, 3000);
  } catch (err) {
    console.error("Failed to submit review:", err);
    toast.warning(err.response?.data?.message || "Failed to submit review");
  } finally {
    setSubmitting(false);
  }
};


  const product = productData;

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <MdStar size={64} />
          </div>
          <h2 className={styles.successTitle}>Thank You!</h2>
          <p className={styles.successText}>
            Your review has been submitted successfully
          </p>
          <div className={styles.successStars}>
            {[...Array(ratingValue)].map((_, i) => (
              <MdStar key={i} size={32} className={styles.goldStar} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
  return (
    <div className={styles.container}>
      <p>Loading product...</p>
    </div>
  );
}


  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h2 className={styles.pageTitle}>Rate Product</h2>
        </div>

        {/* Product Preview Card */}
        <div className={styles.productCard}>
          <div className={styles.productImageWrapper}>
            <img
              src={`http://127.0.0.1:5000/images/${product.productImage}`}
              alt={product.productName}
              className={styles.productImage}
            />
          </div>
          <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.productName}</h3>
            <p className={styles.brandName}>{product.brandName}</p>
            <div className={styles.variants}>
              <span className={styles.variantTag}>
                Size: {product.sizeName}
              </span>
              <span className={styles.variantDot}>•</span>
              <span className={styles.variantTag}>
                Color: {product.colorName}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className={styles.ratingSection}>
          <h3 className={styles.sectionTitle}>
            How would you rate this product?
          </h3>
          <div className={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={styles.starButton}
                onClick={() => setRatingValue(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                {star <= (hoveredStar || ratingValue) ? (
                  <MdStar className={styles.filledStar} />
                ) : (
                  <MdStarBorder className={styles.emptyStar} />
                )}
              </button>
            ))}
          </div>
          {ratingValue > 0 && (
            <p className={styles.ratingText}>
              {ratingValue === 1 && "Poor"}
              {ratingValue === 2 && "Fair"}
              {ratingValue === 3 && "Good"}
              {ratingValue === 4 && "Very Good"}
              {ratingValue === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review Section */}
        <div className={styles.reviewSection}>
          <h3 className={styles.sectionTitle}>Write your review</h3>
          <textarea
            value={reviewContent}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setReviewContent(e.target.value);
              }
            }}
            placeholder="Share your experience with this product..."
            className={styles.textarea}
            rows={6}
          />
          <div className={styles.charCounter}>
            {reviewContent.length} / {MAX_CHARS} characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitting || ratingValue === 0 || !reviewContent.trim()}
        >
          {submitting ? (
            <>
              <span className={styles.spinner}></span>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>

        <p className={styles.helperText}>
          Your review will help other customers make informed decisions
        </p>
      </div>
    </div>
  );
};

export default RateProduct;
