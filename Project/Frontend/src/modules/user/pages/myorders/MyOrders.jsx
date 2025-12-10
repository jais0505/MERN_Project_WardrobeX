import { useState } from 'react'
import styles from './MyOrders.module.css'
import { MdShoppingBag, MdLocalShipping, MdCheckCircle, MdCancel, MdChevronRight } from 'react-icons/md'
import { useNavigate } from 'react-router'

const MyOrders = () => {
  const navigate = useNavigate()

  // Sample orders data - Replace with actual data from API
  const [orders] = useState([
    {
      orderId: 'ORD-2024-ABC123',
      orderDate: '2024-12-01',
      status: 'Delivered',
      totalAmount: 259.97,
      items: [
        {
          id: 1,
          productName: 'Winter Classic Jacket',
          productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200',
          quantity: 1,
          price: 129.99,
          size: 'L',
          color: 'Black'
        },
        {
          id: 2,
          productName: 'Cotton Hoodie',
          productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
          quantity: 2,
          price: 59.99,
          size: 'M',
          color: 'Navy Blue'
        }
      ],
      deliveryDate: '2024-12-05',
      trackingId: 'TRK123456789'
    },
    {
      orderId: 'ORD-2024-DEF456',
      orderDate: '2024-11-28',
      status: 'Shipped',
      totalAmount: 89.99,
      items: [
        {
          id: 3,
          productName: 'Slim Fit T-Shirt',
          productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
          quantity: 1,
          price: 29.99,
          size: 'S',
          color: 'White'
        }
      ],
      estimatedDelivery: '2024-12-10',
      trackingId: 'TRK987654321'
    },
    {
      orderId: 'ORD-2024-GHI789',
      orderDate: '2024-11-25',
      status: 'Processing',
      totalAmount: 149.99,
      items: [
        {
          id: 4,
          productName: 'Denim Jacket',
          productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
          quantity: 1,
          price: 89.99,
          size: 'L',
          color: 'Blue'
        }
      ],
      estimatedDelivery: '2024-12-08'
    },
    {
      orderId: 'ORD-2024-JKL012',
      orderDate: '2024-11-20',
      status: 'Cancelled',
      totalAmount: 79.99,
      items: [
        {
          id: 5,
          productName: 'Running Shoes',
          productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
          quantity: 1,
          price: 79.99,
          size: '10',
          color: 'Black'
        }
      ],
      cancelledDate: '2024-11-21'
    }
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <MdCheckCircle />
      case 'Shipped':
        return <MdLocalShipping />
      case 'Processing':
        return <MdShoppingBag />
      case 'Cancelled':
        return <MdCancel />
      default:
        return <MdShoppingBag />
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return styles.statusDelivered
      case 'Shipped':
        return styles.statusShipped
      case 'Processing':
        return styles.statusProcessing
      case 'Cancelled':
        return styles.statusCancelled
      default:
        return ''
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>{orders.length} orders placed</p>
      </div>

      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.orderId} className={styles.orderCard}>
            {/* Order Header */}
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <div className={styles.orderIdSection}>
                  <span className={styles.orderLabel}>Order ID:</span>
                  <span className={styles.orderId}>{order.orderId}</span>
                </div>
                <div className={styles.orderDate}>
                  Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className={styles.orderItems}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img 
                    src={item.productImage} 
                    alt={item.productName}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.productName}</h3>
                    <div className={styles.itemSpecs}>
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>${item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className={styles.orderFooter}>
              <div className={styles.orderSummary}>
                <span className={styles.totalLabel}>Total Amount:</span>
                <span className={styles.totalAmount}>${order.totalAmount.toFixed(2)}</span>
              </div>

              {order.status === 'Delivered' && (
                <div className={styles.deliveryInfo}>
                  Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}

              {order.status === 'Shipped' && (
                <div className={styles.deliveryInfo}>
                  Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}

              {order.status === 'Processing' && (
                <div className={styles.deliveryInfo}>
                  Expected by {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              )}

              <button 
                className={styles.viewDetailsBtn}
                onClick={() => navigate(`/user/order-details`)}
              >
                View Details <MdChevronRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className={styles.emptyState}>
          <MdShoppingBag className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>No orders yet</h2>
          <p className={styles.emptyText}>Start shopping to see your orders here</p>
          <button 
            className={styles.shopBtn}
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  )
}

export default MyOrders