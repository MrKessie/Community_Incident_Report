import React, { useState } from 'react';
import CustomReactSelect from '../common/CustomReactSelect';

const severityOptions = [
  { value: 'low', label: 'Low - Minor nuisance / local issue' },
  { value: 'medium', label: 'Medium - Standard community concern' },
  { value: 'high', label: 'High - Serious threat requiring urgent team' },
  { value: 'critical', label: 'Critical - Life safety emergency / disaster' },
];
import { useIncidentStore } from '../../store/useIncidentStore';
import { ShieldCheck, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyIncidentModal({ incident, onClose }) {
  const { verifyIncident } = useIncidentStore();
  const [action, setAction] = useState('verify');
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState(incident?.severity || 'medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!incident) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await verifyIncident(incident.id, action, reason, severity);
      toast.success(`Incident ${action === 'verify' ? 'Verified' : 'Rejected'} successfully`);
      onClose();
    } catch (err) {
      toast.error('Failed to update verification status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Review & Verify Incident</h3>
              <p className="text-xs text-slate-400 font-mono">{incident.reference_number}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Verification Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAction('verify')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  action === 'verify'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/40'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Verify Report
              </button>

              <button
                type="button"
                onClick={() => setAction('reject')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  action === 'reject'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-950/40'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Reject Report
              </button>
            </div>
          </div>

          {action === 'verify' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Adjust Severity Level
              </label>
              <CustomReactSelect
                options={severityOptions}
                value={severity}
                onChange={setSeverity}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Verification Notes / Rejection Reason
            </label>
            <textarea
              rows={3}
              required={action === 'reject'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={action === 'verify' ? 'Optional verification details or dispatch notes...' : 'Reason why report is rejected...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-all ${
                action === 'verify' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
              }`}
            >
              {isSubmitting ? 'Saving...' : action === 'verify' ? 'Confirm Verification' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
