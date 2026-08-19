import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
      <Calendar className="w-4 h-4 text-slate-400" />
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onStartChange(e.target.value)}
        className="bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
      />
      <span className="text-xs text-slate-400">to</span>
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onEndChange(e.target.value)}
        className="bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
      />
    </div>
  );
}
