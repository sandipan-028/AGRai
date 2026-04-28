import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { Mail, Lock, LogIn, Sprout } from 'lucide-react';
import { toast } from 'react-hot-toast';

import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      toast.success('Successfully logged in!');
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Luminous Background Orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="absolute top-10 left-10 flex items-center gap-4 z-10">
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Sprout className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Agri<span className="text-luminous">AI</span></h1>
      </div>

      <GlassCard className="w-full max-w-md p-10 z-10" delay={0.2}>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
          <p className="text-gray-400 font-medium">Enter your credentials to access your farm dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.08] transition-all duration-300"
                placeholder="sandipan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.08] transition-all duration-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="text-right">
              <button type="button" className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors">Forgot Password?</button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-luminous w-full flex items-center justify-center gap-3 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <LogIn size={22} /> {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-luminous font-bold hover:underline ml-1 transition-all">
              Create Free Account
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};


export default Login;
