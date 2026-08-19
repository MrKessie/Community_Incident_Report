import React, { useState } from 'react';
import ReporterLayout from '../../layouts/ReporterLayout';
import PageHeader from '../../components/common/PageHeader';
import IncidentFilters from '../../components/incidents/IncidentFilters';
import IncidentCard from '../../components/incidents/IncidentCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useIncidents } from '../../hooks/useIncidents';
import { Link } from 'react-router-dom';

export default function MyIncidentsPage() {
  const { incidents, loading } = useIncidents(false);
  const [filters, setFilters] = useState({ search: '', status: '', severity: '', category_id: '' });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filters.status && inc.status !== filters.status) return false;
    if (filters.severity && inc.severity !== filters.severity) return false;
    if (filters.category_id && String(inc.category_id) !== String(filters.category_id)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        inc.title?.toLowerCase().includes(q) ||
        inc.reference_number?.toLowerCase().includes(q) ||
        inc.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <ReporterLayout>
      <div className="space-y-6">
        <PageHeader
          title="My Incident Submissions"
          description="View and track status updates for all your reported community incidents"
          action={
            <Link
              to="/incidents/new"
              className="bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
            >
              + Report New Incident
            </Link>
          }
        />

        <IncidentFilters filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <LoadingSpinner />
        ) : filteredIncidents.length === 0 ? (
          <EmptyState
            title="No matching reports found"
            description="No incident reports match your current filter parameters."
            action={
              <Link to="/incidents/new" className="text-xs font-bold text-blue-600 hover:underline">
                Report a New Incident Now
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredIncidents.map((inc) => (
              <IncidentCard key={inc.id} incident={inc} linkPrefix="/incidents" />
            ))}
          </div>
        )}
      </div>
    </ReporterLayout>
  );
}
