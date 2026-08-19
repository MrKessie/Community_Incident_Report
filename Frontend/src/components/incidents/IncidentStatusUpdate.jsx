import React, { useState } from 'react';
import { INCIDENT_STATUSES } from '../../utils/constants';
import CustomReactSelect from '../common/CustomReactSelect';

export default function IncidentStatusUpdate({ currentStatus, onUpdateStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');

  const statusOptions = INCIDENT_STATUSES.map((st) => ({
    value: st.id,
    label: st.label,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(status, reason);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Update Incident Status
        </label>
        <CustomReactSelect
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Status Change Reason / Action Log
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain the reason for updating status..."
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-brand hover:bg-brand-soft text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition"
      >
        Update Status
      </button>
    </form>
  );
}
