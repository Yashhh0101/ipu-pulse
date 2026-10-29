import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { DEMO_USERS } from '../services/store';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginAs = (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword('demo-password');
    login(user.email, 'demo-password').then(() => {
      if (user.role === 'society_admin') navigate('/admin/society');
      else if (user.role === 'platform_admin') navigate('/admin/platform');
      else navigate('/profile');
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-xl">
              IPU <span className="text-indigo-600">Pulse</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Sign in to your account</h1>
          <p className="text-xs text-slate-500">
            Access your registrations, followed societies, and event reminders
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick 1-Click Demo Profiles:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => quickLoginAs(DEMO_USERS[0])}
              className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-slate-900">Student</p>
              <p className="text-[10px] text-slate-500">Yash (ADGITM)</p>
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs(DEMO_USERS[1])}
              className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-indigo-700">Society Admin</p>
              <p className="text-[10px] text-slate-500">Aarav (IEEE)</p>
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs(DEMO_USERS[2])}
              className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-slate-900">Platform Admin</p>
              <p className="text-[10px] text-slate-500">Moderator</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.ac.in"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
