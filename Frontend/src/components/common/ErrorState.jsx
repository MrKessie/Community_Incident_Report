import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

export default function ErrorState({ title = 'Failed to load data', message = 'An error occurred while communicating with the server.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-center">
      <AlertCircle className="w-8 h-8 text-rose-600 mb-3" />
      <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">{title}</h3>
      <p className="text-xs text-rose-700 dark:text-rose-400 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
}
