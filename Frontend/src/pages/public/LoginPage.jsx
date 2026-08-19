import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldAlert, KeyRound, Mail, ArrowRight, UserCheck, ShieldCheck, Radio, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, switchDemoRole } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user.name}!`);
      const role = res.user.role || res.user.roles?.[0] || 'reporter';
      if (role === 'admin' || role === 'super_admin') navigate('/admin');
      else if (role === 'response_team') navigate('/response');
      else navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = (roleKey) => {
    switchDemoRole(roleKey);
    toast.success(`Switched to demo mode: ${roleKey.replace('_', ' ').toUpperCase()}`);
    if (roleKey === 'super_admin' || roleKey === 'admin') navigate('/admin');
    else if (roleKey === 'response_team') navigate('/response');
    else navigate('/dashboard');
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-md mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 mb-2">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to CIRS</h1>
          <p className="text-xs text-slate-400">Enter your credentials to access role-specific dashboard</p>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cir.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Buttons Divider */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <p className="text-[11px] font-semibold text-center text-slate-500 uppercase tracking-wider">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-300 border border-slate-700 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin View</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('response_team')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-slate-700 flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Response Unit</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('reporter')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-300 border border-slate-700 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Citizen View</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('super_admin')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-purple-300 border border-slate-700 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-rose-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </Layout>
  );
}
