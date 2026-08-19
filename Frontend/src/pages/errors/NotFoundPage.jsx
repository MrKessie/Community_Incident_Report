import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black">404 - Page Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The incident page or dispatch resource you requested does not exist or has been moved.
      </p>
      <Link to="/" className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg">
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
