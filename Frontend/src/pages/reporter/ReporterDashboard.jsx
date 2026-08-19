import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock, CheckCircle2, MessageSquare, Plus, ArrowRight, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';
import ReporterLayout from '../../layouts/ReporterLayout';
import IncidentCard from '../../components/incidents/IncidentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';

export default function ReporterDashboard() {
  const { user } = useAuth();
  const { incidents, loading } = useIncidents(false);

  const pending = incidents.filter((i) => ['submitted', 'under_review', 'verified', 'assigned', 'in_progress'].includes(i.status)).length;
  const resolved = incidents.filter((i) => ['resolved', 'closed'].includes(i.status)).length;
  const awaitingFeedback = incidents.filter((i) => i.status === 'resolved' && !i.feedback).length;

  return (
    <ReporterLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand text-white rounded-none p-6 sm:p-8 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">Community Member Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.name || 'Alex Morgan'}!</h1>
            <p className="text-xs text-slate-100">Track your submitted incident reports and community safety updates.</p>
          </div>
          <Link
            to="/incidents/new"
            className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg transition border border-teal-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Incident</span>
          </Link>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            value={incidents.length}
            label="My Total Reports"
            sub="Logged incidents"
            icon={FileText}
            color="blue"
          />
          <StatCard
            value={pending}
            label="Pending / Active"
            sub="Under review"
            icon={Clock}
            color="amber"
          />
          <StatCard
            value={resolved}
            label="Resolved Reports"
            sub="Successfully closed"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            value={awaitingFeedback}
            label="Awaiting Feedback"
            sub="Rate response"
            icon={MessageSquare}
            color="purple"
          />
        </div>

        {/* Recent Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Incident Submissions</h2>
            <Link to="/incidents" className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center space-x-1">
              <span>View All ({incidents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {incidents.slice(0, 3).map((inc) => (
                <IncidentCard key={inc.id} incident={inc} linkPrefix="/incidents" />
              ))}
            </div>
          )}
        </div>
      </div>
    </ReporterLayout>
  );
}
