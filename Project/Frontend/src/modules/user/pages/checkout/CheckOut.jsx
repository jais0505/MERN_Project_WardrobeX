import { useEffect, useState } from "react";
import styles from "./CheckOut.module.css";
import { MdLocationOn, MdEdit, MdAdd, MdCheckCircle } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const CheckOut = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("uid");
  const [address, setAddress] = useState([]);

  const location = useLocation();
  const { buyNowData, orderId } = location.state || {};
  const product = buyNowData;
  const fetchUserAddress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/UserAddress/${userId}`
      );
      setAddress(res.data);
      setSelectedAddress(res.data);
    } catch (error) {
      console.error("Error fetching address", error);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(1);

  const calculateTotals = (product) => {
    const subtotal = product.price * product.quantity;

    const platformFee = subtotal * 0.02; // 2% fee
    const shippingFee = subtotal > 1000 ? 0 : 70; // conditional delivery fee

    const total = subtotal + platformFee + shippingFee;

    return {
      subtotal: subtotal.toFixed(2),
      platformFee: platformFee.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const totals = calculateTotals(product);

  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/create-order", {
        amount: totals.total,
        orderId
      });

      const order = await res.data;

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: "INR",
      name: "Shop Name",
      description: "Order Payment",
      order_id: order.id,

      handler: function (response) {
        verifyPayment(response); // move to verification step
      },

      prefill: {
        name: "User",
        email: "user@gmail.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed");
    }
  };

  const verifyPayment = async (resData) => {
    const verify = await fetch("http://localhost:5000/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...resData,
        orderId: orderId,
        amount: totals.total,
        userId
      }),
    });

    const data = await verify.json();

    if (data.message === "Payment verified") {
      toast.success("Payment successful!");

      // place order here
      placeOrder();
    } else {
      alert("Payment failed");
    }
  };

  const placeOrder = () => {
    navigate("/user/order-success");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Column - Product & Address */}
        <div className={styles.leftColumn}>
          {/* Product Details */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.productCard}>
              <img
                src={`http://127.0.0.1:5000/images/${product?.image}`}
                alt={product.productName}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <h3 className={styles.productName}>{product.productName}</h3>
                <div className={styles.productSpecs}>
                  <span>
                    <strong>Brand:</strong> {product.brand}
                  </span>
                  <span>
                    <strong>Color:</strong> {product.color}
                  </span>
                  <span>
                    <strong>Size:</strong> {product.size}
                  </span>
                  <span>
                    <strong>Quantity:</strong> {product.quantity}
                  </span>
                </div>
                <div className={styles.productPrice}>
                  <span className={styles.priceLabel}>Price:</span>
                  <span className={styles.priceValue}>₹{product.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Selection */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Delivery Address</h2>
            </div>

            <div className={styles.addressList}>
              {address && (
                <div
                  className={`${styles.addressCard} ${
                    selectedAddress ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className={styles.addressInfo}>
                    <div className={styles.addressName}>
                      <strong>Delivery Address:</strong>
                    </div>
                    <div className={styles.addressLine}>{address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Price Summary */}
        <div className={styles.rightColumn}>
          <div className={styles.priceSummary}>
            <h2 className={styles.summaryTitle}>Price Details</h2>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Platform Fee (2%)</span>
                <span>₹{totals.platformFee}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>
                  {totals.shippingFee === "0.00"
                    ? "FREE"
                    : `₹${totals.shippingFee}`}
                </span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span className={styles.totalAmount}>₹{totals.total}</span>
              </div>
            </div>

            <button
              className={styles.paymentBtn}
              onClick={handleProceedToPayment}
              disabled={!selectedAddress}
            >
              Proceed to Payment
            </button>

            <div className={styles.securePayment}>
              <MdCheckCircle className={styles.secureIcon} />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
