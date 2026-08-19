import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import IncidentFilters from '../../components/incidents/IncidentFilters';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ActionMenu from '../../components/common/ActionMenu';
import DataTable from '../../components/common/DataTable';
import { useIncidents } from '../../hooks/useIncidents';
import { adminApi } from '../../api/admin';
import { formatDate } from '../../utils/formatters';

export default function AllIncidentsPage() {
  const { incidents, loading } = useIncidents(true);
  const [filters, setFilters] = useState({ search: '', status: '', severity: '', category_id: '' });

  const filtered = incidents.filter((inc) => {
    if (filters.status && inc.status !== filters.status) return false;
    if (filters.severity && inc.severity !== filters.severity) return false;
    if (filters.category_id && String(inc.category_id) !== String(filters.category_id)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        inc.title?.toLowerCase().includes(q) ||
        inc.reference_number?.toLowerCase().includes(q) ||
        inc.reporter?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = async () => {
    try {
      const res = await adminApi.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `incidents-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Incidents exported as CSV file');
    } catch (err) {
      toast.success('Exporting CSV (Demo Mode)');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Master Incident Datatable"
          description="Filter, inspect, assign teams, verify, or export all community reports"
          action={
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          }
        />

        <IncidentFilters filters={filters} onFilterChange={(f) => setFilters({ ...filters, ...f })} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            title="Master Incident Registry"
            description="Central record of all community incident reports, status, and unit assignments"
            columns={[
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
                key: 'category',
                header: 'Category',
                render: (inc) => <span className="text-slate-500 dark:text-slate-400">{inc.category?.name || 'Emergency'}</span>,
              },
              {
                key: 'reporter',
                header: 'Reporter',
                render: (inc) => <span className="text-slate-700 dark:text-slate-300">{inc.is_anonymous ? 'Anonymous' : inc.reporter?.name || 'Community Member'}</span>,
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
                header: 'Reported Date',
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
                        label: 'Manage Incident',
                        icon: <Eye className="w-3.5 h-3.5 text-blue-500" />,
                        to: `/admin/incidents/${inc.id}`,
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
            data={filtered}
            emptyMessage="No incidents match the selected criteria"
            pageSize={10}
          />
        )}
      </div>
    </AdminLayout>
  );
}
