// src/pages/ProblemsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProblemsPage() {
  const [problems, setProblems]   = useState([]);
  const [filter, setFilter]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/problems').then(({ data }) => setProblems(data.problems))
       .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? problems.filter(p => p.difficulty === filter) : problems;

  const diffBadge = (d) => {
    if (d === 'Easy')   return <span className="badge-easy">{d}</span>;
    if (d === 'Medium') return <span className="badge-medium">{d}</span>;
    return <span className="badge-hard">{d}</span>;
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800 }}>Problems</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Browse all DSA challenges</p>

      {/* Filter buttons */}
      <div className="d-flex gap-2 mb-4">
        {['', 'Easy', 'Medium', 'Hard'].map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className={filter === d ? 'btn-primary-custom' : ''}
            style={filter !== d ? { background: '#13162a', border: '1px solid #1e2340', color: '#94a3b8', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' } : {}}>
            {d || 'All'}
          </button>
        ))}
      </div>

      {loading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>}

      <div className="d-flex flex-column gap-3">
        {filtered.map(p => (
          <div 
            key={p.id} 
            className="card-glass d-flex align-items-start gap-3" 
            style={{ cursor: 'pointer', transition: 'border .2s' }}
            onClick={() => window.location.href = `/workspace/${p.id}`}
          >
            <span style={{ color: '#4361ee', fontWeight: 700, fontSize: '1.1rem', minWidth: 30 }}>#{p.id}</span>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>{p.title}</strong>
                {diffBadge(p.difficulty)}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '.88rem', margin: 0 }}>{p.description?.slice(0, 120)}…</p>
              <div className="d-flex gap-1 flex-wrap mt-2">
                {(Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || '[]')).map(t => (
                  <span key={t} style={{ background: '#1a1e35', border: '1px solid #1e2340', borderRadius: 6, padding: '1px 8px', fontSize: '.75rem', color: '#94a3b8' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
