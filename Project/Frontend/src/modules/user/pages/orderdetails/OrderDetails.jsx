import { useState } from 'react';
import styles from './OrderDetails.module.css';

const OrderDetails = () => {
  // Mock order data - replace with your API data
  const [order] = useState({
    orderId: 'ORD-2024-12345',
    orderDate: '2024-12-08',
    orderStatus: 'In Transit',
    estimatedDelivery: '2024-12-15',
    totalAmount: 289.97,
    shippingFee: 10.00,
    contact: {
      name: 'John Doe',
      phone: '+1 234-567-8900',
      email: 'john.doe@example.com'
    },
    shippingAddress: {
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    products: [
      {
        id: 1,
        name: 'Classic Oxford Shirt',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
        price: 89.99,
        quantity: 2,
        size: 'M',
        color: 'White',
        brand: 'Premium Essentials'
      },
      {
        id: 2,
        name: 'Slim Fit Chinos',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80',
        price: 109.99,
        quantity: 1,
        size: 'L',
        color: 'Navy',
        brand: 'Urban Style'
      }
    ]
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return styles.statusDelivered;
      case 'in transit':
      case 'shipped':
        return styles.statusTransit;
      case 'processing':
        return styles.statusProcessing;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Order Details</h1>
            <p className={styles.orderNumber}>Order #{order.orderId}</p>
          </div>
          <div className={`${styles.statusBadge} ${getStatusClass(order.orderStatus)}`}>
            {order.orderStatus}
          </div>
        </div>

        {/* Order Info Summary */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Order Date</h3>
            <p className={styles.infoCardValue}>{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Estimated Delivery</h3>
            <p className={styles.infoCardValue}>{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Total Amount</h3>
            <p className={styles.infoCardValue}>${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Products Section */}
          <div className={styles.productsSection}>
            <h2 className={styles.sectionTitle}>Order Items</h2>
            <div className={styles.productsList}>
              {order.products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productDetails}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productBrand}>{product.brand}</p>
                    <div className={styles.productSpecs}>
                      <span className={styles.specItem}>Size: <strong>{product.size}</strong></span>
                      <span className={styles.specDivider}>•</span>
                      <span className={styles.specItem}>Color: <strong>{product.color}</strong></span>
                      <span className={styles.specDivider}>•</span>
                      <span className={styles.specItem}>Qty: <strong>{product.quantity}</strong></span>
                    </div>
                  </div>
                  <div className={styles.productPrice}>
                    <p className={styles.priceAmount}>${product.price.toFixed(2)}</p>
                    {product.quantity > 1 && (
                      <p className={styles.priceUnit}>${product.price.toFixed(2)} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>${(order.totalAmount - order.shippingFee).toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping Fee</span>
                <span className={styles.summaryValue}>${order.shippingFee.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span className={styles.summaryLabel}>Total</span>
                <span className={styles.summaryValue}>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Address */}
          <div className={styles.sidebar}>
            {/* Contact Information */}
            <div className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>Contact Information</h2>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Name</span>
                  <span className={styles.contactValue}>{order.contact.name}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Phone</span>
                  <span className={styles.contactValue}>{order.contact.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email</span>
                  <span className={styles.contactValue}>{order.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>Shipping Address</h2>
              <address className={styles.addressBlock}>
                <p className={styles.addressLine}>{order.shippingAddress.street}</p>
                <p className={styles.addressLine}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className={styles.addressLine}>{order.shippingAddress.country}</p>
              </address>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.primaryBtn}>Track Shipment</button>
              <button className={styles.secondaryBtn}>Download Invoice</button>
              <button className={styles.secondaryBtn}>Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;