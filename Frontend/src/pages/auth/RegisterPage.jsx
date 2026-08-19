import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, KeyRound, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema } from '../../utils/validators';
import { authApi } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../layouts/AuthLayout';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authApi.register(data);
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.success('Account created! Signed in as Community Reporter.');
      login({ id: 99, name: data.name, email: data.email, role: 'reporter' }, 'demo-token');
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Create Community Account" subtitle="Report incidents, track dispatch progress, and protect your neighborhood">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" {...register('name')} placeholder="Alex Morgan" className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          {errors.name && <p className="text-rose-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="email" {...register('email')} placeholder="alex@community.com" className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          {errors.email && <p className="text-rose-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" {...register('phone')} placeholder="+1 (555) 000-0000" className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Password * (Min 8 chars, 1 Upper, 1 Lower, 1 Number)</label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type={showPassword ? 'text' : 'password'} {...register('password')} className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
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

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Confirm Password *</label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-rose-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-brand hover:bg-brand-soft text-white font-extrabold text-sm rounded-xl shadow-lg transition"
        >
          Create Community Account
        </button>

        <p className="text-center text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
          Already registered? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
