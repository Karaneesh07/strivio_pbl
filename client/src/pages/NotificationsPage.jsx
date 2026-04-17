// src/pages/NotificationsPage.jsx
import React from 'react';

export default function NotificationsPage() {
  const notifs = [
    { title: 'Reminder: Daily DSA Challenge', time: '2h ago', body: "Today's problem: \"Binary Tree Maximum Path Sum\". Don't break your momentum!", link: 'Solve Now', type: 'reminders', color: '#4361ee', icon: 'bi-clock' },
    { title: 'Streak Alert: 14 Days!', time: '5h ago', body: "You are on fire! Only 1 day left to reach the \"Consistent Coder\" milestone.", type: 'streaks', color: '#f59e0b', icon: 'bi-fire' },
    { title: 'Badge Unlocked: Array Master', time: 'Yesterday', body: "Congratulations! You've solved 100+ problems in the Arrays category.", type: 'achievements', color: '#4361ee', icon: 'bi-trophy' },
    { title: 'New Reply in Community', time: 'Yesterday', body: "Sam has commented on your solution for \"LRU Cache implementation\".", type: 'community', color: '#94a3b8', icon: 'bi-people' },
  ];

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
                <div className="fw-bold">Alex Dev</div>
                <div className="text-secondary small">Consistency Level 14</div>
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
            <button className="btn btn-sm text-secondary gap-2 d-flex align-items-center">
               <i className="bi bi-check2-all" /> Mark all as read
            </button>
          </div>

          <div className="card-glass bg-opacity-25 p-4 py-3 mb-5 d-flex align-items-center justify-content-between border-0" style={{ borderRadius: 20 }}>
             <div className="d-flex align-items-center gap-3">
                <div className="rounded d-flex align-items-center justify-content-center bg-primary" style={{ width: 40, height: 40, background: '#1c2242' }}>
                   <i className="bi bi-browser-safari text-primary" />
                </div>
                <div>
                  <div className="fw-bold fs-6">Web Push Notifications</div>
                  <div className="text-secondary" style={{ fontSize: '.75rem' }}>Active on this device (Chrome Mac)</div>
                </div>
             </div>
             <div className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" defaultChecked />
             </div>
          </div>

          {/* Filter Labels */}
          <div className="d-flex gap-4 border-bottom border-secondary border-opacity-25 mb-4">
             {['All', 'Reminders', 'Streaks', 'Achievements'].map((l, i) => (
                <div key={l} className={`pb-3 ${i === 0 ? 'text-primary border-bottom border-primary border-4' : 'text-secondary'}`} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '.9rem' }}>{l}</div>
             ))}
          </div>

          <div className="d-flex flex-column gap-4">
            {notifs.map((n, i) => (
              <div key={i} className="d-flex gap-4 align-items-start p-2 position-relative">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: '#13162a', color: n.color }}>
                   <i className={`bi ${n.icon} fs-5`} />
                </div>
                <div className="flex-grow-1">
                   <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold">{n.title}</div>
                      <div className="text-secondary" style={{ fontSize: '.7rem' }}>{n.time}</div>
                   </div>
                   <p className="text-secondary small m-0 mb-2">{n.body}</p>
                   {n.link && <a href="#" className="text-primary text-decoration-none fw-bold" style={{ fontSize: '.75rem' }}>{n.link} <i className="bi bi-chevron-right" /></a>}
                </div>
                <div className="position-absolute end-0 top-0 mt-3 me-n1" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4361ee', display: i < 2 ? 'block' : 'none' }} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5 pt-3">
             <button className="btn btn-sm text-secondary">Load more notifications</button>
          </div>
        </div>
      </div>
    </div>
  );
}
