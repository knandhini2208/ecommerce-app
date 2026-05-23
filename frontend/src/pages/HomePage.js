import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAddToCart }) => (
  <div style={styles.card}>
    <div style={styles.imgBox}>
      {product.image ? <img src={product.image} alt={product.name} style={styles.img} onError={e => { e.target.style.display='none'; }} /> : <div style={styles.imgPlaceholder}>📦</div>}
    </div>
    <div style={styles.cardBody}>
      <span style={styles.category}>{product.category}</span>
      <h3 style={styles.productName}>{product.name}</h3>
      <p style={styles.desc}>{product.description.substring(0, 80)}{product.description.length > 80 ? '...' : ''}</p>
      <div style={styles.cardFooter}>
        <span style={styles.price}>${product.price.toFixed(2)}</span>
        <span style={styles.stock}>Stock: {product.stock}</span>
      </div>
      <button onClick={() => onAddToCart(product)} style={styles.addBtn} disabled={product.stock === 0}>
        {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [toast, setToast] = useState('');
  const { addToCart } = useCart();

  const categories = [...new Set(products.map(p => p.category))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (params = '') => {
    try {
      setLoading(true);
      const data = await api.getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    fetchProducts(params.toString() ? `?${params}` : '');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
        <p style={styles.heroSub}>Shop the best deals — fast, easy, and secure</p>
      </div>
      <div style={styles.container}>
        <form onSubmit={handleSearch} style={styles.searchBar}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={styles.searchInput} />
          <select value={category} onChange={e => setCategory(e.target.value)} style={styles.select}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" style={styles.searchBtn}>Search</button>
          <button type="button" onClick={() => { setSearch(''); setCategory(''); fetchProducts(); }} style={styles.clearBtn}>Clear</button>
        </form>
        {loading ? <div style={styles.center}><p>Loading products...</p></div>
          : error ? <div style={styles.error}>{error}</div>
          : products.length === 0 ? <div style={styles.center}><p>No products found.</p></div>
          : <div style={styles.grid}>
              {products.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />)}
            </div>
        }
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  hero: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '3rem 2rem', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.5rem' },
  heroSub: { color: '#aaa', fontSize: '1.1rem', margin: 0 },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  searchBar: { display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '0.95rem' },
  select: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '0.95rem' },
  searchBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  clearBtn: { background: '#333', color: '#ccc', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
  card: { background: '#1a1a2e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a4a', transition: 'transform 0.2s, box-shadow 0.2s' },
  imgBox: { height: '180px', background: '#16213e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { fontSize: '4rem' },
  cardBody: { padding: '1rem' },
  category: { fontSize: '0.75rem', color: '#e94560', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' },
  productName: { color: '#fff', margin: '0.25rem 0', fontSize: '1rem', fontWeight: '600' },
  desc: { color: '#888', fontSize: '0.85rem', margin: '0.5rem 0', lineHeight: '1.4' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.75rem 0 0.5rem' },
  price: { color: '#4ecca3', fontWeight: '700', fontSize: '1.1rem' },
  stock: { color: '#666', fontSize: '0.8rem' },
  addBtn: { width: '100%', background: '#e94560', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', marginTop: '0.5rem' },
  center: { textAlign: 'center', color: '#888', padding: '3rem' },
  error: { background: '#2d1b1b', color: '#ff6b6b', padding: '1rem', borderRadius: '8px', textAlign: 'center' },
  toast: { position: 'fixed', bottom: '2rem', right: '2rem', background: '#4ecca3', color: '#000', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease' },
};

export default HomePage;
