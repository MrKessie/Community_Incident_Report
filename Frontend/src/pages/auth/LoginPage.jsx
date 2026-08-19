import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/auth';
import AuthLayout from '../../layouts/AuthLayout';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        const userRole = res.data.user.role || 'admin';
        if (userRole === 'admin' || userRole === 'super_admin') navigate('/admin');
        else if (userRole === 'response_team') navigate('/team');
        else navigate('/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message;
      if (errMsg && err.response?.status !== 422) {
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In to CIRS Portal" subtitle="Access your role dashboard and community safety dispatch controls">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="admin@community.com"
              {...register('email')}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {errors.email && <p className="text-rose-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
            <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-rose-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700" defaultChecked />
            <span>Remember this device</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand hover:bg-brand-soft text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
          Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Register Now</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
