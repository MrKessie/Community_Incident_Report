import React, { useState } from 'react';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Radio, Upload, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomReactSelect from '../common/CustomReactSelect';

const statusOptions = [
  { value: 'in_progress', label: 'In Progress - Team on scene / Active response' },
  { value: 'resolved', label: 'Resolved - Danger mitigated / Incident resolved' },
  { value: 'closed', label: 'Closed - Verification complete' },
];

export default function UpdateStatusModal({ incident, onClose }) {
  const { updateIncidentStatus } = useIncidentStore();
  const [newStatus, setNewStatus] = useState(incident?.status === 'assigned' ? 'in_progress' : 'resolved');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!incident) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return toast.error('Please enter update message or action log');
    setIsSubmitting(true);
    try {
      await updateIncidentStatus(incident.id, newStatus, message);
      toast.success(`Incident status updated to ${newStatus.replace('_', ' ')}`);
      onClose();
    } catch (err) {
      toast.error('Failed to update incident status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Response Update</h3>
              <p className="text-xs text-slate-400 font-mono">{incident.reference_number} • {incident.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              New Incident Status
            </label>
            <CustomReactSelect
              options={statusOptions}
              value={newStatus}
              onChange={setNewStatus}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Action Log Message / Situation Report
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe actions taken by response team, current status on scene, or resolution summary..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting...' : 'Post Field Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
