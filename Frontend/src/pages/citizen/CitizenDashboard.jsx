import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import AnnouncementBanner from '../../components/common/AnnouncementBanner';
import StatCard from '../../components/common/StatCard';
import { useIncidentStore } from '../../store/useIncidentStore';
import { useAuthStore } from '../../store/useAuthStore';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { formatDate } from '../../utils/formatters';
import { FileText, PlusCircle, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuthStore();
  const { incidents } = useIncidentStore();

  // Filter reports submitted by current user (or demo user)
  const myReports = incidents.filter((i) => i.reporter_id === user?.id || !i.is_anonymous);

  const activeReports = myReports.filter((i) => !['resolved', 'closed', 'rejected'].includes(i.status));
  const resolvedReports = myReports.filter((i) => ['resolved', 'closed'].includes(i.status));

  return (
    <Layout>
      <div className="space-y-8">
        <AnnouncementBanner />

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Citizen Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                Community Member
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Welcome back, {user?.name}. Monitor your submitted incident reports and track real-time dispatches.</p>
          </div>

          <Link
            to="/report"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            + Report New Incident
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            value={myReports.length}
            label="My Total Submissions"
            sub="Incident reports logged"
            icon={FileText}
            color="blue"
          />
          <StatCard
            value={activeReports.length}
            label="In Progress"
            sub="Under review / active dispatch"
            icon={Clock}
            color="amber"
          />
          <StatCard
            value={resolvedReports.length}
            label="Resolved"
            sub="Successfully closed"
            icon={CheckCircle2}
            color="emerald"
          />
        </div>

        {/* My Incident Activity List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">My Reported Incidents</h3>
            <Link to="/dashboard/my-reports" className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-400">You have not submitted any incident reports yet.</p>
              <Link to="/report" className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
                Report an Incident Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myReports.slice(0, 5).map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{inc.reference_number}</span>
                      <StatusBadge status={inc.status} />
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{inc.description}</p>
                    <p className="text-[11px] text-slate-500">Reported on {formatDate(inc.reported_at || inc.incident_date)}</p>
                  </div>

                  <Link
                    to={`/incidents/${inc.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-center shrink-0"
                  >
                    Track Progress →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
