import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import CustomReactSelect from '../common/CustomReactSelect';

export default function IncidentAssignModal({ isOpen, onClose, onAssign, teams = [] }) {
  const [teamId, setTeamId] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const teamOptions = [
    { value: '', label: '-- Choose Team --' },
    ...teams.map((t) => ({ value: String(t.id), label: `${t.name} (${t.type})` })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamId) {
      onAssign(teamId, notes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Emergency Response Team</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Response Unit *
            </label>
            <CustomReactSelect
              options={teamOptions}
              value={teamId}
              onChange={setTeamId}
              placeholder="-- Choose Team --"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Dispatch Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions for team commander..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            ></textarea>
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
              className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
