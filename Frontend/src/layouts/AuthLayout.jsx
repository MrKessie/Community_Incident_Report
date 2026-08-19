import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <Link to="/" className="inline-flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center shadow-xl shadow-teal-500/30 group-hover:scale-105 transition-transform">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">CIRS Portal</span>
        </Link>
        {title && <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{subtitle}</p>}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-8 px-6 sm:px-10 shadow-xl dark:shadow-2xl rounded-3xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
