import { useEffect, useMemo, useState } from 'react';
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

function DashboardPage() {
  const toast = useToast();
  const [incidents, setIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

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
      toast.info('Live update', 'Incident feed refreshed with latest updates.');
    },
  });

  const filteredIncidents = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return incidents.filter((incident) => {
      const textMatches =
        !trimmedQuery ||
        incident.description?.toLowerCase().includes(trimmedQuery) ||
        `${incident.latitude},${incident.longitude}`.toLowerCase().includes(trimmedQuery) ||
        `${incident.id}`.includes(trimmedQuery);
      const reportedAt = incident.created_at ? new Date(incident.created_at) : null;
      const fromMatches = !fromDate || !reportedAt || reportedAt >= fromDate;
      const toMatches = !toDate || !reportedAt || reportedAt <= toDate;

      return textMatches && fromMatches && toMatches;
    });
  }, [incidents, searchQuery, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const pending = incidents.filter((incident) => incident.status === 'Pending').length;
    const inProgress = incidents.filter((incident) => incident.status === 'In Progress').length;
    const resolved = incidents.filter((incident) => incident.status === 'Resolved').length;

    return {
      total: incidents.length,
      pending,
      inProgress,
      resolved,
    };
  }, [incidents]);

  return (
    <DashboardLayout
      title="Incident Dashboard"
      subtitle="Quick snapshot of the most recently reported incidents."
      statusBadge={<span className="status-pill status-in-progress">Live</span>}
      breadcrumbItems={[{ label: 'Dashboard' }]}
    >
      <section className="stat-grid">
        <article className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" />
              </svg>
            </span>
            <p>Total Incidents</p>
          </div>
          <h3>{stats.total}</h3>
        </article>
        <article className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v6h5v2h-7V7h2z" />
              </svg>
            </span>
            <p>Pending</p>
          </div>
          <h3>{stats.pending}</h3>
        </article>
        <article className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l11-14h-8V2z" />
              </svg>
            </span>
            <p>In Progress</p>
          </div>
          <h3>{stats.inProgress}</h3>
        </article>
        <article className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L18 9l-7 7z" />
              </svg>
            </span>
            <p>Resolved</p>
          </div>
          <h3>{stats.resolved}</h3>
        </article>
      </section>

      <section className="panel">
        <div className="panel-headline">
          <h2>Recent Incidents</h2>
          <input
            type="search"
            className="search-input"
            value={searchQuery}
            placeholder="Search by ID, text, or coordinates"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="date-inline">
          <div>
            <label htmlFor="dashboardDateFrom">From date</label>
            <input
              id="dashboardDateFrom"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dashboardDateTo">To date</label>
            <input
              id="dashboardDateTo"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </div>
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
            title="No incidents yet"
            description="Once users report incidents, they will appear here with location and status."
          />
        )}

        {!loading && incidents.length > 0 && filteredIncidents.length === 0 && (
          <EmptyState
            title="No match for your search"
            description="Try another keyword or clear the current search filter."
          />
        )}

        {!loading && filteredIncidents.length > 0 && (
          <ul className="incident-list">
            {filteredIncidents.map((incident) => (
              <li key={incident.id} className="incident-item">
                <div>
                  <h3>{incident.description}</h3>
                  <p>
                    Location: {incident.latitude}, {incident.longitude}
                  </p>
                  {incident.photo_url && (
                    <img
                      src={buildPhotoUrl(incident.photo_url)}
                      alt="Incident"
                      className="incident-photo"
                    />
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

export default DashboardPage;
