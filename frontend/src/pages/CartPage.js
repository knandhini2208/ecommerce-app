import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ street: '', city: '', postalCode: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (!shipping.street || !shipping.city || !shipping.postalCode || !shipping.country) return setError('Please fill in all shipping fields');
    setLoading(true);
    setError('');
    try {
      await api.createOrder({
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: shipping,
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div style={styles.page}>
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptySub}>Add some products to get started</p>
        <button onClick={() => navigate('/')} style={styles.shopBtn}>Browse Products</button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <div style={styles.layout}>
          <div style={styles.items}>
            {cart.map(item => (
              <div key={item._id} style={styles.item}>
                <div style={styles.itemImg}>{item.image ? <img src={item.image} alt={item.name} style={styles.img} onError={e => { e.target.style.display='none'; }} /> : '📦'}</div>
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                </div>
                <div style={styles.itemControls}>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <span style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>✕</button>
              </div>
            ))}
          </div>
          <div style={styles.sidebar}>
            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryVal}>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Shipping</span>
                <span style={styles.summaryVal}>Free</span>
              </div>
              <div style={{ ...styles.summaryRow, borderTop: '1px solid #333', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ ...styles.summaryLabel, color: '#fff', fontWeight: '700' }}>Total</span>
                <span style={{ ...styles.summaryVal, color: '#4ecca3', fontWeight: '700', fontSize: '1.2rem' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div style={styles.shippingForm}>
              <h3 style={styles.shippingTitle}>Shipping Address</h3>
              {['street', 'city', 'postalCode', 'country'].map(field => (
                <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={shipping[field]} onChange={e => setShipping({ ...shipping, [field]: e.target.value })} style={styles.input} />
              ))}
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button onClick={handleCheckout} disabled={loading} style={styles.checkoutBtn}>{loading ? 'Placing Order...' : `Checkout — $${cartTotal.toFixed(2)}`}</button>
            <button onClick={() => navigate('/')} style={styles.continueBtn}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', padding: '2rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: { background: '#1a1a2e', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #2a2a4a' },
  itemImg: { width: '64px', height: '64px', background: '#0f0f1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', margin: '0 0 0.25rem', fontSize: '0.95rem' },
  itemPrice: { color: '#888', margin: 0, fontSize: '0.85rem' },
  itemControls: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  qtyBtn: { width: '28px', height: '28px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  qty: { color: '#fff', width: '24px', textAlign: 'center', fontWeight: '600' },
  subtotal: { color: '#4ecca3', fontWeight: '700', width: '70px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  summary: { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', border: '1px solid #2a2a4a' },
  summaryTitle: { color: '#fff', margin: '0 0 1rem', fontSize: '1.1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  summaryLabel: { color: '#888', fontSize: '0.9rem' },
  summaryVal: { color: '#ccc', fontSize: '0.9rem' },
  shippingForm: { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', border: '1px solid #2a2a4a', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  shippingTitle: { color: '#fff', margin: '0 0 0.5rem', fontSize: '1rem' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '0.9rem' },
  error: { background: '#2d1b1b', color: '#ff6b6b', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' },
  checkoutBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', width: '100%' },
  continueBtn: { background: 'none', border: '1px solid #333', color: '#888', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%' },
  empty: { textAlign: 'center', paddingTop: '8rem' },
  emptyIcon: { fontSize: '5rem' },
  emptyTitle: { color: '#fff', fontSize: '1.5rem', margin: '1rem 0 0.5rem' },
  emptySub: { color: '#888', marginBottom: '2rem' },
  shopBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
};

export default CartPage;
