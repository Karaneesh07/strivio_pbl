// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: '#0d0f1a' }}>
      <div className="card-glass" style={{ width: '420px' }}>
        <div className="text-center mb-4">
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#4361ee' }}>⚡ Strivio</span>
          <p className="mt-2" style={{ color: '#64748b' }}>Sign in to your account</p>
        </div>
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#94a3b8' }}>Email</label>
            <input id="login-email" name="email" type="email" className="input-dark"
              placeholder="you@example.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label" style={{ color: '#94a3b8' }}>Password</label>
            <input id="login-password" name="password" type="password" className="input-dark"
              placeholder="Enter your password" value={form.password} onChange={onChange} required />
          </div>
          <button id="login-submit" type="submit" className="btn-primary-custom w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Sign In →'}
          </button>
        </form>
        <p className="text-center mt-3" style={{ color: '#64748b', fontSize: '.9rem' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
