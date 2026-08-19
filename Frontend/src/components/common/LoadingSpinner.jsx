import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <span className="text-xs font-semibold text-slate-500">{text}</span>
    </div>
  );
}
