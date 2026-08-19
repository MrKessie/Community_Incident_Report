import React from 'react';
import { SEVERITY_COLORS } from '../../utils/colors';

export default function SeverityBadge({ severity }) {
  const badgeClass = SEVERITY_COLORS[severity] || 'bg-slate-100 text-slate-800';
  const isCritical = severity === 'critical';

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeClass}`}>
      {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>}
      <span>{severity || 'LOW'}</span>
    </span>
  );
}
