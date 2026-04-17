// src/pages/LeaderboardPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { user }  = useAuth();
  const [board, setBoard]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then(({ data }) => setBoard(data.leaderboard))
       .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>;

  const medalColor = (rank) => {
    if (rank === 1) return '#f59e0b';
    if (rank === 2) return '#94a3b8';
    if (rank === 3) return '#b45309';
    return '#4361ee';
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800 }}>Leaderboard</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Top consistency builders</p>

      <div className="d-flex flex-column gap-2">
        {board.map(entry => (
          <div key={entry.id}
            className="card-glass d-flex align-items-center gap-3 py-2"
            style={entry.id === user?.id ? { border: '1px solid #4361ee' } : {}}>
            {/* Rank */}
            <div style={{ width: 36, textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', color: medalColor(entry.rank) }}>
              {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
            </div>
            {/* Name */}
            <div className="flex-grow-1">
              <span style={{ fontWeight: 600 }}>{entry.name}</span>
              {entry.id === user?.id && <span className="ms-2" style={{ color: '#4361ee', fontSize: '.8rem' }}>(you)</span>}
            </div>
            {/* Streak */}
            <div className="text-center" style={{ minWidth: 70 }}>
              <div style={{ fontWeight: 700, color: '#f59e0b' }}>🔥 {entry.streak}</div>
              <div style={{ color: '#64748b', fontSize: '.75rem' }}>streak</div>
            </div>
            {/* Solved */}
            <div className="text-center" style={{ minWidth: 70 }}>
              <div style={{ fontWeight: 700, color: '#22c55e' }}>{entry.total_solved}</div>
              <div style={{ color: '#64748b', fontSize: '.75rem' }}>solved</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
