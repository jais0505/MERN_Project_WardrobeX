import { useEffect } from 'react'
import styles from './OrderSuccess.module.css'
import { MdCheckCircle, MdShoppingBag, MdHome } from 'react-icons/md'
import { FaReceipt } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router'
import confetti from 'canvas-confetti'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get order details from location state or URL params
  const orderDetails = location.state || {
    orderId: 'ORD-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    paymentId: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: 259.97,
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Trigger confetti animation on page load
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#000000', '#ffffff', '#10b981']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        {/* Success Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.successIcon}>
            <MdCheckCircle />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <p className={styles.message}>
          Thank you for your purchase. Your order has been confirmed and will be delivered soon.
        </p>

        {/* Order Details */}
        <div className={styles.detailsSection}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Order ID</span>
            <span className={styles.detailValue}>{orderDetails.orderId}</span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Payment ID</span>
            <span className={styles.detailValue}>{orderDetails.paymentId}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Amount Paid</span>
            <span className={styles.detailValue}>${orderDetails.amount.toFixed(2)}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estimated Delivery</span>
            <span className={styles.detailValue}>{orderDetails.estimatedDelivery}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button 
            className={styles.viewOrderBtn}
            onClick={() => navigate(`/orders/${orderDetails.orderId}`)}
          >
            <MdShoppingBag /> View Order
          </button>
          <button 
            className={styles.homeBtn}
            onClick={() => navigate('/user/')}
          >
            <MdHome /> Go to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className={styles.infoBox}>
          <FaReceipt className={styles.infoIcon} />
          <p className={styles.infoText}>
            A confirmation email has been sent to your registered email address with order details and tracking information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess