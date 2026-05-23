import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.sub}>Sign in to your account</p>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} placeholder="you@example.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={styles.footer}>Don't have an account? <Link to="/register" style={styles.link}>Register</Link></p>
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

export default LoginPage;
