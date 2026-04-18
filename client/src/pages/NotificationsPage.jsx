import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TYPE_CONFIG = {
  reminder:    { color: '#4361ee', bg: 'rgba(67,97,238,0.08)',  icon: 'bi-bell-fill',         label: 'Reminder'    },
  streak:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: 'bi-fire',              label: 'Streak'      },
  achievement: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  icon: 'bi-trophy-fill',       label: 'Achievement' },
  system:      { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)',icon: 'bi-info-circle-fill',  label: 'System'      },
};
const cfg = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.system;

function groupByDate(notifications) {
  const today    = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  notifications.forEach(n => {
    const d = new Date(n.created_at).toDateString();
    if (d === today) groups.Today.push(n);
    else if (d === yesterday) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });
  return groups;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    api.get('/notifications')
      .then(({ data }) => setNotifications(data.notifications || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const markAll = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
  };

  const markOne = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
  };

  const unread = notifications.filter(n => !n.is_read).length;
  const groups = groupByDate(notifications);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <h1 style={{ fontWeight: 800 }}>Notifications</h1>
          <p style={{ color: '#64748b', marginBottom: 0 }}>
            {unread > 0 ? <><span style={{ color: '#4361ee', fontWeight: 700 }}>{unread} unread</span> — </> : ''}
            Stay on top of your DSA journey.
          </p>
        </div>
        {unread > 0 && (
          <button className="btn-ghost d-flex align-items-center gap-2" onClick={markAll} style={{ marginTop: '0.25rem' }}>
            <i className="bi bi-check2-all" /> Mark all read
          </button>
        )}
      </div>

      {/* Type legend */}
      <div className="d-flex gap-2 flex-wrap mt-3 mb-4">
        {Object.entries(TYPE_CONFIG).map(([type, c]) => (
          <span key={type} style={{ background: c.bg, border: `1px solid ${c.color}33`, color: c.color,
            borderRadius: 20, padding: '3px 12px', fontSize: '.75rem', fontWeight: 600 }}>
            <i className={`bi ${c.icon} me-1`} />{c.label}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>
      ) : notifications.length === 0 ? (
        <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
          <i className="bi bi-bell-slash mb-3 d-block" style={{ fontSize: '3rem' }} />
          <p>All caught up! No notifications yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {Object.entries(groups).map(([label, items]) => items.length === 0 ? null : (
            <div key={label}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ color: '#64748b', fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {label}
                </span>
                <div style={{ flex: 1, height: 1, background: '#1e2340' }} />
              </div>
              <div className="d-flex flex-column gap-2">
                {items.map(n => {
                  const c = cfg(n.type);
                  return (
                    <div key={n.id} className="notification-item" style={{ borderLeftColor: c.color, opacity: n.is_read ? 0.6 : 1 }}
                      onClick={() => !n.is_read && markOne(n.id)}>
                      <div className="d-flex align-items-start gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{ width: 38, height: 38, background: c.bg, color: c.color, fontSize: '1rem' }}>
                          <i className={`bi ${c.icon}`} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <strong style={{ fontSize: '.9rem' }}>{n.title}</strong>
                            {!n.is_read && <span className="unread-dot" />}
                          </div>
                          <p style={{ color: '#94a3b8', fontSize: '.85rem', margin: '2px 0 0' }}>{n.body}</p>
                          <small style={{ color: '#64748b' }}>
                            {new Date(n.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
