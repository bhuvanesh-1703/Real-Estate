import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdminAPI } from '../services/api';
import { ShieldCheck, Lock, User, LogIn, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { showToast, showAlert } from '../utils/swal';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdminAPI({ username, password });

      if (res && res.success && res.token) {
        localStorage.setItem('admin_token', res.token);
        showToast('Welcome back, Administrator!', 'success');
        navigate('/admin');
      } else {
        const errMsg = res?.message || 'Invalid admin username or password';
        setError(errMsg);
        showAlert({
          title: 'Authentication Failed',
          text: errMsg,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (err) {
      const connErr = 'Connection error. Please check backend server.';
      setError(connErr);
      showAlert({
        title: 'Connection Error',
        text: connErr,
        icon: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDemoFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] relative overflow-hidden flex items-center justify-center px-4 py-24 font-sans">
      
      {/* Sleek Dark Slate & Sapphire Ambient Background Mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-sky-500/20 to-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Platinum & Dark Slate Glassmorphism Card */}
      <div className="w-full max-w-md bg-[#1E293B]/80 backdrop-blur-2xl border border-slate-700/60 p-8 sm:p-10 rounded-3xl space-y-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-sky-400/20 text-sky-400 border border-sky-500/30 shadow-lg shadow-blue-950/50">
            <ShieldCheck className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-sky-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Aetheria Enterprise Hub
            </span>
            <h2 className="font-serif-fraunces font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-1">
              Admin Portal
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Enter administrator credentials to open CRM real-time engine
          </p>
        </div>

        {/* Quick Demo Fill Pill */}
        <div className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/50 p-3.5 rounded-2xl flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Default: <code className="text-sky-300 font-bold">admin / admin123</code></span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-3 py-1 rounded-xl transition-all"
          >
            Auto Fill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-2xl text-center font-medium animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          <div>
            <label className="text-slate-300 block mb-2 font-semibold tracking-wide">
              Username
            </label>
            <div className="relative group">
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-sky-400 transition-colors" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-2 font-semibold tracking-wide">
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-sky-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-2xl pl-11 pr-11 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 font-sans tracking-wide mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Command Hub
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 text-center border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono">
            Powered by Aetheria Real Estate SaaS Engine v2.4 • Sleek Dark Slate Edition
          </span>
        </div>

      </div>
    </div>
  );
}
