// src/pages/DailyPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DailyPage() {
  const navigate = useNavigate();
  const [daily, setDaily]           = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
        api.get('/daily'),
        api.get('/problems/random')
    ]).then(([{ data: dailyData }, { data: suggestData }]) => {
        setDaily(dailyData.daily);
        // Ensure suggestions don't include the main daily challenge
        setSuggestions(suggestData.problems.filter(p => p.id !== dailyData.daily?.id));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary mb-3" />
        <div style={{ color: '#64748b' }}>Curating today's challenges...</div>
    </div>
  );

  if (!daily) return (
    <div className="card-glass mt-4 text-center py-5">
        <i className="bi bi-clock-history mb-3 d-block" style={{ fontSize: '3rem', color: '#64748b' }} />
        <h4 style={{ fontWeight: 700 }}>No Challenge Available</h4>
        <p className="text-muted">We're preparing something special for you. Check back shortly!</p>
        <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/problems')}>See all problems</button>
    </div>
  );

  const tags = Array.isArray(daily.tags) ? daily.tags : JSON.parse(daily.tags || '[]');
  
  return (
    <div className="pb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
           <div className="d-flex align-items-center gap-2 mb-1">
             <i className="bi bi-stars" style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
             <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Recommended for you</span>
           </div>
           <h1 style={{ fontWeight: 800, margin: 0 }}>Daily Selection</h1>
        </div>
        <div className="text-end">
            <div style={{ color: '#fff', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
            <div style={{ color: '#64748b', fontSize: '.8rem' }}>Today's Goal</div>
        </div>
      </div>

      <div className="row g-4 mb-5">
          {/* Main Card */}
          <div className="col-md-8">
              <div className="card-glass h-100 p-5 position-relative overflow-hidden" 
                   style={{ border: '1px solid #4361ee44', background: 'linear-gradient(135deg, #13162a 0%, #0d0f1a 100%)' }}>
                
                {/* Decorative background blast */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', 
                              background: '#4361ee', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }} />

                <div className="mb-4">
                   <span className={`badge-${daily.difficulty?.toLowerCase() || 'easy'} me-2`}>{daily.difficulty}</span>
                   {daily.solved && <span className="ms-2" style={{ color: '#22c55e', fontWeight: 700, fontSize: '.9rem' }}><i className="bi bi-check-circle-fill me-1" /> Completed</span>}
                </div>

                <h2 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>{daily.title}</h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                    {daily.description.length > 200 ? daily.description.substring(0, 200) + '...' : daily.description}
                </p>

                <div className="d-flex gap-2 flex-wrap mb-5">
                  {tags.map(t => (
                    <span key={t} style={{ background: 'rgba(67, 97, 238, 0.1)', border: '1px solid rgba(67, 97, 238, 0.2)', borderRadius: 6, padding: '4px 12px', fontSize: '.85rem', color: '#a5b4fc', fontWeight: 500 }}>
                        {t}
                    </span>
                  ))}
                </div>

                <button 
                  className="btn-primary-custom px-5 py-3 d-flex align-items-center gap-3 shadow-lg"
                  onClick={() => navigate(`/workspace/${daily.id}`)}
                  style={{ fontSize: '1.2rem', borderRadius: '12px' }}
                >
                  <i className="bi bi-terminal-fill" /> {daily.solved ? 'Review Submission' : 'Launch Workspace'}
                </button>
              </div>
          </div>

          {/* Sidebar / Info */}
          <div className="col-md-4 d-flex flex-column gap-4">
                <div className="card-glass" style={{ border: '1px solid #1e2340' }}>
                    <h5 style={{ fontWeight: 700, marginBottom: '1.2rem', color: '#fff' }}>Current Strategy</h5>
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: 'rgba(34, 197, 94, 0.1)', flexShrink: 0 }}>
                                <i className="bi bi-lightning-fill" style={{ color: '#22c55e' }} />
                            </div>
                            <div style={{ fontSize: '.9rem', color: '#94a3b8' }}>
                                Start with simple cases to ensure your logic is sound.
                            </div>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: 'rgba(67, 97, 238, 0.1)', flexShrink: 0 }}>
                                <i className="bi bi-clock-history" style={{ color: '#4361ee' }} />
                            </div>
                            <div style={{ fontSize: '.9rem', color: '#94a3b8' }}>
                                Limit yourself to 45 minutes to simulate real coding interviews.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-glass" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <h5 style={{ fontWeight: 700, marginBottom: '1rem', color: '#f59e0b' }}>Consistency Reward</h5>
                    <p style={{ color: '#94a3b8', fontSize: '.85rem' }}>
                        Completing today's challenge will extend your **Flame Streak** by 1 day and grant you **50 XP**.
                    </p>
                    <div className="mt-3 py-2 px-3 rounded" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '.85rem', fontWeight: 600 }}>
                        <i className="bi bi-fire me-1" /> Extend your streak
                    </div>
                </div>
          </div>
      </div>

      {/* Random Suggestions Section */}
      {suggestions.length > 0 && (
          <div className="mt-5">
              <h4 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Keep Practicing</h4>
              <div className="row g-3">
                  {suggestions.map(s => (
                      <div key={s.id} className="col-md-4">
                          <div className="card-glass p-4 h-100 d-flex flex-column" 
                               style={{ cursor: 'pointer', transition: 'border-color 0.2s', border: '1px solid #1e2340' }}
                               onClick={() => navigate(`/workspace/${s.id}`)}>
                              <div className="mb-2">
                                  <span className={`badge-${s.difficulty?.toLowerCase() || 'easy'}`}>{s.difficulty}</span>
                              </div>
                              <h6 style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }} className="mb-2">{s.title}</h6>
                              <p style={{ color: '#64748b', fontSize: '.85rem', flexGrow: 1 }} className="mb-3">
                                  {s.description.substring(0, 80)}...
                              </p>
                              <div className="d-flex align-items-center gap-2" style={{ color: '#4361ee', fontSize: '.85rem', fontWeight: 600 }}>
                                  Solve now <i className="bi bi-arrow-right" />
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
