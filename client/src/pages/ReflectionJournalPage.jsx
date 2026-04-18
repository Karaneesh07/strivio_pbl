import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';

const TOPICS = ['Arrays','Strings','Linked Lists','Trees','Graphs','Dynamic Programming','Stack & Queue','Math','Sorting','Greedy','Backtracking','General'];
const CONFIDENCE_LABELS = ['','Struggling','Shaky','Neutral','Confident','Mastered'];

// ── Entry Modal ───────────────────────────────────────────────────
function EntryModal({ entry, onClose, onSaved }) {
  const isEdit = !!entry;
  const [form, setForm] = useState({
    title: entry?.title || '',
    topic: entry?.topic || 'General',
    content: entry?.content || '',
    insight: entry?.insight || '',
    confidence: entry?.confidence ?? 3,
  });
  const [saving, setSaving] = useState(false);
  const textRef = useRef(null);

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        // no edit endpoint exists — just update local for now
      } else {
        await api.post('/reflections', form);
      }
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" style={{ maxWidth: 680, width: '95vw' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0 fw-bold">{isEdit ? 'View Entry' : '✍️ New Reflection'}</h5>
          <button className="btn-icon" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>

        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label-dark">Title</label>
            <input className="input-dark" placeholder="What did you work on today?"
              value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} disabled={isEdit} />
          </div>
          <div className="col-md-4">
            <label className="form-label-dark">Topic</label>
            <select className="input-dark" value={form.topic} onChange={e => setForm(f=>({...f,topic:e.target.value}))} disabled={isEdit}>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label-dark">
              What did you learn?
              <span style={{color:'#64748b',fontWeight:400,marginLeft:8}}>{form.content.length} chars</span>
            </label>
            <textarea ref={textRef} className="input-dark" rows={5} placeholder="Describe your thought process, mistakes, and breakthroughs…"
              value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} disabled={isEdit}
              style={{resize:'vertical',lineHeight:1.7}} />
          </div>
          <div className="col-12">
            <label className="form-label-dark">Key Insight <span style={{color:'#64748b',fontWeight:400}}>(optional)</span></label>
            <input className="input-dark" placeholder="One-line takeaway to remember…"
              value={form.insight} onChange={e => setForm(f=>({...f,insight:e.target.value}))} disabled={isEdit} />
          </div>
          <div className="col-12">
            <label className="form-label-dark">Confidence — <span style={{color:'#4361ee'}}>{CONFIDENCE_LABELS[form.confidence]}</span></label>
            <div className="d-flex gap-2 mt-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => !isEdit && setForm(f=>({...f,confidence:n}))}
                  style={{ background:'none', border:'none', cursor: isEdit ? 'default' : 'pointer',
                    color: n <= form.confidence ? '#f59e0b' : '#1e2340', fontSize: '1.5rem', padding:0, transition:'color 0.15s' }}>
                  <i className={`bi bi-star${n <= form.confidence ? '-fill' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {!isEdit && (
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{borderTop:'1px solid #1e2340'}}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary-custom" onClick={handleSave} disabled={saving || !form.title || !form.content}>
              {saving ? <span className="spinner-border spinner-border-sm" /> : 'Save Reflection'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function ReflectionJournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);  // for view modal
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');

  const fetchEntries = () => {
    setLoading(true);
    api.get('/reflections')
      .then(({ data }) => setEntries(data.reflections))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reflection?')) return;
    await api.delete(`/reflections/${id}`);
    setSelected(null);
    fetchEntries();
  };

  const filtered = entries.filter(e =>
    (e.title + e.content + e.topic).toLowerCase().includes(search.toLowerCase())
  );

  const topicColor = (t) => {
    const map = { Arrays:'#4361ee', Strings:'#22c55e', Trees:'#f59e0b', Graphs:'#ef4444',
      'Dynamic Programming':'#7b2ff7', 'Stack & Queue':'#06b6d4', Math:'#ec4899' };
    return map[t] || '#64748b';
  };

  return (
    <div className="container-fluid">
      {showNew && <EntryModal onClose={() => setShowNew(false)} onSaved={() => { setShowNew(false); fetchEntries(); }} />}
      {selected && <EntryModal entry={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); fetchEntries(); }} />}

      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h1 style={{ fontWeight: 800 }}>Reflection Journal</h1>
          <p style={{ color: '#64748b', marginBottom: 0 }}>Track your cognitive patterns and DSA breakthroughs.</p>
        </div>
        <button className="btn-primary-custom d-flex align-items-center gap-2" onClick={() => setShowNew(true)}>
          <i className="bi bi-plus-lg" /> New Entry
        </button>
      </div>

      {/* Search */}
      <div className="position-relative mb-4 mt-3" style={{ maxWidth: 420 }}>
        <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: '#64748b', pointerEvents: 'none' }} />
        <input className="input-dark ps-5" placeholder="Search entries…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-glass text-center py-5" style={{ color: '#64748b' }}>
          <i className="bi bi-journal-text mb-3 d-block" style={{ fontSize: '3rem' }} />
          <p className="mb-3">{entries.length === 0 ? 'Your journal is empty. Reflect on your first solve!' : 'No entries match your search.'}</p>
          {entries.length === 0 && <button className="btn-primary-custom" onClick={() => setShowNew(true)}>Write First Entry →</button>}
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(e => (
            <div key={e.id} className="col-md-6 col-lg-4">
              <div className="card-glass h-100 d-flex flex-column" style={{ cursor: 'pointer', borderLeft: `3px solid ${topicColor(e.topic)}` }}
                onClick={() => setSelected(e)}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span style={{ fontSize: '.7rem', color: topicColor(e.topic), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {e.topic}
                  </span>
                  <small style={{ color: '#64748b' }}>{new Date(e.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</small>
                </div>
                <h6 className="fw-bold mb-2">{e.title}</h6>
                <p className="flex-grow-1" style={{ color: '#94a3b8', fontSize: '.85rem', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {e.content}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '1px solid #1e2340' }}>
                  <div className="d-flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <i key={n} className={`bi bi-star${n <= (e.confidence||0) ? '-fill' : ''}`}
                        style={{ color: n <= (e.confidence||0) ? '#f59e0b' : '#1e2340', fontSize: '.75rem' }} />
                    ))}
                  </div>
                  <button className="btn-icon-sm" onClick={ev => { ev.stopPropagation(); handleDelete(e.id); }}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
