import React, { useEffect, useState } from 'react';
import api from '../services/api';

// ── Goal Modal ────────────────────────────────────────────────────
function GoalModal({ goal, onClose, onSaved }) {
  const isEdit = !!goal;
  const [form, setForm] = useState({
    title: goal?.title || '',
    sub_topic: goal?.sub_topic || '',
    progress: goal?.progress ?? 0,
    color: goal?.color || '#4361ee',
  });
  const [saving, setSaving] = useState(false);

  const COLORS = ['#4361ee','#7b2ff7','#22c55e','#f59e0b','#ef4444','#06b6d4','#ec4899','#f97316'];
  const TOPICS = ['Arrays','Strings','Linked Lists','Trees','Graphs','Dynamic Programming','Stack & Queue','Math','Sorting','Greedy','Backtracking','Bit Manipulation'];

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await api.patch(`/goals/${goal.id}`, { progress: form.progress, status: 'ACTIVE' });
      } else {
        await api.post('/goals', form);
      }
      onSaved();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this goal?')) return;
    await api.delete(`/goals/${goal.id}`);
    onSaved();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0 fw-bold">{isEdit ? 'Edit Goal' : 'New Learning Goal'}</h5>
          <button className="btn-icon" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>

        <div className="d-flex flex-column gap-3">
          <div>
            <label className="form-label-dark">Goal Title</label>
            <input className="input-dark" placeholder="e.g. Master Graph Algorithms"
              value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} disabled={isEdit} />
          </div>

          {!isEdit && (
            <div>
              <label className="form-label-dark">Topic Area</label>
              <select className="input-dark" value={form.sub_topic} onChange={e => setForm(f => ({...f, sub_topic: e.target.value}))}>
                <option value="">Select a topic…</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="form-label-dark">
              Progress — <span style={{color:'#4361ee',fontWeight:700}}>{form.progress}%</span>
            </label>
            <input type="range" min="0" max="100" step="5" className="w-100 mt-1"
              style={{accentColor: form.color}} value={form.progress}
              onChange={e => setForm(f => ({...f, progress: parseInt(e.target.value)}))} />
          </div>

          {!isEdit && (
            <div>
              <label className="form-label-dark">Color Label</label>
              <div className="d-flex gap-2 mt-1 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({...f, color: c}))}
                    style={{width:28, height:28, borderRadius:'50%', background:c, border: form.color===c ? '3px solid #fff' : '2px solid transparent', cursor:'pointer', transition:'border 0.15s'}} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{borderTop:'1px solid #1e2340'}}>
          {isEdit
            ? <button className="btn-danger-sm" onClick={handleDelete}><i className="bi bi-trash me-1" />Delete</button>
            : <span />}
          <div className="d-flex gap-2">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary-custom" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm" /> : (isEdit ? 'Save Changes' : 'Create Goal')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function WeeklyGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | goalObj

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get('/goals'), api.get('/analytics/me')])
      .then(([gRes, aRes]) => {
        setGoals(gRes.data.goals);
        setAnalytics(aRes.data.analytics);
      }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const onSaved = () => { setModal(null); fetchAll(); };

  const stats = [
    { label: 'Total Solved',   value: analytics?.total_solved || 0,       icon: 'bi-grid-fill',    color: '#4361ee' },
    { label: 'Accuracy',       value: analytics?.accuracy_rate || '0%',    icon: 'bi-bullseye',     color: '#22c55e' },
    { label: 'Active Streak',  value: `${analytics?.streak || 0} days`,    icon: 'bi-fire',         color: '#f59e0b' },
    { label: 'Active Goals',   value: goals.filter(g=>g.status==='ACTIVE').length, icon: 'bi-flag-fill', color: '#7b2ff7' },
  ];

  const avgProgress = goals.length ? Math.round(goals.reduce((s,g) => s + g.progress, 0) / goals.length) : 0;

  return (
    <div className="container-fluid py-2">
      {modal && <GoalModal goal={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={onSaved} />}

      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <h1 style={{ fontWeight: 800 }}>Weekly Learning Goals</h1>
          <p style={{ color: '#64748b', marginBottom: 0 }}>Track your consistency and master new DSA topics.</p>
        </div>
        <button className="btn-primary-custom d-flex align-items-center gap-2" onClick={() => setModal('new')}>
          <i className="bi bi-plus-lg" /> New Goal
        </button>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mt-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="stat-card">
              <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.2rem' }} />
              <div className="value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4">
          {/* Goals List */}
          <div className="col-md-7">
            <h5 className="mb-3 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-list-check" style={{color:'#4361ee'}} /> Current Goals
            </h5>
            {goals.length === 0 ? (
              <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
                <i className="bi bi-flag mb-3 d-block" style={{ fontSize: '2.5rem' }} />
                <p className="mb-3">No active goals yet. Set your first learning goal!</p>
                <button className="btn-primary-custom" onClick={() => setModal('new')}>Create Goal →</button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {goals.map(g => (
                  <div key={g.id} className="card-glass position-relative"
                    style={{ borderLeft: `3px solid ${g.color}`, cursor: 'pointer' }}
                    onClick={() => setModal(g)}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 42, height: 42, background: g.color + '22', color: g.color, flexShrink: 0 }}>
                        <i className="bi bi-award-fill" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{g.title}</div>
                        <small style={{ color: '#64748b' }}>{g.sub_topic}</small>
                      </div>
                      <span className="badge" style={{ fontSize: '.65rem', background: g.color + '22', color: g.color, border: `1px solid ${g.color}44` }}>
                        {g.status}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span style={{ color: '#94a3b8' }}>Progress</span>
                      <span style={{ fontWeight: 700, color: g.color }}>{g.progress}%</span>
                    </div>
                    <div className="progress" style={{ height: 7, background: '#13162a', borderRadius: 99 }}>
                      <div className="progress-bar" style={{ width: `${g.progress}%`, background: `linear-gradient(90deg, ${g.color}bb, ${g.color})`, borderRadius: 99, transition: 'width 0.5s ease' }} />
                    </div>
                    <small className="d-block mt-2" style={{color:'#64748b'}}>Click to edit progress</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insights Panel */}
          <div className="col-md-5">
            <div className="card-glass mb-3" style={{ background: 'rgba(67,97,238,0.05)', border: '1px solid rgba(67,97,238,0.2)' }}>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-bar-chart-fill" style={{color:'#4361ee'}} /> Weekly Progress
              </h5>
              <div className="text-center py-3">
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#4361ee' }}>{avgProgress}%</div>
                <div style={{ color: '#64748b', fontSize: '.85rem' }}>Average across all goals</div>
              </div>
              <div className="progress mt-2" style={{ height: 10, background: '#13162a', borderRadius: 99 }}>
                <div className="progress-bar" style={{ width: `${avgProgress}%`, background: 'linear-gradient(90deg,#4361ee,#7b2ff7)', borderRadius: 99 }} />
              </div>
            </div>

            <div className="card-glass">
              <h6 className="fw-bold mb-3"><i className="bi bi-lightbulb-fill me-2" style={{color:'#f59e0b'}}/>Pro Tips</h6>
              {[
                '1 focused problem daily beats 10 rushed problems weekly.',
                'Tag topics you struggle with — they become your roadmap.',
                'Mark a goal complete only when you can teach it to someone else.',
              ].map((tip, i) => (
                <div key={i} className="d-flex gap-2 mb-3 small" style={{ color: '#94a3b8' }}>
                  <span style={{ color: '#4361ee', fontWeight: 700, minWidth: 18 }}>{i+1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
