import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Focus, ArrowLeft, StopCircle } from 'lucide-react';

const FocusModePage = () => {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      // Prevent leaving easily
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else if (isActive && timeLeft === 0) {
      endSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/api/focus-sessions/start', 
        { durationMinutes: duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(res.data.id);
      setTimeLeft(duration * 60);
      setIsActive(true);
      document.documentElement.requestFullscreen().catch(() => {});
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      alert('Failed to start session');
    }
  };

  const endSession = async () => {
    setIsActive(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/focus-sessions/${sessionId}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Focus session completed!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isActive) {
    return (
      <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle breathing animation background */}
        <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-full blur-[150px] scale-150 pointer-events-none"></div>
        
        <div className="z-10 flex flex-col items-center">
          <Focus size={48} className="text-secondary mb-8 opacity-80" />
          <h1 className="text-8xl font-mono font-light tracking-widest text-[#e0e0e0] mb-12">
            {formatTime(timeLeft)}
          </h1>
          <button 
            onClick={endSession}
            className="flex items-center space-x-2 text-gray-500 hover:text-white transition opacity-50 hover:opacity-100"
          >
            <StopCircle size={24} />
            <span>End Context Early</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col items-center justify-center p-4">
      <button onClick={() => navigate('/dashboard')} className="absolute top-8 left-8 flex items-center space-x-2 text-gray-400 hover:text-primary transition">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-md w-full bg-darkCard p-10 rounded-2xl shadow-2xl border border-gray-800 text-center">
        <Focus size={48} className="mx-auto text-primary mb-6" />
        <h2 className="text-3xl font-bold mb-2">Focus Mode</h2>
        <p className="text-gray-400 mb-8">Eliminate distractions. Build discipline.</p>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-4">Duration (Minutes)</label>
          <div className="flex justify-center items-center space-x-4">
            {[15, 25, 45, 60].map(min => (
              <button 
                key={min}
                onClick={() => setDuration(min)}
                className={`w-12 h-12 rounded-full font-bold transition flex items-center justify-center
                  ${duration === min ? 'bg-primary text-black scale-110 shadow-[0_0_15px_rgba(187,134,252,0.4)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {min}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={startSession}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(3,218,198,0.4)] transition"
        >
          Enter Focus Flow
        </button>
      </div>
    </div>
  );
};

export default FocusModePage;
