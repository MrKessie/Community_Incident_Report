import React from 'react';
import { STATUS_COLORS } from '../../utils/colors';

export default function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-500 text-white';
  const label = status ? status.replace('_', ' ').toUpperCase() : 'UNKNOWN';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {label}
    </span>
  );
}
