import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const statusColors = { pending: '#f0a500', processing: '#4a90d9', shipped: '#7c3aed', delivered: '#4ecca3', cancelled: '#e94560' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.center}><p style={{ color: '#888' }}>Loading orders...</p></div>;
  if (error) return <div style={styles.center}><p style={{ color: '#e94560' }}>{error}</p></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>
        {orders.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '4rem' }}>📦</div>
            <p style={{ color: '#888', marginTop: '1rem' }}>You haven't placed any orders yet.</p>
          </div>
        ) : orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <span style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <span style={{ ...styles.status, background: statusColors[order.status] + '22', color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}44` }}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <div style={styles.items}>
              {order.items.map((item, i) => (
                <div key={i} style={styles.item}>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={styles.itemQty}>×{item.quantity}</span>
                  <span style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={styles.orderFooter}>
              {order.shippingAddress && <span style={styles.addr}>📍 {order.shippingAddress.city}, {order.shippingAddress.country}</span>}
              <span style={styles.total}>Total: <strong style={{ color: '#4ecca3' }}>${order.totalPrice.toFixed(2)}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', padding: '2rem' },
  container: { maxWidth: '800px', margin: '0 auto' },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' },
  orderCard: { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid #2a2a4a' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  orderId: { color: '#fff', fontWeight: '700', fontSize: '0.95rem', display: 'block' },
  orderDate: { color: '#888', fontSize: '0.8rem', display: 'block', marginTop: '2px' },
  status: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  items: { borderTop: '1px solid #2a2a4a', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item: { display: 'flex', alignItems: 'center', gap: '1rem' },
  itemName: { color: '#ccc', flex: 1, fontSize: '0.9rem' },
  itemQty: { color: '#888', fontSize: '0.85rem' },
  itemPrice: { color: '#fff', fontWeight: '600', fontSize: '0.9rem', width: '70px', textAlign: 'right' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #2a2a4a' },
  addr: { color: '#888', fontSize: '0.85rem' },
  total: { color: '#ccc', fontSize: '0.95rem' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a' },
  empty: { textAlign: 'center', padding: '4rem 0' },
};

export default OrdersPage;
