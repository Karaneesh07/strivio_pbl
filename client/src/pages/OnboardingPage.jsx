import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  {
    id: 'welcome',
    icon: '🚀',
    title: (name) => `Welcome to Strivio, ${name}!`,
    subtitle: 'Your DSA mastery journey starts here. Solve one problem a day and watch your skills skyrocket.',
    content: null,
  },
  {
    id: 'goal',
    icon: '🎯',
    title: () => 'Set Your Daily Target',
    subtitle: 'How many problems do you aim to solve each day? Consistency beats intensity.',
    content: ({ value, onChange }) => (
      <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
        {[
          { n: 1, label: 'Casual', sub: 'Just getting started' },
          { n: 2, label: 'Focused', sub: 'Building momentum' },
          { n: 3, label: 'Dedicated', sub: 'Serious learner' },
          { n: 5, label: 'Grind Mode', sub: 'Interview prep' },
        ].map(({ n, label, sub }) => (
          <button key={n} onClick={() => onChange(n)}
            className="d-flex flex-column align-items-center p-3"
            style={{ background: value === n ? 'rgba(67,97,238,0.15)' : '#13162a',
              border: `2px solid ${value === n ? '#4361ee' : '#1e2340'}`,
              borderRadius: 14, cursor: 'pointer', minWidth: 120, transition: 'all 0.2s' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: value === n ? '#4361ee' : '#e2e8f0' }}>{n}</div>
            <div style={{ fontWeight: 700, color: value === n ? '#4361ee' : '#e2e8f0', fontSize: '.9rem' }}>{label}</div>
            <div style={{ fontSize: '.75rem', color: '#64748b', marginTop: 2 }}>{sub}</div>
          </button>
        ))}
      </div>
    ),
  },
  {
    id: 'topics',
    icon: '📚',
    title: () => 'Choose Your Focus Areas',
    subtitle: 'Select topics you want to master. We\'ll prioritize these in your daily challenges.',
    content: ({ value, onChange }) => {
      const TOPICS = ['Arrays','Strings','Linked Lists','Trees','Graphs','Dynamic Programming','Stack & Queue','Math','Sorting','Greedy'];
      return (
        <div className="d-flex gap-2 flex-wrap justify-content-center mt-4">
          {TOPICS.map(t => {
            const active = value.includes(t);
            return (
              <button key={t} onClick={() => onChange(active ? value.filter(x=>x!==t) : [...value,t])}
                style={{ background: active ? 'rgba(67,97,238,0.15)' : '#13162a',
                  border: `1px solid ${active ? '#4361ee' : '#1e2340'}`,
                  color: active ? '#a5b4fc' : '#94a3b8', borderRadius: 8,
                  padding: '8px 16px', cursor: 'pointer', fontWeight: active ? 600 : 400,
                  fontSize: '.85rem', transition: 'all 0.15s' }}>
                {active && <i className="bi bi-check me-1" />} {t}
              </button>
            );
          })}
        </div>
      );
    },
  },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2);
  const [topics, setTopics] = useState([]);

  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('strivio_onboarded', '1');
      localStorage.setItem('strivio_daily_goal', dailyGoal);
      localStorage.setItem('strivio_topics', JSON.stringify(topics));
      navigate('/');
    } else {
      setStep(s => s + 1);
    }
  };

  const canNext = step === 0 || step === 2 ? true : (step === 1 ? dailyGoal > 0 : topics.length > 0);

  const S = STEPS[step];

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, rgba(67,97,238,0.12) 0%, #0d0f1a 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

      {/* Progress bullets */}
      <div className="d-flex gap-2 mb-5">
        {STEPS.map((_, i) => (
          <div key={i} style={{ width: i === step ? 28 : 8, height: 8, borderRadius: 99,
            background: i <= step ? '#4361ee' : '#1e2340', transition: 'all 0.3s ease' }} />
        ))}
      </div>

      {/* Card */}
      <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1 }}>{S.icon}</div>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '.75rem' }}>
          {S.title(user?.name?.split(' ')[0] || 'there')}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          {S.subtitle}
        </p>

        {S.content && S.content({
          value: step === 1 ? dailyGoal : topics,
          onChange: step === 1 ? setDailyGoal : setTopics,
        })}

        <div className="d-flex justify-content-center gap-3 mt-5">
          {step > 0 && (
            <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>
              <i className="bi bi-arrow-left me-2" />Back
            </button>
          )}
          <button className="btn-primary-custom px-5" onClick={handleNext} disabled={!canNext}
            style={{ fontSize: '1rem', padding: '12px 36px', borderRadius: 12 }}>
            {isLast ? '🚀 Start Solving!' : 'Continue'} {!isLast && <i className="bi bi-arrow-right ms-2" />}
          </button>
        </div>

        {step === 0 && (
          <button onClick={() => { localStorage.setItem('strivio_onboarded','1'); navigate('/'); }}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '1rem', fontSize: '.85rem' }}>
            Skip onboarding
          </button>
        )}
      </div>
    </div>
  );
}
