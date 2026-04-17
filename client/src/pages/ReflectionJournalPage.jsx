// src/pages/ReflectionJournalPage.jsx
import React from 'react';

export default function ReflectionJournalPage() {
  const entries = [
    { id: 1, title: 'Optimized Sliding Window', date: 'OCT 26, 2023', type: 'Solved', color: '#22c55e' },
    { id: 2, title: "Dijkstra's Complexity", date: 'OCT 24, 2023', type: 'Self Reflect', color: '#f59e0b' },
    { id: 3, title: 'DP: Knapsack Patterns', date: 'OCT 21, 2023', type: 'Review', color: '#4361ee' },
    { id: 4, title: 'Load Balancing Strategies', date: 'OCT 18, 2023', type: 'Mastered', color: '#22c55e' },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h1 style={{ fontWeight: 800 }}>Reflection Journal</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus" /> New Entry
        </button>
      </div>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Track your cognitive patterns and DSA breakthroughs.</p>

      <div className="row g-4">
        {/* Left Sidebar: Entries */}
        <div className="col-md-4">
          <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
            <button className="btn btn-sm btn-primary rounded-pill px-3">All Topics</button>
            <button className="btn btn-sm btn-dark border border-secondary text-secondary rounded-pill px-3">Arrays</button>
            <button className="btn btn-sm btn-dark border border-secondary text-secondary rounded-pill px-3">DP</button>
            <button className="btn btn-sm btn-dark border border-secondary text-secondary rounded-pill px-3">Graphs</button>
          </div>

          <div className="d-flex flex-column gap-3">
            {entries.map(e => (
              <div key={e.id} className={`card-glass p-3 border-opacity-10 ${e.id === 1 ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <small className="text-secondary">{e.date}</small>
                  <span className="badge" style={{ fontSize: '.6rem', background: '#13162a', color: e.color, border: `1px solid ${e.color}33` }}>{e.type}</span>
                </div>
                <h6 className="fw-bold m-0">{e.title}</h6>
                <p className="small text-secondary mt-1 mb-0">Finally understood the O(1) condition logic to avoid heap...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Content */}
        <div className="col-md-8">
          <div className="card-glass p-5 h-100 border-opacity-10">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <small className="text-primary fw-bold text-uppercase" style={{ fontSize: '.7rem' }}>Tuesday, Oct 24, 2023</small>
                <h2 className="fw-bold mt-1">Optimized Sliding Window Approach</h2>
                <div className="d-flex gap-2 mt-2">
                  <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ fontSize: '.7rem' }}>Arrays</span>
                  <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2" style={{ fontSize: '.7rem' }}>Medium Difficulty</span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-dark border border-secondary rounded p-2 px-3 shadow-none"><i className="bi bi-pencil" /></button>
                <button className="btn btn-dark border border-secondary rounded p-2 px-3 shadow-none"><i className="bi bi-trash" /></button>
              </div>
            </div>

            <div className="border-start border-primary border-4 ps-4 mb-4" style={{ background: 'linear-gradient(to right, rgba(67, 97, 238, 0.05), transparent)' }}>
              <h6 className="fw-bold text-primary">Core Insight</h6>
              <p className="text-secondary m-0">The efficiency of sliding window isn't just about moving two pointers, it's about maintaining a valid state within the window that can be updated in O(1).</p>
            </div>

            <h6 className="fw-bold mt-4">Key Takeaways</h6>
            <ul className="text-secondary small d-flex flex-column gap-2 mt-2">
              <li>Always use a <code className="text-primary">while</code> loop to shrink the window when the condition is violated.</li>
              <li>The answer is often updated after the inner loop when the window is guaranteed to be valid.</li>
              <li>Frequency maps are the most reliable way to track characters/elements in a window.</li>
            </ul>

            <h6 className="fw-bold mt-4">Code Snippet Pattern</h6>
            <div className="p-4 rounded bg-dark border border-secondary font-monospace small position-relative mb-4">
              <div style={{ color: '#4361ee' }}>while</div> (right &lt; n) &#123;<br />
              &nbsp;&nbsp;char c = s[right];<br />
              &nbsp;&nbsp;window[c]++;<br />
              &nbsp;&nbsp;<div style={{ color: '#4361ee' }}>if</div> (window[c] &gt; limit) &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;char d = s[left];<br />
              &nbsp;&nbsp;&nbsp;&nbsp;window[d]--;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;left++;<br />
              &nbsp;&nbsp;&#125;<br />
              &nbsp;&nbsp;res = Math.max(res, right - left + 1);<br />
              &nbsp;&nbsp;right++;<br />
              &#125;
            </div>

            <h6 className="fw-bold mt-2">Feeling & Confidence</h6>
            <div className="d-flex align-items-center gap-2 mt-2">
              <div className="d-flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map(i => <i key={i} className={`bi bi-star${i <= 4 ? '-fill' : ''}`} />)}
              </div>
              <span className="small text-secondary">Feeling strong on the logic, need to practice more edge cases.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
