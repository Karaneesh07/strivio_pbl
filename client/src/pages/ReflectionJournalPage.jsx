import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ReflectionJournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    setLoading(true);
    api.get('/reflections').then(({ data }) => {
        setEntries(data.reflections);
        if (data.reflections.length > 0) setSelected(data.reflections[0]);
    }).finally(() => setLoading(false));
  };

  const handleCreate = () => {
      const title = prompt("Entry Title:");
      const content = prompt("What did you learn today?");
      if (!title || !content) return;
      api.post('/reflections', { title, content, topic: 'General', confidence: 4 })
         .then(() => fetchEntries());
  };

  const handleDelete = (id) => {
      if (window.confirm("Delete this entry?")) {
          api.delete(`/reflections/${id}`).then(() => fetchEntries());
      }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h1 style={{ fontWeight: 800 }}>Reflection Journal</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
          <i className="bi bi-plus" /> New Entry
        </button>
      </div>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Track your cognitive patterns and DSA breakthroughs.</p>

      {loading ? (
          <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>
      ) : entries.length === 0 ? (
          <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
              <i className="bi bi-journal-text mb-2" style={{ fontSize: '2.5rem' }} />
              <p>Your journal is empty. Reflect on your first solve!</p>
          </div>
      ) : (
        <div className="row g-4">
            <div className="col-md-4">
                <div className="d-flex flex-column gap-3">
                    {entries.map(e => (
                    <div key={e.id} 
                        className={`card-glass p-3 border-opacity-10 ${selected?.id === e.id ? 'border-primary' : ''}`} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelected(e)}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                        <small className="text-secondary">{new Date(e.created_at).toLocaleDateString()}</small>
                        <span className="badge" style={{ fontSize: '.6rem', background: '#13162a', color: '#4361ee', border: `1px solid #4361ee33` }}>{e.topic}</span>
                        </div>
                        <h6 className="fw-bold m-0">{e.title}</h6>
                    </div>
                    ))}
                </div>
            </div>

            <div className="col-md-8">
            {selected && (
                <div className="card-glass p-5 h-100 border-opacity-10">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <small className="text-primary fw-bold text-uppercase" style={{ fontSize: '.7rem' }}>{new Date(selected.created_at).toDateString()}</small>
                            <h2 className="fw-bold mt-1">{selected.title}</h2>
                            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ fontSize: '.7rem' }}>{selected.topic}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-dark border border-secondary rounded p-2 px-3 shadow-none" onClick={() => handleDelete(selected.id)}><i className="bi bi-trash" /></button>
                        </div>
                    </div>

                    <div className="border-start border-primary border-4 ps-4 mb-4" style={{ background: 'linear-gradient(to right, rgba(67, 97, 238, 0.05), transparent)' }}>
                        <h6 className="fw-bold text-primary">Content</h6>
                        <p className="text-secondary m-0">{selected.content}</p>
                    </div>

                    {selected.insight && (
                        <>
                            <h6 className="fw-bold mt-4">Key Insight</h6>
                            <p className="text-secondary small">{selected.insight}</p>
                        </>
                    )}

                    <h6 className="fw-bold mt-4">Confidence Level</h6>
                    <div className="d-flex align-items-center gap-2 mt-2">
                    <div className="d-flex gap-1 text-primary">
                        {[1, 2, 3, 4, 5].map(i => <i key={i} className={`bi bi-star${i <= (selected.confidence || 0) ? '-fill' : ''}`} />)}
                    </div>
                    </div>
                </div>
            )}
            </div>
        </div>
      )}
    </div>
  );
}
