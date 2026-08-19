import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
      <span className="text-xs text-slate-500 font-medium">
        Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of{' '}
        <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
      </span>
      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
