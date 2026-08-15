import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdminAPI } from '../services/api';
import { ShieldCheck, Lock, User, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        navigate('/admin');
      } else {
        setError(res?.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#0D1410] blueprint-grid min-h-screen text-[#EFEAE1] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#16231C] border border-[#B08D57]/30 p-8 rounded-3xl space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#B08D57]/10 text-[#B08D57] mb-2 border border-[#B08D57]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif-fraunces font-extrabold text-2xl text-[#EFEAE1]">
            Admin Authentication
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Sign in with administrative credentials to access CRM portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-gray-300 block mb-1.5 font-medium">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-[#0D1410] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#B08D57] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-1.5 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0D1410] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#B08D57] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B08D57] hover:bg-[#c29d63] disabled:opacity-50 text-[#0D1410] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 font-sans"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
