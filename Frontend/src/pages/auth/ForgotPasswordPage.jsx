import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      toast.success('Password reset link sent to your email.');
    }
  };

  return (
    <AuthLayout title="Reset Your Password" subtitle="Enter your email address to receive password recovery instructions">
      {submitted ? (
        <div className="text-center space-y-4 text-xs">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
          <p className="text-slate-400 leading-relaxed">
            We have sent password recovery instructions to <strong className="text-white">{email}</strong>.
          </p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-brand hover:bg-brand-soft text-white font-bold rounded-xl">
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@community.com"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-brand hover:bg-brand-soft text-white font-extrabold text-sm rounded-xl shadow-lg transition">
            Send Reset Instructions
          </button>
          <p className="text-center text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
            Remember password? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
