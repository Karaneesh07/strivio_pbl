import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PRESETS = [
  { label: 'Pomodoro', minutes: 25, icon: 'bi-clock', color: '#ef4444' },
  { label: 'Deep Work', minutes: 45, icon: 'bi-eyeglasses', color: '#4361ee' },
  { label: 'Flow State', minutes: 60, icon: 'bi-lightning-fill', color: '#7b2ff7' },
];

export default function FocusPage() {
  const navigate = useNavigate();
  const [preset, setPreset] = useState(1); // default Deep Work
  const [totalSecs, setTotalSecs] = useState(45 * 60);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ tasks: 0, streak: 0, xp: 0 });
  const intervalRef = useRef(null);
  const startedAt = useRef(null);

  useEffect(() => {
    api.get('/analytics/me').then(({ data: d }) => {
      const a = d.analytics;
      setStats({ tasks: a.total_solved ?? 0, streak: a.streak ?? 0, xp: (a.total_solved ?? 0) * 50 });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setCompleted(true);
      api.post('/focus/end').catch(() => {});
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const selectPreset = (idx) => {
    if (isActive) return;
    setPreset(idx);
    const secs = PRESETS[idx].minutes * 60;
    setTotalSecs(secs);
    setTimeLeft(secs);
    setCompleted(false);
  };

  const toggle = () => {
    if (completed) return;
    if (!isActive) {
      startedAt.current = Date.now();
      api.post('/focus/start').catch(() => {});
    } else {
      api.post('/focus/end').catch(() => {});
    }
    setIsActive(prev => !prev);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    if (isActive) api.post('/focus/end').catch(() => {});
    setIsActive(false);
    setCompleted(false);
    const secs = PRESETS[preset].minutes * 60;
    setTotalSecs(secs);
    setTimeLeft(secs);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const progress = totalSecs > 0 ? (totalSecs - timeLeft) / totalSecs : 0;

  // SVG ring
  const R = 160;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - progress);
  const col = PRESETS[preset].color;

  return (
    <div className="focus-page" style={{ margin: '-2rem', minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 60% 30%, rgba(67,97,238,0.08) 0%, #0a0c1e 70%)', padding: '2rem' }}>

      {/* Preset Selector */}
      <div className="d-flex gap-2 mb-5">
        {PRESETS.map((p, i) => (
          <button key={p.label} onClick={() => selectPreset(i)} disabled={isActive}
            className="d-flex align-items-center gap-2"
            style={{ background: preset === i ? col + '22' : '#13162a', border: `1px solid ${preset === i ? col : '#1e2340'}`,
              color: preset === i ? col : '#64748b', borderRadius: 10, padding: '8px 18px', cursor: isActive ? 'not-allowed' : 'pointer',
              fontWeight: preset === i ? 700 : 400, transition: 'all 0.2s', fontSize: '.9rem' }}>
            <i className={`bi ${p.icon}`} />
            {p.label} <span style={{ opacity: 0.7, fontSize: '.8rem' }}>{p.minutes}m</span>
          </button>
        ))}
      </div>

      {/* Animated SVG Ring */}
      <div className="position-relative mb-4" style={{ width: 380, height: 380 }}>
        <svg width="380" height="380" viewBox="0 0 380 380" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Track */}
          <circle cx="190" cy="190" r={R} fill="none" stroke="#1e2340" strokeWidth="8" />
          {/* Progress */}
          <circle cx="190" cy="190" r={R} fill="none"
            stroke={col} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={dashOffset}
            transform="rotate(-90 190 190)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease', filter: `drop-shadow(0 0 12px ${col}88)` }} />
        </svg>

        {/* Center Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {completed ? (
            <div className="text-center">
              <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#22c55e' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#22c55e', marginTop: '0.5rem' }}>Session Complete!</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-3px', color: '#fff', lineHeight: 1 }}>
                {mm}<span style={{ color: col, fontSize: '2.5rem' }}>:</span>{ss}
              </div>
              <div style={{ color: '#64748b', fontSize: '.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                {PRESETS[preset].label}
              </div>
              {isActive && (
                <div className="d-flex align-items-center gap-1 mt-2" style={{ color: col, fontSize: '.72rem', fontWeight: 600 }}>
                  <span className="pulse-dot" style={{ background: col }} />Live Session
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex gap-3 mb-5">
        <button onClick={toggle} disabled={completed}
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: 56, height: 56, background: col, border: 'none', color: '#fff', fontSize: '1.3rem', cursor: completed ? 'not-allowed' : 'pointer', boxShadow: `0 0 24px ${col}66`, transition: 'all 0.2s' }}>
          <i className={`bi bi-${isActive ? 'pause' : 'play'}-fill`} />
        </button>
        <button onClick={reset}
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: 56, height: 56, background: '#13162a', border: '1px solid #1e2340', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
          <i className="bi bi-arrow-counterclockwise" />
        </button>
        <button onClick={() => navigate('/')}
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: 56, height: 56, background: '#13162a', border: '1px solid #1e2340', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
          <i className="bi bi-x-lg" />
        </button>
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'flex', gap: '4rem', borderTop: '1px solid #1e2340', paddingTop: '1.5rem' }}>
        {[
          { label: 'SOLVED', value: stats.tasks },
          { label: 'STREAK', value: `${stats.streak}d` },
          { label: 'XP EARNED', value: `+${stats.xp}` },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div style={{ fontSize: '.6rem', color: '#64748b', letterSpacing: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Music widget */}
      <div className="position-fixed bottom-0 end-0 p-4">
        <div className="card-glass d-flex align-items-center gap-3 p-2 px-3" style={{ borderRadius: 16 }}>
          <div className="d-flex align-items-center justify-content-center rounded" style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4361ee,#7b2ff7)' }}>
            <i className="bi bi-music-note-beamed" style={{ color: '#fff', fontSize: '.85rem' }} />
          </div>
          <div>
            <div style={{ fontSize: '.75rem', fontWeight: 600 }}>LoFi Beats</div>
            <div style={{ fontSize: '.65rem', color: '#64748b' }}>Deep Work Radio</div>
          </div>
          <div className="ms-2 d-flex gap-2" style={{ color: '#94a3b8' }}>
            <i className="bi bi-skip-start-fill" style={{ cursor: 'pointer' }} />
            <i className={`bi bi-${isActive ? 'pause' : 'play'}-fill`} style={{ cursor: 'pointer', color: isActive ? col : '#94a3b8' }} />
            <i className="bi bi-skip-end-fill" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
