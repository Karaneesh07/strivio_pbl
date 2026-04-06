import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Flame, Trophy, Code2, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/users/me/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/problems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProblems(response.rows || response.data);
      } catch (error) {
        console.error('Failed to fetch problems');
      }
    };

    fetchStats();
    fetchProblems();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!stats) return <div className="flex justify-center items-center h-screen bg-darkBg text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-darkBg text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome, {stats.username}!
        </h1>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-error hover:text-red-400 transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-darkCard p-6 rounded-xl border border-gray-800 flex items-center space-x-4 shadow-lg hover:border-primary transition">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <Flame size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Streak</p>
            <h2 className="text-3xl font-bold">{stats.currentStreak} Days</h2>
          </div>
        </div>
        
        <div className="bg-darkCard p-6 rounded-xl border border-gray-800 flex items-center space-x-4 shadow-lg hover:border-secondary transition">
          <div className="p-3 bg-secondary/10 rounded-full text-secondary">
            <Trophy size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Longest Streak</p>
            <h2 className="text-3xl font-bold">{stats.longestStreak} Days</h2>
          </div>
        </div>

        <div className="bg-darkCard p-6 rounded-xl border border-gray-800 flex items-center space-x-4 shadow-lg hover:border-primary transition">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Code2 size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Solved / Accuracy</p>
            <h2 className="text-3xl font-bold">{stats.totalProblemsSolved} / {stats.accuracyRate}%</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link to="/problem/daily" className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-xl border border-primary/30 hover:border-primary transition group block">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition">Daily Problem</h3>
          <p className="text-gray-400">Solve today's challenge to maintain your streak.</p>
        </Link>
        
        <Link to="/focus" className="bg-gradient-to-br from-secondary/20 to-secondary/5 p-8 rounded-xl border border-secondary/30 hover:border-secondary transition group block">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary transition">Focus Mode</h3>
          <p className="text-gray-400">Start a distraction-free coding session.</p>
        </Link>
      </div>

      <div className="bg-darkCard rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Recommended Problems</h3>
          <span className="text-sm text-gray-400">{problems.length} problems available</span>
        </div>
        <div className="divide-y divide-gray-800">
          {problems.map((prob) => (
            <Link 
              key={prob.id} 
              to={`/problem/${prob.id}`} 
              className="flex items-center justify-between p-6 hover:bg-gray-800/50 transition group">
              <div className="flex flex-col">
                <span className="font-semibold text-lg group-hover:text-primary transition">{prob.title}</span>
                <span className="text-sm text-gray-500 line-clamp-1 max-w-md">{prob.description}</span>
              </div>
              <div className="flex items-center space-x-6">
                <span className={`text-xs font-bold px-2 py-1 rounded 
                  ${prob.difficulty === 'EASY' ? 'text-success bg-success/10' : 
                    prob.difficulty === 'MEDIUM' ? 'text-yellow-500 bg-yellow-500/10' : 'text-error bg-error/10'}`}>
                  {prob.difficulty}
                </span>
                <div className="p-2 rounded bg-gray-800 group-hover:bg-primary group-hover:text-black transition">
                  <Code2 size={16} />
                </div>
              </div>
            </Link>
          ))}
          {problems.length === 0 && (
            <div className="p-10 text-center text-gray-500">No problems found. Start by seeding the database!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
