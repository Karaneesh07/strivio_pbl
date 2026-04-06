import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Layout } from 'lucide-react';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = id && id !== 'daily' 
          ? `http://localhost:8080/api/problems/${id}` 
          : 'http://localhost:8080/api/problems/daily';
          
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProblem(res.data);
        const initialLang = 'java';
        setLanguage(initialLang);
        setCode(res.data[`starter_code_${initialLang}`] || '');
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchProblem();

    const timer = setInterval(() => {
      setTimeTaken(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/api/submissions', {
        problemId: problem.id,
        code,
        language: language,
        timeTakenSeconds: timeTaken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      setResult({ status: 'ERROR', message: 'Failed to submit code' });
    }
    setIsSubmitting(false);
  };

  if (!problem) return <div className="h-screen bg-darkBg text-white flex items-center justify-center">Loading...</div>;

  const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-screen flex flex-col bg-darkBg text-white">
      <header className="flex justify-between items-center p-4 bg-darkCard border-b border-gray-800">
        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 hover:text-primary transition">
          <ArrowLeft size={20} />
          <span>Dashboard</span>
        </button>
        <div className="flex font-mono text-gray-400">Time: {formatTime(timeTaken)}</div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex items-center space-x-2 bg-success text-black px-4 py-2 rounded font-semibold hover:bg-opacity-90 disabled:opacity-50 transition">
          <Play size={16} />
          <span>{isSubmitting ? 'Evaluating...' : 'Submit Code'}</span>
        </button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/3 p-6 border-r border-gray-800 overflow-y-auto bg-darkCard/50">
          <h1 className="text-2xl font-bold mb-2 text-primary">{problem.title}</h1>
          <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-6 
            ${problem.difficulty === 'EASY' ? 'bg-green-900 text-success' : 
              problem.difficulty === 'MEDIUM' ? 'bg-yellow-900 text-yellow-500' : 'bg-red-900 text-error'}`}>
            {problem.difficulty}
          </div>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
          <div className="flex bg-[#2d2d2d] border-b border-[#3d3d3d] px-4 py-1 text-sm text-gray-400 space-x-4 items-center">
            <div className="flex items-center space-x-2 mr-4">
              <Layout size={14} />
              <span className="font-semibold uppercase">{language}</span>
            </div>
            <div className="flex bg-black/30 rounded p-1">
              {['java', 'cpp'].map(lang => (
                <button 
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setCode(problem[`starter_code_${lang}`] || '');
                  }}
                  className={`px-3 py-1 rounded transition text-xs font-bold
                    ${language === lang ? 'bg-primary text-black' : 'hover:bg-gray-700'}`}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            className="flex-1 w-full bg-transparent text-gray-200 p-4 font-mono text-sm leading-relaxed outline-none resize-none"
            placeholder="Write your code here..."
          />
          {result && (
            <div className={`p-4 border-t border-gray-800 font-mono text-sm
              ${result.status === 'ACCEPTED' ? 'bg-green-900/20 text-success' : 
                result.status === 'REJECTED' ? 'bg-red-900/20 text-error' : 'bg-gray-900 text-gray-400'}`}>
              Status: <span className="font-bold">{result.status}</span>
              {result.timeTakenSeconds && ` | Evaluated in ${result.timeTakenSeconds}s`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
