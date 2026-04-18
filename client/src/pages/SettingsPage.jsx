import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notifications_enabled);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Notifications'); // Default tab

  useEffect(() => {
    setNotificationsEnabled(user?.notifications_enabled);
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch('/settings', { notifications_enabled: notificationsEnabled });
      setUser({ ...user, notifications_enabled: notificationsEnabled });
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'Account', icon: 'person', label: 'Account' },
    { id: 'Notifications', icon: 'bell', label: 'Notifications' },
    { id: 'Security', icon: 'shield-lock', label: 'Security' },
    { id: 'Appearance', icon: 'palette', label: 'Appearance' },
  ];

  return (
    <div className="container-fluid py-3">
      <div className="row g-5">
        {/* Left: Settings Sidebar Tabs */}
        <div className="col-md-3">
           <div className="d-flex align-items-center gap-3 mb-5 px-3">
              <div className="rounded border border-secondary p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: 'rgba(67,97,238,0.1)', borderColor: '#4361ee' }}>
                 <i className="bi bi-gear text-primary fs-5" />
              </div>
              <div>
                 <h5 className="m-0 fw-bold">Settings</h5>
                 <small style={{ color: '#64748b' }}>Manage preferences</small>
              </div>
           </div>

           <div className="d-flex flex-column gap-2">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="d-flex align-items-center gap-3 p-3 rounded-pill px-4"
                    style={{ 
                      cursor: 'pointer', fontSize: '.95rem',
                      background: isActive ? 'linear-gradient(135deg, #4361ee, #7b2ff7)' : 'transparent',
                      color: isActive ? '#fff' : '#64748b',
                      transition: 'all 0.2s',
                      border: isActive ? 'none' : '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if(!isActive) {
                        e.currentTarget.style.color = '#e2e8f0';
                        e.currentTarget.style.background = 'rgba(67,97,238,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if(!isActive) {
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <i className={`bi bi-${tab.icon}`} />
                    <span className="fw-bold">{tab.label}</span>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Right: Content Area */}
        <div className="col-md-9 border-start ps-5" style={{ borderColor: '#1e2340' }}>
           {/* ACCOUNT TAB */}
           {activeTab === 'Account' && (
             <div className="animation-fade-in">
               <h2 style={{ fontWeight: 800, marginBottom: '.5rem' }}>Account Profile</h2>
               <p style={{ color: '#64748b', marginBottom: '3rem' }}>Update your personal information and public profile.</p>
               
               <div className="card-glass mb-4">
                 <h6 className="fw-bold mb-3">Profile Details</h6>
                 <div className="row g-4">
                   <div className="col-md-6">
                     <label className="form-label-dark">Full Name</label>
                     <input type="text" className="input-dark" defaultValue={user?.name} disabled />
                     <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Name cannot be changed currently.</small>
                   </div>
                   <div className="col-md-6">
                     <label className="form-label-dark">Email Address</label>
                     <input type="email" className="input-dark" defaultValue={user?.email} disabled />
                   </div>
                 </div>
               </div>

               <div className="card-glass border-danger">
                 <h6 className="fw-bold text-danger mb-3">Danger Zone</h6>
                 <p style={{ color: '#94a3b8', fontSize: '.9rem' }}>Permanently delete your account and all your solved problems data. This action cannot be undone.</p>
                 <button className="btn-danger-sm"><i className="bi bi-trash" /> Delete Account</button>
               </div>
             </div>
           )}

           {/* NOTIFICATIONS TAB */}
           {activeTab === 'Notifications' && (
             <div className="animation-fade-in">
               <h2 style={{ fontWeight: 800, marginBottom: '.5rem' }}>App Notifications</h2>
               <p style={{ color: '#64748b', marginBottom: '3rem' }}>Customize how Strivio keeps you on track with your coding goals.</p>

               <div className="mb-5">
                  <h6 className="fw-bold border-start border-primary border-4 ps-3 mb-4">Practice Reminders</h6>
                  <div className="card-glass border-0 p-4 d-flex align-items-center justify-content-between" style={{ background: 'rgba(67,97,238,0.03)' }}>
                     <div>
                        <div className="fw-bold">Daily Goal Reminder</div>
                        <div style={{ color: '#64748b', fontSize: '.85rem', marginTop: '2px' }}>Receive a nudge if you haven't solved your daily problem.</div>
                     </div>
                     <div className="d-flex align-items-center gap-3" style={{ background: '#13162a', border: '1px solid #1e2340', padding: '8px 16px', borderRadius: 8 }}>
                        <span className="fw-bold">08:00 PM</span>
                        <i className="bi bi-clock" style={{ color: '#64748b' }} />
                     </div>
                  </div>
               </div>

               <div className="mb-4">
                  <h6 className="fw-bold border-start border-primary border-4 ps-3 mb-4">Push Notifications</h6>
                  <div className="card-glass border-0" style={{ background: 'rgba(67,97,238,0.03)' }}>
                     <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                           <i className="bi bi-lightning-fill text-primary fs-5" />
                           <div className="fw-bold">Enable Desktop Notifications</div>
                        </div>
                        <div className="form-check form-switch m-0" style={{ transform: 'scale(1.2)' }}>
                           <input className="form-check-input" type="checkbox" 
                                  checked={notificationsEnabled} 
                                  onChange={(e) => setNotificationsEnabled(e.target.checked)} />
                        </div>
                     </div>

                     <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e2340' }}>
                        <div className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: '1px', color: '#64748b' }}>Active Device</div>
                        <div className="card-glass p-3 d-flex align-items-center flex-row justify-content-between">
                           <div className="d-flex align-items-center gap-3">
                              <i className="bi bi-laptop fs-4" style={{ color: '#4361ee' }} />
                              <div>
                                 <div className="small fw-bold">Current Browser Session</div>
                                 <div style={{ color: '#22c55e', fontSize: '.75rem' }}>Full persistence active</div>
                              </div>
                           </div>
                           <div className="pulse-dot" style={{ background: '#22c55e' }} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="d-flex justify-content-end gap-3 pt-3">
                  <button className="btn-primary-custom" onClick={handleSave} disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm" /> : 'Save Preferences'}
                  </button>
               </div>
             </div>
           )}

           {/* SECURITY TAB */}
           {activeTab === 'Security' && (
             <div className="animation-fade-in">
               <h2 style={{ fontWeight: 800, marginBottom: '.5rem' }}>Security Settings</h2>
               <p style={{ color: '#64748b', marginBottom: '3rem' }}>Manage your password and security preferences.</p>

               <div className="card-glass mb-4">
                 <h6 className="fw-bold mb-4">Change Password</h6>
                 <div className="d-flex flex-column gap-3 max-w-md">
                   <div>
                     <label className="form-label-dark">Current Password</label>
                     <input type="password" className="input-dark" placeholder="••••••••" />
                   </div>
                   <div>
                     <label className="form-label-dark">New Password</label>
                     <input type="password" className="input-dark" placeholder="••••••••" />
                   </div>
                   <div className="mt-2">
                     <button className="btn-primary-custom">Update Password</button>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* APPEARANCE TAB */}
           {activeTab === 'Appearance' && (
             <div className="animation-fade-in">
               <h2 style={{ fontWeight: 800, marginBottom: '.5rem' }}>Appearance Settings</h2>
               <p style={{ color: '#64748b', marginBottom: '3rem' }}>Customize the visual theme of the platform.</p>

               <div className="mb-5">
                  <div className="card-glass border-0 d-flex align-items-center justify-content-between" style={{ background: 'rgba(67,97,238,0.03)' }}>
                     <div>
                        <div className="fw-bold">Dark Mode Default</div>
                        <div style={{ color: '#64748b', fontSize: '.85rem', marginTop: '2px' }}>Strivio is permanently locked in optimal dark mode for coding focus. Light mode is unavailable.</div>
                     </div>
                     <div className="form-check form-switch m-0" style={{ transform: 'scale(1.2)' }}>
                        <input className="form-check-input" type="checkbox" checked disabled />
                     </div>
                  </div>
               </div>
             </div>
           )}

        </div>
      </div>
      <style>{`
        .animation-fade-in { animation: fadeInSettings 0.3s ease; }
        @keyframes fadeInSettings { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
