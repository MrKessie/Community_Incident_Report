import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isDangerous ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-md transition ${
              isDangerous ? 'bg-rose-600 hover:bg-rose-500' : 'bg-brand hover:bg-brand-soft'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
