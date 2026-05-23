import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛍️ ShopNow</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Products</Link>
        {user ? (
          <>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            {isAdmin && <Link to="/admin" style={styles.adminLink}>Admin</Link>}
            <Link to="/cart" style={styles.cartLink}>
              🛒 Cart {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout ({user.name})</button>
          </>
        ) : (
          <>
            <Link to="/cart" style={styles.cartLink}>
              🛒 Cart {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
            <Link to="/login" style={styles.btn}>Login</Link>
            <Link to="/register" style={styles.btnOutline}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '64px', background: '#1a1a2e', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { fontSize: '1.4rem', fontWeight: '700', color: '#e94560', textDecoration: 'none', letterSpacing: '-0.5px' },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' },
  adminLink: { color: '#f0a500', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' },
  cartLink: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', position: 'relative' },
  badge: { background: '#e94560', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: '0.7rem', marginLeft: '4px' },
  btn: { background: '#e94560', color: '#fff', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' },
  btnOutline: { border: '1px solid #e94560', color: '#e94560', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' },
  logoutBtn: { background: 'none', border: '1px solid #555', color: '#ccc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
};

export default Navbar;
