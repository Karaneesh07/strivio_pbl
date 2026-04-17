// src/pages/SettingsPage.jsx
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="container-fluid py-3">
      <div className="row g-5">
        {/* Left: Settings Sidebar */}
        <div className="col-md-3">
           <div className="d-flex align-items-center gap-3 mb-5 px-3">
              <div className="rounded border border-secondary p-2 d-flex align-items-center justify-content-center bg-dark" style={{ width: 44, height: 44 }}>
                 <i className="bi bi-gear text-primary fs-5" />
              </div>
              <div>
                 <h5 className="m-0 fw-bold">Settings</h5>
                 <small className="text-secondary">Manage preferences</small>
              </div>
           </div>

           <div className="d-flex flex-column gap-2">
              {[
                { icon: 'person', label: 'Account' },
                { icon: 'bell', label: 'Notifications', active: true },
                { icon: 'shield-lock', label: 'Security' },
                { icon: 'credit-card', label: 'Billing' },
                { icon: 'puzzle', label: 'Integrations' },
              ].map(item => (
                <div key={item.label} className={`d-flex align-items-center gap-3 p-3 rounded-pill px-4 ${item.active ? 'bg-primary text-white' : 'text-secondary'}`} style={{ cursor: 'pointer', fontSize: '.9rem' }}>
                  <i className={`bi bi-${item.icon}`} />
                  <span className="fw-bold">{item.label}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Content Area */}
        <div className="col-md-9 border-start border-secondary border-opacity-25 ps-5">
           <h1 style={{ fontWeight: 800 }}>App Settings & Notifications</h1>
           <p className="text-secondary mb-5">Customize how Strivio keeps you on track with your coding goals.</p>

           <div className="mb-5">
              <h6 className="fw-bold border-start border-primary border-4 ps-3 mb-4">Appearance</h6>
              <div className="card-glass border-0 bg-opacity-25 p-4 d-flex align-items-center justify-content-between">
                 <div>
                    <div className="fw-bold">Dark Mode</div>
                    <div className="text-secondary small">Toggle between light and dark visual themes.</div>
                 </div>
                 <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" defaultChecked style={{ width: '3em', height: '1.5em' }} />
                 </div>
              </div>
           </div>

           <div className="mb-5">
              <h6 className="fw-bold border-start border-primary border-4 ps-3 mb-4">Practice Reminders</h6>
              <div className="card-glass border-0 bg-opacity-25 p-4 d-flex align-items-center justify-content-between">
                 <div>
                    <div className="fw-bold">Daily Goal Reminder</div>
                    <div className="text-secondary small">Pick a time to receive a nudge for your daily DSA problem.</div>
                 </div>
                 <div className="d-flex align-items-center gap-3 bg-dark border border-secondary p-2 rounded px-4">
                    <span className="fw-bold">08:00 PM</span>
                    <i className="bi bi-clock text-secondary" />
                 </div>
              </div>
           </div>

           <div className="mb-5">
              <h6 className="fw-bold border-start border-primary border-4 ps-3 mb-4">Push Notifications</h6>
              <div className="card-glass border-0 bg-opacity-25 p-4">
                 <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                       <i className="bi bi-lightning-fill text-primary" />
                       <div className="fw-bold">Enable Desktop Notifications</div>
                    </div>
                    <div className="form-check form-switch m-0">
                       <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                 </div>

                 <div className="p-3 mb-4 rounded d-flex align-items-center justify-content-between bg-primary bg-opacity-10 border border-primary border-opacity-25">
                    <div className="d-flex align-items-center gap-2 small text-primary">
                       <i className="bi bi-info-circle-fill" /> Not receiving notifications? Browser permissions might be blocked.
                    </div>
                    <button className="btn btn-sm btn-primary">Re-request Permission</button>
                 </div>

                 <div className="mt-4">
                    <div className="text-uppercase text-secondary small fw-bold mb-3" style={{ letterSpacing: '1px' }}>Connected Devices</div>
                    <div className="row g-3">
                       <div className="col-md-6">
                          <div className="card-glass p-3 d-flex align-items-center justify-content-between bg-dark border-opacity-50">
                             <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-laptop fs-4 text-secondary" />
                                <div>
                                   <div className="small fw-bold">MacBook Pro 16"</div>
                                   <div className="text-secondary" style={{ fontSize: '.65rem' }}>Chrome • Last active 2m ago</div>
                                </div>
                             </div>
                             <div className="bg-success rounded-circle" style={{ width: 8, height: 8 }} />
                          </div>
                       </div>
                       <div className="col-md-6">
                          <div className="card-glass p-3 d-flex align-items-center justify-content-between bg-dark border-opacity-50">
                             <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-phone fs-4 text-secondary" />
                                <div>
                                   <div className="small fw-bold">iPhone 15 Pro</div>
                                   <div className="text-secondary" style={{ fontSize: '.65rem' }}>iOS App • Last active 4h ago</div>
                                </div>
                             </div>
                             <i className="bi bi-trash text-secondary small ms-auto" style={{ cursor: 'pointer' }} />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="d-flex justify-content-end gap-3 pt-4 border-top border-secondary border-opacity-25">
              <button className="btn text-secondary">Discard Changes</button>
              <button className="btn btn-primary px-5 rounded-pill shadow">Save Preferences</button>
           </div>
        </div>
      </div>
    </div>
  );
}
