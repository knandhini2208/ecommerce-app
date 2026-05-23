import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Join us today — it's free</p>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          {[['name','Name','text','John Doe'],['email','Email','email','you@example.com'],['password','Password','password','Min 6 characters']].map(([name, label, type, placeholder]) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} required style={styles.input} placeholder={placeholder} />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Account Type</label>
            <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login" style={styles.link}>Login</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a', padding: '2rem' },
  card: { background: '#1a1a2e', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', border: '1px solid #2a2a4a', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.5rem' },
  sub: { color: '#888', margin: 0, fontSize: '0.95rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#ccc', fontSize: '0.85rem', fontWeight: '500' },
  input: { padding: '12px 14px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '0.95rem', outline: 'none' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', marginTop: '0.5rem' },
  error: { background: '#2d1b1b', color: '#ff6b6b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' },
  footer: { textAlign: 'center', color: '#888', fontSize: '0.9rem', marginTop: '1.5rem' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: '600' },
};

export default RegisterPage;
