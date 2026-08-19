import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useIncidentStore } from '../../store/useIncidentStore';
import { useAuthStore } from '../../store/useAuthStore';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { formatDate } from '../../utils/formatters';
import { FileText, PlusCircle, Search, Filter } from 'lucide-react';

export default function MyReportsPage() {
  const { user } = useAuthStore();
  const { incidents } = useIncidentStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const myReports = incidents.filter((i) => i.reporter_id === user?.id || !i.is_anonymous);

  const filteredReports = myReports.filter((inc) => {
    if (statusFilter && inc.status !== statusFilter) return false;
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-rose-400" />
              My Submitted Incident Reports
            </h1>
            <p className="text-xs text-slate-400 mt-1">Track status changes, admin notes, and field team dispatch logs.</p>
          </div>
          <Link
            to="/report"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Report New Incident
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search my reports by reference # or title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-500" />
            <div className="min-w-[150px]">
              <CustomReactSelect
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400 font-semibold">No incident reports match your filter criteria.</p>
            </div>
          ) : (
            filteredReports.map((inc) => (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{inc.reference_number}</span>
                    <StatusBadge status={inc.status} />
                    <SeverityBadge severity={inc.severity} />
                  </div>

                  <h3 className="text-base font-bold text-white">{inc.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{inc.description}</p>
                  
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>📍 {inc.address || 'Geotagged Pin Location'}</span>
                    <span>🕒 Reported {formatDate(inc.reported_at || inc.incident_date)}</span>
                  </div>
                </div>

                <Link
                  to={`/incidents/${inc.id}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 text-center shrink-0 border border-slate-700/60"
                >
                  View Details & Updates →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
