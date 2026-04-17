// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: '#0d0f1a' }}>
      <div className="card-glass" style={{ width: '420px' }}>
        <div className="text-center mb-4">
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#4361ee' }}>⚡ Strivio</span>
          <p className="mt-2" style={{ color: '#64748b' }}>Create your account</p>
        </div>
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#94a3b8' }}>Full Name</label>
            <input id="reg-name" name="name" type="text" className="input-dark"
              placeholder="Alex Johnson" value={form.name} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#94a3b8' }}>Email</label>
            <input id="reg-email" name="email" type="email" className="input-dark"
              placeholder="you@example.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label" style={{ color: '#94a3b8' }}>Password</label>
            <input id="reg-password" name="password" type="password" className="input-dark"
              placeholder="Min. 6 characters" value={form.password} onChange={onChange} required minLength={6} />
          </div>
          <button id="reg-submit" type="submit" className="btn-primary-custom w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Create Account →'}
          </button>
        </form>
        <p className="text-center mt-3" style={{ color: '#64748b', fontSize: '.9rem' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
