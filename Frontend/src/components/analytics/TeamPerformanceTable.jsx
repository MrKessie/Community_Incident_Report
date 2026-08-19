import React from 'react';
import DataTable from '../common/DataTable';

export default function TeamPerformanceTable({ teams = [] }) {
  const columns = [
    {
      key: 'name',
      header: 'Team Name',
      render: (t) => <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (t) => <span className="text-slate-500 capitalize">{t.type}</span>,
    },
    {
      key: 'assigned',
      header: 'Assigned',
      render: (t) => t.assigned ?? t.total_assignments ?? 0,
    },
    {
      key: 'resolved',
      header: 'Resolved',
      render: (t) => <span className="text-emerald-600 font-bold">{t.resolved ?? 0}</span>,
    },
    {
      key: 'rate',
      header: 'Resolution Rate',
      render: (t) => <span className="font-bold text-blue-600">{t.rate ?? '0%'}</span>,
    },
    {
      key: 'avgTime',
      header: 'Avg Response Time',
      render: (t) => <span className="font-mono">{t.avgTime ?? 'N/A'}</span>,
    },
  ];

  return (
    <DataTable
      title="Response Unit Performance Metrics"
      description="Operational dispatch efficiency, resolution rates, and average response times"
      columns={columns}
      data={teams}
      emptyMessage="No performance metrics available"
      pageSize={5}
    />
  );
}
