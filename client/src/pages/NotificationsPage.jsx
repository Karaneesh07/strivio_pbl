import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => setNotifs(data.notifications))
       .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
      // Mock for now or iterate
  };

  const getIcon = (type) => {
      if (type === 'streak') return 'bi-fire';
      if (type === 'achievement') return 'bi-trophy';
      return 'bi-bell';
  };

  const getColor = (type) => {
      if (type === 'streak') return '#f59e0b';
      if (type === 'achievement') return '#4361ee';
      return '#94a3b8';
  };

  return (
    <div className="container-fluid" style={{ background: '#0a0c1e', margin: '-1.5rem', minHeight: 'calc(100vh - 56px)', padding: '2rem' }}>
      <div className="row">
        {/* Left Sidebar: Profile & Tabs */}
        <div className="col-md-3">
          <div className="card-glass border-0 p-4 mb-4 d-flex align-items-center gap-3" style={{ background: 'transparent' }}>
             <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: '#4361ee' }}>
                <i className="bi bi-person-fill text-white fs-4" />
             </div>
             <div>
                <div className="fw-bold">{user?.name || 'Developer'}</div>
                <div className="text-secondary small">Consistency Level {Math.floor((user?.streak || 0) / 7)}</div>
             </div>
          </div>

          <div className="d-flex flex-column gap-2 mt-4">
             {[
               { icon: 'grid', label: 'Overview' },
               { icon: 'fire', label: 'My Streaks' },
               { icon: 'trophy', label: 'Achievements' },
               { icon: 'bell', label: 'Notifications', active: true },
               { icon: 'gear', label: 'Settings' },
             ].map(item => (
               <div key={item.label} className={`d-flex align-items-center gap-3 p-3 rounded-pill px-4 ${item.active ? 'bg-primary text-white shadow' : 'text-secondary'}`} style={{ cursor: 'pointer', fontSize: '.9rem' }}>
                 <i className={`bi bi-${item.icon}`} />
                 <span className="fw-bold">{item.label}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 px-5 border-start border-secondary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 style={{ fontWeight: 800 }}>Notification Center</h1>
              <p style={{ color: '#64748b' }} className="m-0">Stay updated with your progress and community alerts.</p>
            </div>
            <button className="btn btn-sm text-secondary gap-2 d-flex align-items-center" onClick={markAllRead}>
               <i className="bi bi-check2-all" /> Mark all as read
            </button>
          </div>

          {loading ? (
              <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>
          ) : notifs.length === 0 ? (
              <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
                  <i className="bi bi-bell-slash mb-2" style={{ fontSize: '2rem' }} />
                  <p>You're all caught up! No recent notifications.</p>
              </div>
          ) : (
            <div className="d-flex flex-column gap-4">
                {notifs.map((n) => (
                    <div key={n.id} className="d-flex gap-4 align-items-start p-2 position-relative">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: '#13162a', color: getColor(n.type) }}>
                           <i className={`bi ${getIcon(n.type)} fs-5`} />
                        </div>
                        <div className="flex-grow-1">
                           <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="fw-bold">{n.title}</div>
                              <div className="text-secondary" style={{ fontSize: '.7rem' }}>{new Date(n.created_at).toLocaleDateString()}</div>
                           </div>
                           <p className="text-secondary small m-0 mb-2">{n.body}</p>
                        </div>
                        {!n.is_read && <div className="position-absolute end-0 top-0 mt-3 me-n1" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4361ee' }} />}
                    </div>
                ))}
            </div>
          )}

          <div className="text-center mt-5 pt-3">
             <button className="btn btn-sm text-secondary">Load more notifications</button>
          </div>
        </div>
      </div>
    </div>
  );
}
