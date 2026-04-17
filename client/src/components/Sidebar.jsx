// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',             icon: 'bi-grid-fill',         label: 'Dashboard'   },
  { to: '/problems',     icon: 'bi-code-square',      label: 'Library'     },
  { to: '/daily',        icon: 'bi-calendar-check',   label: 'Daily'       },
  { to: '/goals',        icon: 'bi-bullseye',         label: 'Weekly Goals'},
  { to: '/reflections',  icon: 'bi-journal-text',     label: 'Journal'     },
  { to: '/leaderboard',  icon: 'bi-award',            label: 'Board'       },
  { to: '/notifications',icon: 'bi-bell-fill',        label: 'Alerts'      },
  { to: '/focus',        icon: 'bi-aim',              label: 'Focus'       },
  { to: '/settings',     icon: 'bi-gear-wide-connected', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="brand">⚡ Strivio</div>
      <nav className="d-flex flex-column gap-1 flex-grow-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${icon}`} style={{ fontSize: '1.1rem' }} />
            {label}
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="mt-auto pt-3 border-top" style={{ borderColor: '#1e2340' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b', marginBottom: '.5rem' }}>{user.name}</div>
          <button className="btn-primary-custom w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2" />Logout
          </button>
        </div>
      )}
    </aside>
  );
}
