import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? 'http://localhost:8080/api/auth/signin' : 'http://localhost:8080/api/auth/signup';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;
        
      const response = await axios.post(url, payload);
      
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-darkBg text-white px-4">
      <div className="w-full max-w-md bg-darkCard p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          {isLogin ? 'Welcome Back' : 'Join Strivio'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-gray-800 rounded outline-none focus:ring-2 focus:ring-primary"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 bg-gray-800 rounded outline-none focus:ring-2 focus:ring-primary"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 bg-gray-800 rounded outline-none focus:ring-2 focus:ring-primary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-black font-semibold rounded hover:bg-opacity-90 transition">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button onClick={handleToggle} className="ml-2 text-secondary hover:underline">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
