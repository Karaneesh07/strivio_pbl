// src/pages/SubmissionsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get('/submissions/me').then(({ data }) => setSubmissions(data.submissions))
       .finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    if (s === 'solved')    return <span className="badge-easy">Solved</span>;
    if (s === 'attempted') return <span className="badge-medium">Attempted</span>;
    return <span className="badge-hard">Failed</span>;
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800 }}>My Submissions</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your full submission history</p>

      {loading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>}

      {!loading && submissions.length === 0 && (
        <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
          <i className="bi bi-inbox" style={{ fontSize: '2rem' }} />
          <p className="mt-2">No submissions yet. Solve today's problem!</p>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {submissions.map(sub => (
          <div key={sub.id} className="card-glass d-flex align-items-center gap-4">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>{sub.problem_title}</strong>
                {statusBadge(sub.status)}
              </div>
              <div style={{ color: '#64748b', fontSize: '.85rem' }}>
                {sub.time_taken ? `⏱ ${sub.time_taken}s` : 'No time recorded'} &nbsp;·&nbsp;
                {sub.attempts} attempt{sub.attempts !== 1 ? 's' : ''} &nbsp;·&nbsp;
                {new Date(sub.created_at).toLocaleDateString()}
              </div>
            </div>
            <span className={sub.difficulty === 'Easy' ? 'badge-easy' : sub.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}>
              {sub.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
