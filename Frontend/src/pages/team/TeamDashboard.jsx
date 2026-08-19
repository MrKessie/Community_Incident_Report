import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import TeamLayout from '../../layouts/TeamLayout';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import ActionMenu from '../../components/common/ActionMenu';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';
import { formatDate } from '../../utils/formatters';

export default function TeamDashboard() {
  const { user } = useAuth();
  const { incidents } = useIncidents(true);

  // Filter assigned incidents for response crew
  const assigned = incidents.filter((i) => ['assigned', 'in_progress', 'resolved'].includes(i.status));
  const activeCount = assigned.filter((i) => ['assigned', 'in_progress'].includes(i.status)).length;
  const completedCount = assigned.filter((i) => i.status === 'resolved').length;
  const pendingAck = assigned.filter((i) => i.status === 'assigned').length;

  return (
    <TeamLayout>
      <div className="space-y-8">
        <PageHeader
          title="Emergency Response Unit Dashboard"
          description="Active emergency dispatches, field update logs, and site hazard resolution"
        />

        {/* Welcome Crew Banner */}
        <div className="bg-slate-900 text-white rounded-none p-6 sm:p-8 shadow-xl border border-amber-600/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">On Duty Dispatch Unit</span>
            <h1 className="text-2xl sm:text-3xl font-black">Commander {user?.name || 'Captain David Vance'}</h1>
            <p className="text-xs text-slate-200">Unit: Metro Fire & Emergency Rapid Response</p>
          </div>
          <Link
            to="/team/incidents"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg transition"
          >
            <span>View Active Dispatches ({activeCount})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Response Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            value={assigned.length || 8}
            label="Total Assigned"
            sub="Dispatch queue"
            icon={ShieldAlert}
            color="blue"
          />
          <StatCard
            value={activeCount || 3}
            label="In Progress"
            sub="Active response"
            icon={Clock}
            color="amber"
          />
          <StatCard
            value={completedCount || 5}
            label="Completed Today"
            sub="Site resolved"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            value={pendingAck || 1}
            label="Pending Ack"
            sub="Needs confirmation"
            icon={AlertCircle}
            color="purple"
          />
        </div>

        {/* Assigned Dispatches Table */}
        <div className="space-y-4">
          <DataTable
            title="Assigned Duty Queue"
            description="Active response tasks requiring team intervention"
            columns={[
              {
                key: 'reference_number',
                header: 'Reference #',
                render: (inc) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{inc.reference_number}</span>,
              },
              {
                key: 'title',
                header: 'Incident Title',
                render: (inc) => <span className="font-bold text-slate-900 dark:text-white max-w-xs truncate block">{inc.title}</span>,
              },
              {
                key: 'address',
                header: 'Location Address',
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
            ]}
            data={assigned.slice(0, 5)}
            emptyMessage="No assigned dispatches in duty queue"
            pageSize={5}
            pagination={false}
          />
        </div>
      </div>
    </TeamLayout>
  );
}
