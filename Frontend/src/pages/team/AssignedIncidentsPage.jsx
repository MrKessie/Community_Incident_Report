import React, { useState } from 'react';
import { ShieldAlert, FileText } from 'lucide-react';
import TeamLayout from '../../layouts/TeamLayout';
import PageHeader from '../../components/common/PageHeader';
import IncidentFilters from '../../components/incidents/IncidentFilters';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import ActionMenu from '../../components/common/ActionMenu';
import DataTable from '../../components/common/DataTable';
import { useIncidents } from '../../hooks/useIncidents';
import { formatDate } from '../../utils/formatters';

export default function AssignedIncidentsPage() {
  const { incidents } = useIncidents(true);
  const [filters, setFilters] = useState({ search: '', status: '', severity: '' });

  const assigned = incidents.filter((i) => ['assigned', 'in_progress', 'resolved'].includes(i.status));

  const filtered = assigned.filter((inc) => {
    if (filters.status && inc.status !== filters.status) return false;
    if (filters.severity && inc.severity !== filters.severity) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return inc.title?.toLowerCase().includes(q) || inc.reference_number?.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      key: 'reference_number',
      header: 'Reference #',
      render: (inc) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{inc.reference_number}</span>,
    },
    {
      key: 'title',
      header: 'Title',
      render: (inc) => <span className="font-bold text-slate-900 dark:text-white max-w-xs truncate block">{inc.title}</span>,
    },
    {
      key: 'address',
      header: 'Location',
      render: (inc) => <span className="text-slate-500 dark:text-slate-400 max-w-xs truncate block">{inc.address}</span>,
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (inc) => <SeverityBadge severity={inc.severity} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (inc) => <StatusBadge status={inc.status} />,
    },
    {
      key: 'created_at',
      header: 'Dispatched Date',
      render: (inc) => <span className="font-mono text-slate-500 dark:text-slate-400">{formatDate(inc.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (inc) => (
        <ActionMenu
          items={[
            {
              label: 'Field Response',
              icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />,
              to: `/team/incidents/${inc.id}`,
            },
            {
              label: 'View Incident Details',
              icon: <FileText className="w-3.5 h-3.5 text-slate-400" />,
              to: `/incidents/${inc.id}`,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <TeamLayout>
      <div className="space-y-6">
        <PageHeader
          title="Assigned Emergency Dispatches"
          description="Filter and inspect active emergency assignments dispatched to your response crew"
        />

        <IncidentFilters filters={filters} onFilterChange={(f) => setFilters({ ...filters, ...f })} />

        <DataTable
          title="Assigned Emergency Dispatches"
          description="Emergency tasks dispatched to your response unit"
          columns={columns}
          data={filtered}
          emptyMessage="No assigned dispatches found"
          pageSize={10}
        />
      </div>
    </TeamLayout>
  );
}
