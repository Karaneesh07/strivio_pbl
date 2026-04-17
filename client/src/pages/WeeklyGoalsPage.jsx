import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function WeeklyGoalsPage() {
  const [goals, setGoals]     = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/goals'),
      api.get('/analytics/me')
    ]).then(([gRes, aRes]) => {
      setGoals(gRes.data.goals);
      setAnalytics(aRes.data.analytics);
    }).finally(() => setLoading(false));
  }, []);

  const handleAddGoal = () => {
      const title = prompt("Goal Title (e.g. Graph Mastery):");
      if (!title) return;
      api.post('/goals', { title, sub_topic: 'Learning Path', progress: 0, color: '#4361ee' })
         .then(() => api.get('/goals').then(r => setGoals(r.data.goals)));
  };

  const handleUpdate = (id, current) => {
      const next = prompt("New Progress (0-100):", current);
      if (next === null) return;
      api.patch(`/goals/${id}`, { progress: parseInt(next) })
         .then(() => api.get('/goals').then(r => setGoals(r.data.goals)));
  };

  const stats = [
    { label: 'Total Solved', value: analytics?.total_solved || 0, icon: 'bi-grid' },
    { label: 'Accuracy', value: analytics?.accuracy_rate || '0%', icon: 'bi-bullseye' },
    { label: 'Active Streak', value: analytics?.streak || 0, icon: 'bi-fire' },
    { label: 'Next Milestone', value: '10 Problems', icon: 'bi-book' },
  ];

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h1 style={{ fontWeight: 800 }}>Weekly Learning Goals</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleAddGoal}>
          <i className="bi bi-plus" /> Set New Goal
        </button>
      </div>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Track your consistency and master new DSA topics.</p>

      {/* Stats Row */}
      <div className="row g-4 mb-5">
        {stats.map(s => (
          <div key={s.label} className="col-md-3">
            <div className="card-glass p-3 h-100">
              <div className="text-secondary small mb-2">{s.label}</div>
              <div className="d-flex justify-content-between align-items-end">
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
          <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row">
          <div className="col-md-7">
            <h5 className="mb-4 fw-bold">Current Goals</h5>
            
            {goals.length === 0 ? (
                <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
                    <i className="bi bi-flag mb-2" style={{ fontSize: '2rem' }} />
                    <p>No active goals. Challenge yourself today!</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {goals.map(g => (
                    <div key={g.id} className="card-glass position-relative p-4" style={{ cursor: 'pointer' }} onClick={() => handleUpdate(g.id, g.progress)}>
                        <div className="position-absolute top-0 end-0 p-3">
                        <span className="badge" style={{ fontSize: '.6rem', background: '#1a1e35', color: g.color, border: `1px solid ${g.color}33` }}>{g.status}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: '#13162a', color: g.color }}>
                            <i className="bi bi-award" />
                        </div>
                        <div>
                            <h6 className="m-0 fw-bold">{g.title}</h6>
                            <small className="text-secondary">{g.sub_topic}</small>
                        </div>
                        </div>
                        <div className="mb-2 d-flex justify-content-between small">
                        <span className="text-secondary">Progress</span>
                        <span style={{ fontWeight: 600 }}>{g.progress}%</span>
                        </div>
                        <div className="progress" style={{ height: 6, background: '#13162a' }}>
                        <div className="progress-bar" style={{ width: `${g.progress}%`, background: g.color }} />
                        </div>
                    </div>
                    ))}
                </div>
            )}
          </div>

          <div className="col-md-5">
            <div className="card-glass h-100 p-4">
                <h5 className="fw-bold mb-3">Goal Insights</h5>
                <p className="text-secondary small">Set specific, measurable goals (S.M.A.R.T) to improve your DSA proficiency faster.</p>
                <div className="mt-4 p-3 rounded" style={{ background: 'rgba(67, 97, 238, 0.1)', border: '1px solid rgba(67, 97, 238, 0.2)' }}>
                    <div className="small fw-bold mb-1">💡 Pro Tip</div>
                    <div className="text-secondary" style={{ fontSize: '.75rem' }}>Consistency is key. 1 problem every day is better than 10 problems in one day once a week.</div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
