// src/pages/AnalyticsPage.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/me').then(({ data: d }) => setData(d.analytics))
       .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>;

  const chartData = {
    labels: data?.weekly_activity?.map(r => r.date) || [],
    datasets: [{
      label: 'Problems Solved',
      data: data?.weekly_activity?.map(r => r.count) || [],
      backgroundColor: 'rgba(67,97,238,0.6)',
      borderColor: '#4361ee',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
      title:  { display: false },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#1e2340' } },
      y: { ticks: { color: '#64748b', stepSize: 1 }, grid: { color: '#1e2340' } },
    },
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800 }}>Analytics</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your performance overview</p>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Solved',   value: data?.total_solved ?? 0,       icon: 'bi-check2-all',     color: '#22c55e' },
          { label: 'Accuracy Rate',  value: data?.accuracy_rate ?? '0%',   icon: 'bi-bullseye',       color: '#4361ee' },
          { label: 'Avg Time',       value: data?.avg_time_seconds ? `${data.avg_time_seconds}s` : 'N/A', icon: 'bi-stopwatch', color: '#f59e0b' },
          { label: 'Skill Level',    value: data?.skill_level ?? 'Beginner', icon: 'bi-award',          color: '#7b2ff7' },
          { label: 'Streak',         value: `${data?.streak ?? 0} Days`,   icon: 'bi-fire',           color: '#f59e0b' },
          { label: 'Focus Time',     value: data?.total_focus_seconds ? `${Math.round(data.total_focus_seconds/60)}m` : '0m', icon: 'bi-eyeglasses', color: '#22c55e' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="col-6 col-lg-4">
            <div className="stat-card">
              <i className={`bi ${icon}`} style={{ color, fontSize: '1.4rem' }} />
              <div className="value" style={{ color }}>{value}</div>
              <div className="label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-glass">
        <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>Weekly Activity (Last 7 Days)</h5>
        {data?.weekly_activity?.length > 0
          ? <Bar data={chartData} options={chartOptions} />
          : <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No activity in the last 7 days.</p>
        }
      </div>
    </div>
  );
}
