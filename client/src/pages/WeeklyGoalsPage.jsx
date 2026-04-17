// src/pages/WeeklyGoalsPage.jsx
import React from 'react';

export default function WeeklyGoalsPage() {
  const stats = [
    { label: 'Total Problems', value: '24/40', change: '-12%', icon: 'bi-grid' },
    { label: 'Target Reach Rate', value: '85%', change: '+5%', icon: 'bi-bullseye' },
    { label: 'Active Streak', value: '12 Days', change: '+2', icon: 'bi-fire' },
    { label: 'Topics Mastered', value: '08', change: 'Target: 10', icon: 'bi-book' },
  ];

  const goals = [
    { title: 'Graphs & Trees', sub: 'Medium to Hard problems', progress: 60, status: 'ACTIVE', color: '#4361ee' },
    { title: 'Dynamic Programming', sub: '12 DP & Knapsack variants', progress: 85, status: 'ON TRACK', color: '#22c55e' },
    { title: 'System Design', sub: 'Caching & Load Balancing basic', progress: 30, status: 'PENDING', color: '#64748b' },
  ];

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h1 style={{ fontWeight: 800 }}>Weekly Learning Goals</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus" /> Set New Goal
        </button>
      </div>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Track your consistency, master new DSA topics, and outpace your previous week's performance.</p>

      {/* Stats Row */}
      <div className="row g-4 mb-5">
        {stats.map(s => (
          <div key={s.label} className="col-md-3">
            <div className="card-glass p-3 h-100">
              <div className="text-secondary small mb-2">{s.label}</div>
              <div className="d-flex justify-content-between align-items-end">
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
                <div className={`small ${s.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>{s.change}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="m-0 fw-bold">Current Goals</h5>
            <i className="bi bi-filter text-secondary" style={{ cursor: 'pointer' }} />
          </div>
          
          <div className="d-flex flex-column gap-4">
            {goals.map(g => (
              <div key={g.title} className="card-glass position-relative p-4">
                <div className="position-absolute top-0 end-0 p-3">
                  <span className="badge" style={{ fontSize: '.6rem', background: '#1a1e35', color: g.color, border: `1px solid ${g.color}33` }}>{g.status}</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: '#13162a', color: '#4361ee' }}>
                    <i className="bi bi-share" />
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold">{g.title}</h6>
                    <small className="text-secondary">{g.sub}</small>
                  </div>
                </div>
                <div className="mb-2 d-flex justify-content-between small">
                  <span className="text-secondary">Progress</span>
                  <span style={{ fontWeight: 600 }}>{g.progress}%</span>
                </div>
                <div className="progress" style={{ height: 6, background: '#13162a' }}>
                  <div className="progress-bar" style={{ width: `${g.progress}%`, background: g.color }} />
                </div>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <img src="https://ui-avatars.com/api/?name=User+A&background=random" className="rounded-circle border border-dark" style={{ width: 20, height: 20 }} alt="" />
                    <img src="https://ui-avatars.com/api/?name=User+B&background=random" className="rounded-circle border border-dark ms-n2" style={{ width: 20, height: 20, marginLeft: '-8px' }} alt="" />
                  </div>
                  <a href="#" className="small text-primary text-decoration-none">View Program</a>
                </div>
              </div>
            ))}

            <div className="card-glass border-dashed d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: 180, borderStyle: 'dashed' }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 40, height: 40, background: '#13162a', color: '#4361ee' }}>
                <i className="bi bi-plus" />
              </div>
              <h6 className="fw-bold">Add New Domain</h6>
              <small className="text-secondary">Explore Recursion, Bit Manipulation, or Linked Lists</small>
            </div>
          </div>
        </div>

        <div className="col-md-5">
           <div className="card-glass h-100 p-4 d-flex flex-column">
              <h5 className="fw-bold mb-1">Weekly Intensity Map</h5>
              <p className="small text-secondary mb-4">Your coding intensity peaked on Wednesday and Friday. Keep this momentum for the upcoming weekend challenge.</p>
              
              <div className="d-flex justify-content-between align-items-end flex-grow-1 px-3 mb-4" style={{ height: 120 }}>
                {[60, 40, 100, 50, 90, 30, 20].map((h, i) => (
                  <div key={i} className="bg-primary rounded-pill" style={{ width: 12, height: `${h}%`, opacity: h > 70 ? 1 : 0.4 }} />
                ))}
              </div>
              <div className="d-flex justify-content-between px-3 mb-5 small text-secondary">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>

              <div className="mt-auto d-flex flex-column gap-3">
                <div className="p-3 rounded d-flex gap-3 align-items-center" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <i className="bi bi-check-circle-fill text-success" />
                  <div>
                    <div className="small fw-bold text-white">Consistency Peak</div>
                    <div className="text-secondary" style={{ fontSize: '.7rem' }}>You are in the top 5% of learners this week. Your average solve time decreased by 4.2 minutes!</div>
                  </div>
                </div>
                <div className="p-3 rounded d-flex gap-3 align-items-center" style={{ background: 'rgba(67, 97, 238, 0.1)', border: '1px solid rgba(67, 97, 238, 0.2)' }}>
                  <i className="bi bi-pin-angle-fill text-primary" />
                  <div>
                    <div className="small fw-bold text-white">Next Milestone</div>
                    <div className="text-secondary" style={{ fontSize: '.7rem' }}>Solve 5 more Graph problems to unlock the "Traversal Master" badge.</div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
