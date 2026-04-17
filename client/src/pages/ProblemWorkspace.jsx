// src/pages/ProblemWorkspace.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import api from "../services/api";

export default function ProblemWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("# Write your Python code here\nprint(\"Hello Strivio!\")");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState("description"); // "description" | "submissions"

  useEffect(() => {
    console.log("[Workspace] Initializing with ID:", id);
    setLoading(true);
    api.get(`/problems/${id}`)
      .then((res) => {
        console.log("[Workspace] Problem data loaded:", res.data.problem);
        setProblem(res.data.problem);
        if (res.data.problem?.title?.toLowerCase().includes("python")) {
            setCode("# Write your Python code here\nprint(\"Hello World\")");
        }
      })
      .catch((err) => {
        console.error("[Workspace] Failed to load problem:", err);
        navigate("/problems");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const runCode = async () => {
    setOutput("Running test cases...");
    setIsRunning(true);
    try {
      // Using existing external compiler for immediate functionality
      const res = await axios.post("https://py-compiler.onrender.com/run-python", { code });
      setOutput(res.data.output || res.data.error || "No output");
    } catch (err) {
      setOutput("Execution Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
      setIsSubmitting(true);
      setOutput("Submitting code directly to Strivio Backend...");
      try {
          const res = await api.post("/code/submit", {
              problem_id: id,
              source_code: code,
              language_id: 71, // Python 3
              language_name: "python"
          });
          setOutput(`Status: ${res.data.status}\nPassed: ${res.data.passed}/${res.data.total}\nTime: ${res.data.execution_time}s\nMemory: ${res.data.memory}KB`);
      } catch (err) {
          setOutput("Submit Error: " + (err.response?.data?.message || "Backend Judge0 service is not configured."));
      } finally {
          setIsSubmitting(false);
      }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={{ background: '#0d0f1a' }}>
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
        <div style={{ color: '#64748b', fontWeight: 500 }}>Initializing Workspace...</div>
    </div>
  );

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 4rem)", background: "#0d0f1a", color: "#e2e8f0" }}>
      
      {/* Header */}
      <header className="d-flex align-items-center justify-content-between px-4 py-2" style={{ borderBottom: "1px solid #1e2340", background: '#13162a', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                style={{ width: 32, height: 32, border: '1px solid #1e2340' }}
                onClick={() => navigate("/problems")}>
            <i className="bi bi-chevron-left" />
          </button>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0" style={{ fontWeight: 700 }}>{problem?.title}</h5>
            <span className={`badge-${problem?.difficulty?.toLowerCase() || 'easy'}`}>{problem?.difficulty}</span>
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm px-3" onClick={runCode} disabled={isRunning}>
            {isRunning ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-play-fill me-1" />}
            Run 
          </button>
          <button className="btn btn-primary btn-sm px-4" style={{ background: '#4361ee', border: 'none', fontWeight: 600 }} 
                onClick={submitCode} disabled={isSubmitting}>
             {isSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-cloud-upload-fill me-1" />}
             Submit
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <div className="flex-grow-1 row g-0" style={{ minHeight: 0 }}>
        
        {/* Left Pane: Information */}
        <div className="col-md-5 d-flex flex-column" style={{ borderRight: "1px solid #1e2340", background: '#0d0f1a', height: '100%' }}>
          <div className="d-flex px-3" style={{ borderBottom: '1px solid #1e2340', flexShrink: 0 }}>
            <button className={`py-2 px-3 border-0 bg-transparent ${tab === 'description' ? 'border-primary' : ''}`}
                    style={{ color: tab === 'description' ? '#fff' : '#64748b', borderBottom: tab === 'description' ? '2px solid #4361ee' : 'none', fontSize: '.9rem', fontWeight: 600 }}
                    onClick={() => setTab('description')}>
                Description
            </button>
            <button className={`py-2 px-3 border-0 bg-transparent ${tab === 'submissions' ? 'border-primary' : ''}`}
                    style={{ color: tab === 'submissions' ? '#fff' : '#64748b', borderBottom: tab === 'submissions' ? '2px solid #4361ee' : 'none', fontSize: '.9rem', fontWeight: 600 }}
                    onClick={() => setTab('submissions')}>
                Solution
            </button>
          </div>
          
          <div className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
            {tab === 'description' ? (
                <>
                    <h5 style={{ fontWeight: 700, color: '#fff', marginBottom: '1.2rem' }}>Problem Description</h5>
                    <div style={{ color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-wrap", fontSize: '.95rem' }}>
                        {problem?.description || "No description provided."}
                    </div>
                    {problem?.tags && (
                        <div className="d-flex gap-2 mt-4 flex-wrap">
                            {(() => {
                                try {
                                    const tList = Array.isArray(problem.tags) ? problem.tags : JSON.parse(problem.tags || '[]');
                                    return tList.map(t => (
                                        <span key={t} style={{ background: '#13162a', border: '1px solid #1e2340', borderRadius: 4, padding: '2px 8px', fontSize: '.75rem', color: '#64748b' }}>{t}</span>
                                    ));
                                } catch(e) { return null; }
                            })()}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center mt-5" style={{ color: '#64748b' }}>
                    <i className="bi bi-lock-fill" style={{ fontSize: '2rem' }} />
                    <p className="mt-2 text-muted">Solve the problem to unlock official solution.</p>
                </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor & Console */}
        <div className="col-md-7 d-grid" style={{ background: "#13162a", gridTemplateRows: '1fr 180px', height: '100%' }}>
          
          {/* Editor Area */}
          <div className="d-flex flex-column" style={{ minHeight: 0 }}>
              <div className="px-3 py-1 d-flex justify-content-between align-items-center" style={{ background: '#0d0f1a', borderBottom: '1px solid #1e2340', flexShrink: 0 }}>
                  <span style={{ fontSize: '.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Python 3</span>
                  <button className="btn btn-link text-muted p-0 border-0" title="Reset Code" onClick={() => setCode("# Write your Python code here\nprint(\"Hello World\")")}>
                      <i className="bi bi-arrow-counterclockwise" />
                  </button>
              </div>
              <div className="flex-grow-1">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    options={{
                        fontSize: 14,
                        padding: { top: 15 },
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontFamily: "'Fira Code', 'Courier New', monospace",
                        smoothScrolling: true,
                    }}
                    onChange={(value) => setCode(value || "")}
                />
              </div>
          </div>

          {/* Console Area */}
          <div className="d-flex flex-column" style={{ background: "#0d0f1a", borderTop: "2px solid #1e2340", minHeight: 0 }}>
             <div className="px-3 py-1 d-flex align-items-center gap-2" style={{ background: '#13162a', borderBottom: '1px solid #1e2340', flexShrink: 0 }}>
                 <i className="bi bi-terminal" style={{ color: '#4361ee' }} />
                 <span style={{ fontSize: '.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Console Output</span>
             </div>
             <div className="p-3 flex-grow-1" style={{ overflowY: 'auto' }}>
                {output ? (
                    <pre style={{ margin: 0, color: output.includes("Error") ? "#ef4444" : "#22c55e", fontFamily: "monospace", fontSize: '.9rem' }}>
                        {output}
                    </pre>
                ) : (
                    <div className="text-muted small">No output yet. Click 'Run' to see results.</div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
