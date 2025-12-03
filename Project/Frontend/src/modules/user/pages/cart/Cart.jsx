import { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { MdDelete, MdAdd, MdRemove, MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("uid");
  console.log("UserId:", userId);
  const [order, setOrder] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/Order/${userId}`);
      if (res.data.order) {
        console.log(res.data.order);
        setOrder(res.data.order);
      } else {
        console.log("User has no items");
      }
    } catch (err) {
      console.error("Error fetching order", err);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:5000/OrderItem/${orderId}`);
      if (res.data.item) {
        const formatted = res.data.item.map((item) => ({
          _id: item._id,
          productName: item.variantSizeId.variantId.productId.productName,
          productPrice: item.orderItemPrice,
          productImage: item.variantSizeId.variantId.productId.productImage,
          subcategoryId: item.variantSizeId.variantId.productId.subcategoryId,
          brandName: item.variantSizeId.variantId.productId.brandId.brandName,
          colorName: item.variantSizeId.variantId.colorId.colorName,
          sizeName: item.variantSizeId.sizeId.sizeName,
          quantity: 1,
          inStock: true,
        }));
        setCartItems(formatted);
        console.log("Formatted Items:", formatted);
      }
    } catch (err) {
      console.error("Error fetching order items:", err);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeCartItemById = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/OrderItemDelete/${id}`);
      fetchOrderItems(order._id);
      toast.info("Item removed form cart");
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
  };

  const calculatePlatformFee = () => {
    return cartItems.reduce((sum, item) => {
      const itemTotal = item.productPrice * item.quantity;
      const fee = itemTotal * 0.02;
      return sum + fee;
    }, 0);
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 70;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const platformFee = calculatePlatformFee();
    const deliveryFee = calculateDeliveryFee();

    return subtotal + platformFee + deliveryFee;
  };

  useEffect(() => {
    fetchOrder();
  }, [userId]);

  useEffect(() => {
    console.log("OrderId:", order._id);
    if (order?._id) {
      fetchOrderItems(order._id);
    }
  }, [order._id]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <MdShoppingCart className={styles.cartIcon} />
            <div>
              <h1 className={styles.title}>Shopping Cart</h1>
              <p className={styles.subtitle}>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className={styles.cartLayout}>
            {/* Cart Items */}
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item._id} className={styles.cartItem}>
                  {/* Product Image */}
                  <div className={styles.itemImage}>
                    <img
                      src={`http://127.0.0.1:5000/images/${item.productImage}`}
                      alt={item.productName}
                    />
                    {!item.inStock && (
                      <div className={styles.outOfStockOverlay}>
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className={styles.itemDetails}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.productName}</h3>
                      <span className={styles.itemCategory}>
                        {item.subcategoryId.name}
                      </span>
                      <div className={styles.itemSpecs}>
                        <span>
                          <strong>Brand:</strong> {item.brandName}
                        </span>
                        <span>
                          <strong>Color:</strong> {item.colorName}
                        </span>
                        <span>
                          <strong>Size:</strong> {item.sizeName}
                        </span>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className={styles.itemActions}>
                      <div className={styles.priceSection}>
                        <span className={styles.itemPrice}>
                          ₹{item.productPrice}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      {item.inStock ? (
                        <div className={styles.quantityControl}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MdRemove />
                          </button>
                          <span className={styles.quantity}>
                            {item.quantity}
                          </span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <MdAdd />
                          </button>
                        </div>
                      ) : (
                        <span className={styles.unavailable}>Unavailable</span>
                      )}

                      {/* Item Total */}
                      <div className={styles.itemTotal}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalPrice}>
                          ${(item.productPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeCartItemById(item._id)}
                      >
                        <MdDelete /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Platform Fee (2%)</span>
                  <span>₹{calculatePlatformFee().toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery Fee</span>
                  <span>
                    {calculateDeliveryFee() === 0
                      ? "FREE"
                      : `₹${calculateDeliveryFee()}`}
                  </span>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span className={styles.totalAmount}>
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className={styles.checkoutBtn}>
                Proceed to Checkout
              </button>

              <button
                className={styles.continueBtn}
                onClick={() => navigate("/user/viewproducts")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <MdShoppingCart className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>Add some products to get started</p>
            <button
              className={styles.shopNowBtn}
              onClick={() => navigate("/user/viewproducts")}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
