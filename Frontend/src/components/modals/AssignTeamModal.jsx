import React, { useState } from 'react';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Users, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignTeamModal({ incident, onClose }) {
  const { teams, assignTeam } = useIncidentStore();
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!incident) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeamId) return toast.error('Please select a response team');
    setIsSubmitting(true);
    try {
      await assignTeam(incident.id, parseInt(selectedTeamId), notes);
      toast.success('Response team assigned successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to assign response team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Assign Response Team</h3>
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
              Select Response Unit
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {teams.map((t) => (
                <label
                  key={t.id}
                  onClick={() => setSelectedTeamId(t.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    String(selectedTeamId) === String(t.id)
                      ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                    {t.type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Dispatch Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter special dispatch directives, location access details, or urgency instructions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950/40 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Dispatching...' : 'Dispatch Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
