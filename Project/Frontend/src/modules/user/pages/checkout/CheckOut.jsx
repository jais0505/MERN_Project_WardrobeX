import { useEffect, useState } from "react";
import styles from "./CheckOut.module.css";
import { MdLocationOn, MdCheckCircle } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const CheckOut = () => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem('token');
  const location = useLocation();

  // Determine if checkout is for Cart or Buy Now
  const { buyNowData, orderId, cartItems, cartTotals, isCart } =
    location.state || {};

  const [userInfo, setUserInfo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [itemsToCheckout, setItemsToCheckout] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    platformFee: 0,
    shippingFee: 0,
    total: 0,
  });

  // Fetch user address
  const fetchUserAddress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/UserAddress`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setUserInfo(res.data);
      setSelectedAddress(res.data.userAddress);
    } catch (error) {
      console.error("Error fetching address", error);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  // Set items and totals depending on Cart or Buy Now
  useEffect(() => {
    if (isCart && cartItems && cartTotals) {
      setItemsToCheckout(cartItems);
      setTotals(cartTotals);
    } else if (buyNowData) {
      // Map Buy Now data to match cartItems structure
      const formattedBuyNow = [
        {
          _id: buyNowData._id || "buyNow",
          productName: buyNowData.productName,
          productPrice: buyNowData.price,
          productImage: buyNowData.image, // matches cart
          brandName: buyNowData.brand,
          colorName: buyNowData.color,
          sizeName: buyNowData.size,
          quantity: buyNowData.quantity,
        },
      ];

      setItemsToCheckout(formattedBuyNow);

      const subtotal = buyNowData.price * buyNowData.quantity;
      const platformFee = subtotal * 0.02;
      const shippingFee = subtotal > 1000 ? 0 : 70;
      const total = subtotal + platformFee + shippingFee;

      setTotals({
        subtotal: subtotal.toFixed(2),
        platformFee: platformFee.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        total: total.toFixed(2),
      });
    } else {
      // fallback if no data passed
      setItemsToCheckout([]);
      setTotals({ subtotal: 0, platformFee: 0, shippingFee: 0, total: 0 });
    }
  }, [buyNowData, cartItems, cartTotals, isCart]);

  // Proceed to Razorpay payment
  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/create-order", {
        amount: totals.total,
        orderId,
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
          verifyPayment(response);
        },

        prefill: {
          name: userInfo?.userName || "User",
          email: "user@gmail.com",
          contact: userInfo?.contactNo || "9999999999",
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
    try {
      const verify = await fetch("http://localhost:5000/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
         },
        body: JSON.stringify({
          ...resData,
          orderId: orderId,
          amount: totals.total,
          userName: userInfo.userName,
          contactNo: userInfo.contactNo,
          deliveryAddress: selectedAddress,
        }),
      });

      const data = await verify.json();

      if (data.message === "Payment verified") {
        toast.success("Payment successful!");
        placeOrder(data);
      } else {
        alert("Payment failed");
      }
    } catch (err) {
      console.error("Verification error", err);
      alert("Payment verification failed");
    }
  };

  const placeOrder = (orderDetails) => {
    const estimatedDelivery = new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    navigate("/user/order-success", {
      state: {
        orderId: orderDetails.orderId,
        paymentId: orderDetails.paymentId,
        amount: orderDetails.amount,
        address: orderDetails.deliveryAddress,
        estimatedDelivery,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Column - Products & Address */}
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            {itemsToCheckout.map((product, idx) => (
              <div key={idx} className={styles.productCard}>
                <img
                  src={`http://127.0.0.1:5000/images/${product.productImage}`}
                  alt={product.productName}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <h3 className={styles.productName}>{product.productName}</h3>
                  <div className={styles.productSpecs}>
                    <span>
                      <strong>Brand:</strong> {product.brandName}
                    </span>
                    <span>
                      <strong>Color:</strong> {product.colorName || "N/A"}
                    </span>
                    <span>
                      <strong>Size:</strong> {product.sizeName}
                    </span>
                    <span>
                      <strong>Quantity:</strong> {product.quantity}
                    </span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.priceLabel}>Price:</span>
                    <span className={styles.priceValue}>
                      ₹{product.productPrice}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Address Selection */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>
            {userInfo && (
              <div
                className={`${styles.addressCard} ${
                  selectedAddress ? styles.selected : ""
                }`}
                onClick={() => setSelectedAddress(userInfo.userAddress)}
              >
                <div className={styles.addressHeader}>
                  <div className={styles.radioBtn}>
                    {selectedAddress && (
                      <MdCheckCircle className={styles.checkIcon} />
                    )}
                  </div>
                  <div className={styles.addressInfo}>
                    <div className={styles.addressName}>
                      {userInfo.userName}
                    </div>
                    <div className={styles.addressPhone}>
                      {userInfo.contactNo}
                    </div>
                  </div>
                </div>
                <div className={styles.addressDetails}>
                  <MdLocationOn className={styles.locationIcon} />
                  <p className={styles.addressLine}>{userInfo.userAddress}</p>
                </div>
              </div>
            )}
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
