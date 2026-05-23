import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', image: '' };

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const statusColors = { pending: '#f0a500', processing: '#4a90d9', shipped: '#7c3aed', delivered: '#4ecca3', cancelled: '#e94560' };

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
    api.getAllOrders().then(setOrders).catch(console.error);
  }, []);

  const showMsg = (type, msg) => {
    if (type === 'success') setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
      if (editing) {
        const updated = await api.updateProduct(editing, data);
        setProducts(prev => prev.map(p => p._id === editing ? updated : p));
        showMsg('success', 'Product updated!');
      } else {
        const created = await api.createProduct(data);
        setProducts(prev => [created, ...prev]);
        showMsg('success', 'Product created!');
      }
      setForm(emptyForm);
      setEditing(null);
    } catch (err) {
      showMsg('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({ name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, image: product.image || '' });
    setTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      showMsg('success', 'Product deleted');
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.stats}>
          {[['Products', products.length, '📦'], ['Orders', orders.length, '🛒'], ['Revenue', `$${orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(0)}`, '💰']].map(([label, val, icon]) => (
            <div key={label} style={styles.stat}><span style={styles.statIcon}>{icon}</span><span style={styles.statVal}>{val}</span><span style={styles.statLabel}>{label}</span></div>
          ))}
        </div>
        <div style={styles.tabs}>
          {['products', 'orders'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {tab === 'products' && (
          <>
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.grid2}>
                  <div style={styles.field}><label style={styles.label}>Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={styles.input} /></div>
                  <div style={styles.field}><label style={styles.label}>Category *</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required style={styles.input} /></div>
                  <div style={styles.field}><label style={styles.label}>Price *</label><input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={styles.input} /></div>
                  <div style={styles.field}><label style={styles.label}>Stock</label><input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={styles.input} /></div>
                </div>
                <div style={styles.field}><label style={styles.label}>Image URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} /></div>
                <div style={styles.formActions}>
                  <button type="submit" disabled={loading} style={styles.submitBtn}>{loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}</button>
                  {editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
            </div>
            <div style={styles.tableCard}>
              <h2 style={styles.formTitle}>All Products ({products.length})</h2>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead><tr>{['Name','Category','Price','Stock','Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} style={styles.tr}>
                        <td style={styles.td}>{p.name}</td>
                        <td style={styles.td}><span style={styles.catBadge}>{p.category}</span></td>
                        <td style={styles.td}>${p.price.toFixed(2)}</td>
                        <td style={styles.td}>{p.stock}</td>
                        <td style={styles.td}>
                          <button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button>
                          <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div style={styles.tableCard}>
            <h2 style={styles.formTitle}>All Orders ({orders.length})</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{['Order ID','User','Items','Total','Status','Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} style={styles.tr}>
                      <td style={styles.td}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td style={styles.td}>{o.user?.name || 'Unknown'}</td>
                      <td style={styles.td}>{o.items.length} item(s)</td>
                      <td style={styles.td}>${o.totalPrice.toFixed(2)}</td>
                      <td style={styles.td}><span style={{ ...styles.statusBadge, background: statusColors[o.status]+'22', color: statusColors[o.status] }}>{o.status}</span></td>
                      <td style={styles.td}>
                        <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)} style={styles.statusSelect}>
                          {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', padding: '2rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  stat: { background: '#1a1a2e', borderRadius: '12px', padding: '1.25rem', border: '1px solid #2a2a4a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' },
  statIcon: { fontSize: '1.5rem' },
  statVal: { color: '#fff', fontSize: '1.5rem', fontWeight: '800' },
  statLabel: { color: '#888', fontSize: '0.85rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { background: '#1a1a2e', color: '#888', border: '1px solid #2a2a4a', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  tabActive: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
  formCard: { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #2a2a4a' },
  tableCard: { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', border: '1px solid #2a2a4a' },
  formTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { color: '#888', fontSize: '0.8rem', fontWeight: '500' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '0.9rem', outline: 'none' },
  formActions: { display: 'flex', gap: '0.75rem' },
  submitBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { background: '#333', color: '#ccc', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: '#888', fontWeight: '600', fontSize: '0.8rem', textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #2a2a4a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tr: { borderBottom: '1px solid #1a1a2e' },
  td: { color: '#ccc', padding: '0.75rem 1rem', fontSize: '0.9rem' },
  catBadge: { background: '#e9456022', color: '#e94560', padding: '2px 8px', borderRadius: '20px', fontSize: '0.8rem' },
  editBtn: { background: '#1a1a5a', color: '#4a90d9', border: '1px solid #4a90d944', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem' },
  deleteBtn: { background: '#2d1b1b', color: '#e94560', border: '1px solid #e9456044', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  statusSelect: { padding: '4px 8px', borderRadius: '6px', border: '1px solid #333', background: '#0f0f1a', color: '#ccc', fontSize: '0.85rem' },
  error: { background: '#2d1b1b', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  successMsg: { background: '#1b2d1b', color: '#4ecca3', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
};

export default AdminPage;
