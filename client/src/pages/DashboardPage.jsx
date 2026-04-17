// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user }  = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [daily, setDaily]         = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/me'),
      api.get('/daily'),
    ]).then(([aRes, dRes]) => {
      setAnalytics(aRes.data.analytics);
      setDaily(dRes.data.daily);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>;

  const diffBadge = (d) => {
    if (d === 'Easy')   return <span className="badge-easy">{d}</span>;
    if (d === 'Medium') return <span className="badge-medium">{d}</span>;
    return <span className="badge-hard">{d}</span>;
  };

  return (
    <div>
      <h1 className="mb-1" style={{ fontWeight: 800 }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Welcome back, {user?.name} 👋</p>

      {/* Streak alert */}
      {analytics?.streak > 0 && (
        <div className="alert-streak mb-4">
          <i className="bi bi-fire" style={{ fontSize: '1.5rem', color: '#f59e0b' }} />
          <div>
            <div style={{ fontWeight: 700 }}>🔥 {analytics.streak}-Day Streak Active</div>
            <div style={{ color: '#64748b', fontSize: '.85rem' }}>Solve today's problem to keep it going!</div>
          </div>
          <Link to="/daily" className="btn-primary-custom ms-auto">Solve Now</Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Current Streak', value: `${analytics?.streak ?? 0} Days`, icon: 'bi-fire', color: '#f59e0b' },
          { label: 'Accuracy Rate',  value: analytics?.accuracy_rate ?? '0%', icon: 'bi-bullseye', color: '#22c55e' },
          { label: 'Problems Solved',value: analytics?.total_solved ?? 0,      icon: 'bi-check2-circle', color: '#4361ee' },
          { label: 'Skill Level',    value: analytics?.skill_level ?? 'Beginner', icon: 'bi-award', color: '#7b2ff7' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="col-6 col-lg-3">
            <div className="stat-card">
              <i className={`bi ${icon}`} style={{ color, fontSize: '1.4rem' }} />
              <div className="value" style={{ color }}>{value}</div>
              <div className="label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's challenge */}
      {daily && (
        <div className="card-glass mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-calendar-event" style={{ color: '#4361ee' }} />
            <strong>Today's Daily Challenge</strong>
            <span className="ms-auto">{diffBadge(daily.difficulty)}</span>
          </div>
          <h3 style={{ fontWeight: 700, marginBottom: '.5rem' }}>{daily.title}</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '.9rem' }}>{daily.description?.slice(0, 150)}…</p>
          <div className="d-flex gap-2">
            <Link to="/daily" className="btn-primary-custom">{daily.solved ? '✔ Solved' : 'Solve Now →'}</Link>
            <Link to="/analytics" style={{ color: '#64748b', alignSelf: 'center', fontSize: '.9rem' }}>View Analytics</Link>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="row g-3">
        {[
          { to: '/focus',       icon: 'bi-eyeglasses',    label: 'Start Focus Mode',    sub: 'Distraction-free solving' },
          { to: '/leaderboard', icon: 'bi-trophy',         label: 'Leaderboard',         sub: 'See how you rank'         },
          { to: '/submissions', icon: 'bi-clock-history',  label: 'Recent Submissions',  sub: 'Review your work'         },
        ].map(({ to, icon, label, sub }) => (
          <div key={to} className="col-md-4">
            <Link to={to} className="card-glass d-block" style={{ textDecoration: 'none', color: 'inherit' }}>
              <i className={`bi ${icon}`} style={{ fontSize: '1.5rem', color: '#4361ee' }} />
              <div style={{ fontWeight: 600, marginTop: '.5rem' }}>{label}</div>
              <div style={{ color: '#64748b', fontSize: '.85rem' }}>{sub}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
