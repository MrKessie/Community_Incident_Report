import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import apiClient from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import IncidentDetailModal from '../components/IncidentDetailModal';
import SkeletonCard from '../components/SkeletonCard';
import useIncidentRealtime from '../hooks/useIncidentRealtime';
import { useToast } from '../context/ToastContext';

function buildPhotoUrl(photoUrl) {
  if (!photoUrl) {
    return '';
  }

  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }

  return `http://127.0.0.1:8000${photoUrl}`;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

const STATUS_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

function IncidentListPage() {
  const toast = useToast();
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [radiusKm, setRadiusKm] = useState('');
  const [centerLat, setCenterLat] = useState('');
  const [centerLng, setCenterLng] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const pageSize = 8;

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await apiClient.get('/incidents');
        setIncidents(response.data.data || []);
      } catch {
        toast.error('Unable to load incidents', 'Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  useIncidentRealtime({
    incidents,
    setIncidents,
    enabled: !loading,
    onUpdate: () => {
      toast.info('Live update', 'Incident list has been refreshed.');
    },
  });

  const filteredIncidents = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
    const radiusValue = Number(radiusKm);
    const centerLatNumber = Number(centerLat);
    const centerLngNumber = Number(centerLng);
    const hasRadiusFilter = radiusValue > 0 && Number.isFinite(centerLatNumber) && Number.isFinite(centerLngNumber);

    return incidents.filter((incident) => {
      const statusMatches = statusFilter === 'All' || incident.status === statusFilter;
      const searchMatches =
        trimmedQuery.length === 0 ||
        incident.description?.toLowerCase().includes(trimmedQuery) ||
        `${incident.latitude},${incident.longitude}`.toLowerCase().includes(trimmedQuery) ||
        `${incident.id}`.includes(trimmedQuery);

      const reportedAt = incident.created_at ? new Date(incident.created_at) : null;
      const fromMatches = !fromDate || !reportedAt || reportedAt >= fromDate;
      const toMatches = !toDate || !reportedAt || reportedAt <= toDate;

      const radiusMatches =
        !hasRadiusFilter ||
        haversineDistanceKm(centerLatNumber, centerLngNumber, Number(incident.latitude), Number(incident.longitude)) <=
          radiusValue;

      return statusMatches && searchMatches && fromMatches && toMatches && radiusMatches;
    });
  }, [incidents, statusFilter, searchQuery, dateFrom, dateTo, radiusKm, centerLat, centerLng]);

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize));
  const pagedIncidents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIncidents.slice(start, start + pageSize);
  }, [filteredIncidents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, dateFrom, dateTo, radiusKm, centerLat, centerLng]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function exportAsPdf() {
    const rows = filteredIncidents
      .map(
        (incident) =>
          `<tr><td>${incident.id}</td><td>${incident.status}</td><td>${incident.description}</td><td>${incident.latitude}, ${incident.longitude}</td><td>${incident.created_at ? new Date(incident.created_at).toLocaleString() : '-'}</td></tr>`,
      )
      .join('');

    const popup = window.open('', '_blank', 'width=1024,height=768');

    if (!popup) {
      toast.error('Export blocked', 'Please allow popups to export PDF/print view.');
      return;
    }

    popup.document.write(`
      <html>
        <head>
          <title>Incident Report</title>
          <style>
            body { font-family: Segoe UI, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #c7d5d5; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #0f766e; color: white; }
            h1 { margin: 0 0 6px; }
            p { margin: 0 0 14px; color: #526666; }
          </style>
        </head>
        <body>
          <h1>Incident Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>ID</th><th>Status</th><th>Description</th><th>Coordinates</th><th>Reported At</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  return (
    <DashboardLayout
      title="Incident List"
      subtitle="Browse and filter all reported incidents."
      breadcrumbItems={[{ label: 'Incidents' }]}
    >
      <section className="panel">
        <div className="panel-headline">
          <h2>Incident List</h2>
          <Select
            isSearchable
            isClearable={false}
            classNamePrefix="react-select"
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((option) => option.value === statusFilter)}
            onChange={(option) => setStatusFilter(option?.value || 'All')}
          />
        </div>

        <div className="filter-grid">
          <div>
            <label htmlFor="dateFrom">From date</label>
            <input id="dateFrom" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </div>
          <div>
            <label htmlFor="dateTo">To date</label>
            <input id="dateTo" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </div>
          <div>
            <label htmlFor="centerLat">Center latitude</label>
            <input
              id="centerLat"
              type="number"
              step="0.0000001"
              placeholder="5.603717"
              value={centerLat}
              onChange={(event) => setCenterLat(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="centerLng">Center longitude</label>
            <input
              id="centerLng"
              type="number"
              step="0.0000001"
              placeholder="-0.186964"
              value={centerLng}
              onChange={(event) => setCenterLng(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="radiusKm">Radius (km)</label>
            <input
              id="radiusKm"
              type="number"
              min="0"
              step="0.1"
              placeholder="10"
              value={radiusKm}
              onChange={(event) => setRadiusKm(event.target.value)}
            />
          </div>
        </div>

        <input
          type="search"
          className="search-input"
          value={searchQuery}
          placeholder="Search by ID, text, or coordinates"
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <div className="action-row export-row">
          <button type="button" onClick={exportAsPdf}>
            Export PDF
          </button>
          <button type="button" className="ghost-button" onClick={() => window.print()}>
            Print
          </button>
        </div>

        {loading && (
          <div className="stack-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && incidents.length === 0 && (
          <EmptyState
            title="No incidents available"
            description="Reported incidents will appear here once data is available."
          />
        )}

        {!loading && incidents.length > 0 && filteredIncidents.length === 0 && (
          <EmptyState
            title="No incidents for this filter"
            description="Adjust the status filter or search query to find matching records."
          />
        )}

        {!loading && filteredIncidents.length > 0 && (
          <ul className="incident-list">
            {pagedIncidents.map((incident) => (
              <li key={incident.id} className="incident-item">
                <div>
                  <h3>{incident.description}</h3>
                  <p>
                    Coordinates: {incident.latitude}, {incident.longitude}
                  </p>
                  {incident.photo_url && (
                    <img src={buildPhotoUrl(incident.photo_url)} alt="Incident" className="incident-photo" />
                  )}
                  <button
                    type="button"
                    className="ghost-button view-details-btn"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    View Details
                  </button>
                </div>
                <span className={`status-pill status-${incident.status.toLowerCase().replace(' ', '-')}`}>
                  {incident.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!loading && filteredIncidents.length > 0 && (
          <div className="pagination-row">
            <button type="button" className="ghost-button" disabled={currentPage === 1} onClick={() => setCurrentPage((previous) => previous - 1)}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="ghost-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((previous) => previous + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        buildPhotoUrl={buildPhotoUrl}
      />
    </DashboardLayout>
  );
}

export default IncidentListPage;
