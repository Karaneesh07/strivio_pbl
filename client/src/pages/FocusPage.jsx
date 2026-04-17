// src/pages/FocusPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({ tasks: '03 / 05', streak: '12 Days', xp: '+450' });

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setTimeLeft(45 * 60); setIsActive(false); };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white" style={{ background: '#0a0c1e', margin: '-1.5rem', minHeight: 'calc(100vh - 56px)' }}>
      <div className="text-uppercase mb-2" style={{ color: '#4361ee', fontSize: '.75rem', letterSpacing: '2px', fontWeight: 600 }}>Current Session: DSA Mastery</div>
      <h4 className="mb-5" style={{ fontWeight: 300, color: '#e2e8f0' }}>Stay focused, developer. Flow state achieved.</h4>

      {/* Glowing Timer Circle */}
      <div className="d-flex align-items-center justify-content-center position-relative mb-5" style={{ width: 520, height: 520 }}>
        {/* Outermost subtle ring */}
        <div className="position-absolute" style={{ width: 510, height: 510, borderRadius: '50%', border: '1px solid rgba(67, 97, 238, 0.08)' }} />
        {/* Main glowing ring */}
        <div className="position-absolute" style={{ width: 480, height: 480, borderRadius: '50%', border: '3px solid rgba(67, 97, 238, 0.2)' }} />
        {/* Inner accent ring */}
        <div className="position-absolute" style={{ width: 450, height: 450, borderRadius: '50%', border: '4px solid #4361ee', boxShadow: '0 0 80px rgba(67, 97, 238, 0.45), inset 0 0 60px rgba(67, 97, 238, 0.05)' }} />
        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '6.5rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>
            {formatTime(timeLeft).split(':')[0]}
            <span style={{ color: '#4361ee', fontSize: '3.5rem', verticalAlign: 'middle', margin: '0 4px' }}>:</span>
            {formatTime(timeLeft).split(':')[1]}
          </div>
          <div className="d-flex justify-content-center gap-5 text-uppercase mt-3" style={{ fontSize: '.7rem', letterSpacing: '2px', color: '#64748b' }}>
            <span>Minutes</span>
            <span>Seconds</span>
          </div>
          {isActive && (
            <div className="mt-2" style={{ fontSize: '.75rem', color: '#4361ee', fontWeight: 600 }}>
              <i className="bi bi-broadcast me-1" />Live Session
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="d-flex gap-3 mb-5">
        <button onClick={toggleTimer} className="btn rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, background: '#13162a', color: 'white', border: '1px solid #1e2340' }}>
          <i className={`bi bi-${isActive ? 'pause' : 'play'}-fill`} />
        </button>
        <button onClick={resetTimer} className="btn rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, background: '#13162a', color: 'white', border: '1px solid #1e2340' }}>
          <i className="bi bi-arrow-counterclockwise" />
        </button>
      </div>

      {/* Stats row */}
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="row text-center border-top border-secondary pt-4">
          <div className="col-4">
            <div className="text-uppercase text-secondary" style={{ fontSize: '.6rem' }}>Tasks Done</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.tasks}</div>
          </div>
          <div className="col-4">
            <div className="text-uppercase text-secondary" style={{ fontSize: '.6rem' }}>Streak</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.streak}</div>
          </div>
          <div className="col-4">
            <div className="text-uppercase text-secondary" style={{ fontSize: '.6rem' }}>XP Earned</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.xp}</div>
          </div>
        </div>
      </div>

      <button className="btn mt-5 py-2 px-4 rounded-pill d-flex align-items-center gap-2" style={{ background: '#13162a', color: '#94a3b8', border: '1px solid #1e2340', fontSize: '.85rem' }}>
        <i className="bi bi-x" /> Exit Focus Mode
      </button>

      {/* Music Widget Overlay (bottom right) */}
      <div className="position-fixed bottom-0 end-0 p-4">
        <div className="card-glass d-flex align-items-center gap-3 p-2 px-3" style={{ borderRadius: 16 }}>
          <div className="bg-primary rounded d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
            <i className="bi bi-music-note-beamed" style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontSize: '.75rem', fontWeight: 600 }}>LoFi Beats</div>
            <div style={{ fontSize: '.65rem', color: '#64748b' }}>Deep Work Radio</div>
          </div>
          <div className="ms-3 d-flex gap-2">
            <i className="bi bi-skip-start-fill" style={{ cursor: 'pointer' }} />
            <i className="bi bi-pause-fill" style={{ cursor: 'pointer' }} />
            <i className="bi bi-skip-end-fill" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
