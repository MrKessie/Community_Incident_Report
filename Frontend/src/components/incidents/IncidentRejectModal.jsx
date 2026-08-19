import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IncidentRejectModal({ isOpen, onClose, onReject }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim().length < 20) {
      toast.error('Rejection reason must be at least 20 characters.');
      return;
    }
    onReject(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Reject Incident Report</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Rejection Reason * (Min 20 characters)
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the clear justification for rejecting this report (e.g. Duplicate test submission or unverified location)..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              required
            ></textarea>
            <p className="text-[10px] text-slate-500 mt-1">Characters: {reason.length} / 20</p>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
