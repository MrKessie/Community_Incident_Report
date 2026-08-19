import React, { useState } from 'react';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomReactSelect from '../common/CustomReactSelect';

export default function MarkDuplicateModal({ incident, onClose }) {
  const { incidents, markDuplicate } = useIncidentStore();
  const [targetId, setTargetId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!incident) return null;

  const candidateIncidents = incidents.filter(i => i.id !== incident.id && !i.is_duplicate);

  const targetOptions = [
    { value: '', label: '-- Select Master Incident --' },
    ...candidateIncidents.map((c) => ({
      value: String(c.id),
      label: `${c.reference_number} - ${c.title} (${c.status})`,
    })),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetId) return toast.error('Please select original incident');
    setIsSubmitting(true);
    try {
      await markDuplicate(incident.id, parseInt(targetId));
      toast.success('Incident marked as duplicate and closed');
      onClose();
    } catch (err) {
      toast.error('Failed to mark duplicate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Flag Duplicate Report</h3>
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
              Select Original Master Incident
            </label>
            <CustomReactSelect
              options={targetOptions}
              value={targetId}
              onChange={setTargetId}
              isSearchable={true}
              placeholder="-- Select Master Incident --"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-300">
            <strong>Note:</strong> Flagging this incident as a duplicate will close this ticket and link it directly to the primary master incident record.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-950/40"
            >
              {isSubmitting ? 'Linking...' : 'Confirm Duplicate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
