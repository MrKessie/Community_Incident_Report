import React from 'react';
import { ShieldAlert, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatCard from '../common/StatCard';

export default function OverviewCards({ stats = {} }) {
  const cards = [
    { label: 'Total Incidents', value: stats.total_incidents ?? 0, sub: 'All recorded reports', icon: ShieldAlert, color: 'blue' },
    { label: 'Pending Review', value: stats.pending_review ?? 0, sub: 'Awaiting triage', icon: Clock, color: 'amber' },
    { label: 'Active Dispatches', value: stats.active_dispatches ?? 0, sub: 'In progress', icon: AlertTriangle, color: 'purple' },
    { label: 'Resolved Total', value: stats.resolved_total ?? 0, sub: 'Closed cases', icon: CheckCircle2, color: 'emerald' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <StatCard
          key={i}
          value={c.value}
          label={c.label}
          sub={c.sub}
          icon={c.icon}
          color={c.color}
        />
      ))}
    </div>
  );
}
