import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import VerifyIncidentModal from '../../components/modals/VerifyIncidentModal';
import AssignTeamModal from '../../components/modals/AssignTeamModal';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'verified', label: 'Verified' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];
import MarkDuplicateModal from '../../components/modals/MarkDuplicateModal';
import UpdateStatusModal from '../../components/modals/UpdateStatusModal';
import ActionMenu from '../../components/common/ActionMenu';
import DataTable from '../../components/common/DataTable';
import { useIncidentStore } from '../../store/useIncidentStore';
import { formatDate } from '../../utils/formatters';
import { ShieldCheck, Search, Filter, Trash2, Copy, Users, CheckSquare, Edit, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IncidentManagementPage() {
  const { incidents, categories, teams } = useIncidentStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [verifyInc, setVerifyInc] = useState(null);
  const [assignInc, setAssignInc] = useState(null);
  const [duplicateInc, setDuplicateInc] = useState(null);
  const [statusInc, setStatusInc] = useState(null);

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter && inc.status !== statusFilter) return false;
    if (severityFilter && inc.severity !== severityFilter) return false;
    if (categoryFilter && String(inc.category_id) !== String(categoryFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.reference_number.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" /> Master Incident Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">Review, verify, assign response teams, update statuses, and flag duplicates.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference #, title, or details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[140px]">
              <CustomReactSelect
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
                size="sm"
              />
            </div>

            <div className="min-w-[140px]">
              <CustomReactSelect
                options={severityOptions}
                value={severityFilter}
                onChange={setSeverityFilter}
                placeholder="All Severities"
                size="sm"
              />
            </div>

            <div className="min-w-[150px]">
              <CustomReactSelect
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map((c) => ({ value: String(c.id), label: c.name })),
                ]}
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="All Categories"
                size="sm"
              />
            </div>

            {(search || statusFilter || severityFilter || categoryFilter) && (
              <button
                onClick={() => { setSearch(''); setStatusFilter(''); setSeverityFilter(''); setCategoryFilter(''); }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Master Datatable */}
        <DataTable
          title="Emergency Dispatch & Verification Console"
          description="Verify incoming citizen submissions, assign response units, and manage incident lifecycles"
          columns={[
            {
              key: 'reference_number',
              header: 'Reference',
              render: (inc) => <span className="font-mono font-bold text-slate-300">{inc.reference_number}</span>,
            },
            {
              key: 'title',
              header: 'Title & Category',
              render: (inc) => (
                <div>
                  <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">{inc.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{inc.category?.name}</div>
                </div>
              ),
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
              key: 'team',
              header: 'Assigned Team',
              render: (inc) => (
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {inc.active_assignment?.team?.name || <span className="text-slate-500 italic">Unassigned</span>}
                </span>
              ),
            },
            {
              key: 'reported_at',
              header: 'Reported At',
              render: (inc) => <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{formatDate(inc.reported_at || inc.incident_date)}</span>,
            },
            {
              key: 'actions',
              header: 'Actions',
              className: 'text-right',
              render: (inc) => (
                <ActionMenu
                  items={[
                    {
                      label: 'Verify / Reject',
                      icon: <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />,
                      onClick: () => setVerifyInc(inc),
                    },
                    {
                      label: 'Assign Team',
                      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
                      onClick: () => setAssignInc(inc),
                    },
                    {
                      label: 'Update Status',
                      icon: <Edit className="w-3.5 h-3.5 text-amber-400" />,
                      onClick: () => setStatusInc(inc),
                    },
                    {
                      label: 'Flag Duplicate',
                      icon: <Copy className="w-3.5 h-3.5 text-purple-400" />,
                      onClick: () => setDuplicateInc(inc),
                    },
                    {
                      label: 'View Incident Details',
                      icon: <Eye className="w-3.5 h-3.5 text-blue-400" />,
                      to: `/incidents/${inc.id}`,
                    },
                  ]}
                />
              ),
            },
          ]}
          data={filteredIncidents}
          emptyMessage="No incidents matching current criteria"
          pageSize={10}
        />

        {/* Modals */}
        {verifyInc && <VerifyIncidentModal incident={verifyInc} onClose={() => setVerifyInc(null)} />}
        {assignInc && <AssignTeamModal incident={assignInc} onClose={() => setAssignInc(null)} />}
        {duplicateInc && <MarkDuplicateModal incident={duplicateInc} onClose={() => setDuplicateInc(null)} />}
        {statusInc && <UpdateStatusModal incident={statusInc} onClose={() => setStatusInc(null)} />}
      </div>
    </Layout>
  );
}
