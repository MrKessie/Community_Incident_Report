import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, FileText, ArrowRight, Eye, Clock, BarChart3 } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import ActionMenu from '../../components/common/ActionMenu';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import DateRangePicker from '../../components/common/DateRangePicker';

import OverviewCards from '../../components/analytics/OverviewCards';
import IncidentsByCategoryChart from '../../components/analytics/IncidentsByCategoryChart';
import IncidentsByStatusChart from '../../components/analytics/IncidentsByStatusChart';
import IncidentsByMonthChart from '../../components/analytics/IncidentsByMonthChart';
import SeverityDistributionChart from '../../components/analytics/SeverityDistributionChart';
import ResponseTimeChart from '../../components/analytics/ResponseTimeChart';
import TeamPerformanceTable from '../../components/analytics/TeamPerformanceTable';

import { useIncidents } from '../../hooks/useIncidents';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const { incidents } = useIncidents(true);
  const { data: analyticsData } = useAnalytics();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const urgentIncidents = incidents.filter((i) => ['critical', 'high'].includes(i.severity) && ['submitted', 'verified'].includes(i.status));

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader
          title="Administrator Command Center & Analytics Hub"
          description="Real-time emergency dispatch queue, incident triage, executive metrics, and authority monitoring"
          action={
            <div className="flex flex-wrap items-center gap-3">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
              />
              <Link to="/admin/incidents" className="bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md">
                View All Incidents
              </Link>
            </div>
          }
        />

        {/* ALL Stat Cards at the Top */}
        <div className="space-y-4">
          <OverviewCards stats={analyticsData?.overview} />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              value={incidents.length}
              label="Total Reports"
              sub="All submissions"
              icon={FileText}
              color="blue"
            />
            <StatCard
              value={incidents.filter((i) => i.status === 'submitted').length}
              label="Pending Triage"
              sub="Needs review"
              icon={Clock}
              color="amber"
            />
            <StatCard
              value={incidents.filter((i) => ['verified', 'assigned', 'in_progress'].includes(i.status)).length}
              label="Active Dispatches"
              sub="Units deployed"
              icon={ShieldAlert}
              color="purple"
            />
            <StatCard
              value={incidents.filter((i) => i.severity === 'critical').length}
              label="Critical Alerts"
              sub="High priority"
              icon={AlertTriangle}
              color="rose"
            />
          </div>
        </div>

        {/* Urgent Attention Alert Banner */}
        {urgentIncidents.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800/80 rounded-none p-6 shadow-md space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 animate-ping text-rose-600 dark:text-rose-500" />
              <span>Incidents Requiring Immediate Dispatch Attention ({urgentIncidents.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {urgentIncidents.slice(0, 2).map((inc) => (
                <div key={inc.id} className="bg-white dark:bg-slate-950/80 p-4 rounded-none border border-rose-200 dark:border-rose-900/50 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">{inc.reference_number}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">{inc.title}</h4>
                  </div>
                  <Link to={`/admin/incidents/${inc.id}`} className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl">
                    Dispatch Team
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Incidents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Master Queue Reports</h3>
            <Link to="/admin/incidents" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">View Full Datatable</Link>
          </div>

          <DataTable
            title="Recent System Incident Log"
            description="Latest submitted community incidents requiring review or dispatch"
            columns={[
              {
                key: 'reference_number',
                header: 'Reference',
                render: (inc) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{inc.reference_number}</span>,
              },
              {
                key: 'title',
                header: 'Title',
                render: (inc) => <span className="font-bold text-slate-900 dark:text-white">{inc.title}</span>,
              },
              {
                key: 'category',
                header: 'Category',
                render: (inc) => <span className="text-slate-500 dark:text-slate-400">{inc.category?.name || 'Emergency'}</span>,
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
                header: 'Reported',
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
                        label: 'Inspect Incident',
                        icon: <Eye className="w-3.5 h-3.5 text-blue-500" />,
                        to: `/admin/incidents/${inc.id}`,
                      },
                      {
                        label: 'View Details',
                        icon: <FileText className="w-3.5 h-3.5 text-slate-400" />,
                        to: `/incidents/${inc.id}`,
                      },
                    ]}
                  />
                ),
              },
            ]}
            data={incidents.slice(0, 6)}
            emptyMessage="No recent incidents reported"
            pageSize={6}
            pagination={false}
          />
        </div>

        {/* Analytics Charts & Metrics Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Executive Emergency Response Analytics & Performance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IncidentsByCategoryChart data={analyticsData?.byCategory} />
            <IncidentsByStatusChart data={analyticsData?.byStatus} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SeverityDistributionChart data={analyticsData?.bySeverity} />
            <IncidentsByMonthChart data={analyticsData?.byMonth} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponseTimeChart data={analyticsData?.responseTimes} />
            <TeamPerformanceTable teams={analyticsData?.teamPerformance} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
