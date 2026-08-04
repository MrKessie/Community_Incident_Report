import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import Select from 'react-select';
import apiClient from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import IncidentDetailModal from '../components/IncidentDetailModal';
import Modal from '../components/Modal';
import SkeletonCard from '../components/SkeletonCard';
import useIncidentRealtime from '../hooks/useIncidentRealtime';
import { useToast } from '../context/ToastContext';

const STATUS_FLOW = {
  Pending: ['Pending', 'In Progress'],
  'In Progress': ['In Progress', 'Resolved'],
  Resolved: ['Resolved'],
};

const ADMIN_STATUS_FILTERS = [
  { value: 'All', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

const NOTES_STORAGE_KEY = 'cir.admin.notes';

const DEFAULT_CENTER = {
  lat: 5.603717,
  lng: -0.186964,
};

function toIncidentKey(id) {
  return String(id);
}

function getIncidentAgeHours(incident) {
  if (!incident.created_at) {
    return 0;
  }

  const created = new Date(incident.created_at).getTime();
  return Math.max(0, (Date.now() - created) / 3600000);
}

function getSlaInfo(incident) {
  const ageHours = getIncidentAgeHours(incident);

  if ((incident.status === 'Pending' || incident.status === 'In Progress') && ageHours >= 48) {
    return { label: 'Overdue', tone: 'danger' };
  }

  if (incident.status === 'Pending' && ageHours >= 24) {
    return { label: 'Escalate Soon', tone: 'warning' };
  }

  return { label: 'On Track', tone: 'ok' };
}

function getPriorityInfo(incident) {
  const ageHours = getIncidentAgeHours(incident);
  let score = 0;

  if (incident.status === 'Pending') {
    score += 2;
  }

  if (incident.status === 'In Progress') {
    score += 1;
  }

  if (ageHours >= 24) {
    score += 2;
  }

  if (ageHours >= 48) {
    score += 2;
  }

  if (!incident.assignments?.[0]?.assignee?.name) {
    score += 1;
  }

  if (score >= 6) {
    return { label: 'High', tone: 'high' };
  }

  if (score >= 3) {
    return { label: 'Medium', tone: 'medium' };
  }

  return { label: 'Low', tone: 'low' };
}

function AdminDashboardPage() {
  const toast = useToast();
  const [incidents, setIncidents] = useState([]);
  const [maintenanceUsers, setMaintenanceUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedAssignee, setSelectedAssignee] = useState({});
  const [selectedIncidentIds, setSelectedIncidentIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('Pending');
  const [bulkAssignee, setBulkAssignee] = useState(null);
  const [internalNotes, setInternalNotes] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const [resolveChecklist, setResolveChecklist] = useState({
    open: false,
    incidentId: null,
    closureNote: '',
    beforePhoto: null,
    afterPhoto: null,
  });
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [manageModalIncidentId, setManageModalIncidentId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [incidentResponse, maintenanceResponse] = await Promise.all([
          apiClient.get('/incidents'),
          apiClient.get('/users/maintenance'),
        ]);

        const fetchedIncidents = incidentResponse.data.data || [];
        setIncidents(fetchedIncidents);
        setMaintenanceUsers(maintenanceResponse.data.data || []);

        const statusMap = {};
        const assigneeMap = {};
        fetchedIncidents.forEach((incident) => {
          statusMap[incident.id] = incident.status;
          assigneeMap[incident.id] = incident.assignments?.[0]?.assigned_to || null;
        });
        setSelectedStatus(statusMap);
        setSelectedAssignee(assigneeMap);
      } catch {
        toast.error('Unable to load admin data', 'Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);

    if (storedNotes) {
      setInternalNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(internalNotes));
  }, [internalNotes]);

  useIncidentRealtime({
    incidents,
    setIncidents,
    enabled: !loading,
    onUpdate: () => {
      toast.info('Live update', 'Admin incident data refreshed.');
      pushNotification('info', 'Live Update', 'Incident board refreshed with latest updates.');
    },
  });

  function pushNotification(type, title, message) {
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
    };

    setNotifications((previous) => [item, ...previous].slice(0, 30));
    setUnreadCount((previous) => previous + 1);
  }

  async function updateIncidentStatus(incidentId) {
    const status = selectedStatus[incidentId];

    if (!status) {
      return;
    }

    try {
      const response = await apiClient.post(`/incidents/${incidentId}/status`, { status });
      const updated = response.data.data;

      setIncidents((previous) =>
        previous.map((incident) => (incident.id === incidentId ? { ...incident, status: updated.status } : incident)),
      );

      toast.success('Status updated', `Incident #${incidentId} is now ${status}.`);
      pushNotification('success', 'Status Updated', `Incident #${incidentId} moved to ${status}.`);
    } catch (apiError) {
      toast.error('Update failed', apiError.response?.data?.message || 'Failed to update incident status.');
    }
  }

  async function saveManagedIncidentChanges(incidentId) {
    const status = selectedStatus[incidentId];
    const assignedTo = selectedAssignee[incidentId];

    if (!status) {
      toast.info('Status required', 'Select a status before saving.');
      return;
    }

    if (!assignedTo) {
      toast.info('Assignee required', 'Select a maintenance team member before saving.');
      return;
    }

    try {
      const [statusResponse, assignmentResponse] = await Promise.all([
        apiClient.post(`/incidents/${incidentId}/status`, { status }),
        apiClient.post(`/incidents/${incidentId}/assign`, { assigned_to: Number(assignedTo) }),
      ]);

      const updatedStatus = statusResponse.data.data?.status || status;
      const assignment = assignmentResponse.data.data;

      setIncidents((previous) =>
        previous.map((incident) => {
          if (incident.id !== incidentId) {
            return incident;
          }

          return {
            ...incident,
            status: updatedStatus,
            assignments: [
              {
                assigned_to: assignment.assigned_to,
                assignee: assignment.assignee,
              },
            ],
          };
        }),
      );

      toast.success('Incident updated', `Incident #${incidentId} status and assignment saved.`);
      pushNotification('success', 'Incident Updated', `Incident #${incidentId} was updated successfully.`);
      setManageModalIncidentId(null);
    } catch (apiError) {
      toast.error('Save failed', apiError.response?.data?.message || 'Could not save incident changes.');
    }
  }

  async function applyBulkStatus() {
    if (!selectedIncidentIds.length) {
      toast.info('No selection', 'Select one or more incidents first.');
      return;
    }

    try {
      await Promise.all(
        selectedIncidentIds.map((incidentId) =>
          apiClient.post(`/incidents/${Number(incidentId)}/status`, { status: bulkStatus }),
        ),
      );

      setIncidents((previous) =>
        previous.map((incident) =>
          selectedIncidentIds.includes(toIncidentKey(incident.id)) ? { ...incident, status: bulkStatus } : incident,
        ),
      );
      pushNotification('success', 'Bulk Status Applied', `${selectedIncidentIds.length} incidents updated.`);
      toast.success('Bulk status update', 'Selected incidents updated successfully.');
      setSelectedIncidentIds([]);
    } catch {
      toast.error('Bulk update failed', 'Could not update all selected incidents.');
    }
  }

  async function applyBulkAssignment() {
    if (!selectedIncidentIds.length) {
      toast.info('No selection', 'Select one or more incidents first.');
      return;
    }

    if (!bulkAssignee) {
      toast.info('No assignee selected', 'Select an assignee for bulk assignment.');
      return;
    }

    try {
      await Promise.all(
        selectedIncidentIds.map((incidentId) =>
          apiClient.post(`/incidents/${Number(incidentId)}/assign`, { assigned_to: Number(bulkAssignee) }),
        ),
      );

      setIncidents((previous) =>
        previous.map((incident) => {
          if (!selectedIncidentIds.includes(toIncidentKey(incident.id))) {
            return incident;
          }

          const user = maintenanceUsers.find((item) => item.id === Number(bulkAssignee));
          return {
            ...incident,
            assignments: [
              {
                assigned_to: Number(bulkAssignee),
                assignee: user ? { name: user.name, email: user.email } : incident.assignments?.[0]?.assignee,
              },
            ],
          };
        }),
      );

      pushNotification('success', 'Bulk Assignment Applied', `${selectedIncidentIds.length} incidents assigned.`);
      toast.success('Bulk assignment', 'Selected incidents assigned successfully.');
      setSelectedIncidentIds([]);
    } catch {
      toast.error('Bulk assignment failed', 'Could not assign all selected incidents.');
    }
  }

  function toggleIncidentSelection(incidentId) {
    const incidentKey = toIncidentKey(incidentId);

    setSelectedIncidentIds((previous) =>
      previous.includes(incidentKey)
        ? previous.filter((item) => item !== incidentKey)
        : [...previous, incidentKey],
    );
  }

  function saveInternalNote(incidentId, value) {
    setInternalNotes((previous) => ({
      ...previous,
      [incidentId]: value,
    }));
  }

  function exportCsv() {
    const header = ['id', 'status', 'priority', 'sla', 'description', 'assignee', 'reported_at'];
    const rows = filteredIncidents.map((incident) => {
      const priority = getPriorityInfo(incident).label;
      const sla = getSlaInfo(incident).label;
      const assignee = incident.assignments?.[0]?.assignee?.name || '';
      return [
        incident.id,
        incident.status,
        priority,
        sla,
        (incident.description || '').replaceAll(',', ' '),
        assignee.replaceAll(',', ' '),
        incident.created_at || '',
      ].join(',');
    });

    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin_incidents_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const rows = filteredIncidents
      .map(
        (incident) =>
          `<tr><td>${incident.id}</td><td>${incident.status}</td><td>${getPriorityInfo(incident).label}</td><td>${getSlaInfo(incident).label}</td><td>${incident.description}</td></tr>`,
      )
      .join('');

    const popup = window.open('', '_blank', 'width=1000,height=760');
    if (!popup) {
      toast.error('Popup blocked', 'Allow popups to export PDF.');
      return;
    }

    popup.document.write(`
      <html>
        <head>
          <title>Admin Incident Report</title>
          <style>
            body { font-family: Segoe UI, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1dddd; padding: 8px; text-align: left; }
            th { background: #0f766e; color: #fff; }
          </style>
        </head>
        <body>
          <h2>Admin Incident Report</h2>
          <p>Generated ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>ID</th><th>Status</th><th>Priority</th><th>SLA</th><th>Description</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    popup.document.close();
    popup.focus();
    popup.print();
  }

  function buildPhotoUrl(photoUrl) {
    if (!photoUrl) {
      return '';
    }

    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }

    return `http://127.0.0.1:8000${photoUrl}`;
  }

  const filteredIncidents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return incidents
      .filter((incident) => {
        const statusMatches = statusFilter === 'All' || incident.status === statusFilter;
        const queryMatches =
          query.length === 0 ||
          incident.description?.toLowerCase().includes(query) ||
          `${incident.id}`.includes(query) ||
          incident.assignments?.[0]?.assignee?.name?.toLowerCase().includes(query);

        return statusMatches && queryMatches;
      })
      .sort((first, second) => second.id - first.id);
  }, [incidents, searchQuery, statusFilter]);

  const maintenanceOptions = useMemo(
    () =>
      maintenanceUsers.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
      })),
    [maintenanceUsers],
  );

  const workloadStats = useMemo(
    () =>
      maintenanceUsers.map((user) => {
        const active = incidents.filter(
          (incident) =>
            incident.assignments?.[0]?.assigned_to === user.id && incident.status !== 'Resolved',
        ).length;

        return {
          id: user.id,
          name: user.name,
          active,
        };
      }),
    [maintenanceUsers, incidents],
  );

  const overview = useMemo(
    () => ({
      total: incidents.length,
      pending: incidents.filter((incident) => incident.status === 'Pending').length,
      inProgress: incidents.filter((incident) => incident.status === 'In Progress').length,
      resolved: incidents.filter((incident) => incident.status === 'Resolved').length,
    }),
    [incidents],
  );

  const manageIncident = useMemo(
    () => incidents.find((incident) => incident.id === manageModalIncidentId) || null,
    [incidents, manageModalIncidentId],
  );

  useEffect(() => {
    function onKeyDown(event) {
      const tagName = event.target?.tagName?.toLowerCase();

      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return;
      }

      if (!filteredIncidents.length) {
        return;
      }

      const activeIndex = filteredIncidents.findIndex((incident) => incident.id === activeIncidentId);

      if (event.key.toLowerCase() === 'n') {
        const nextIndex = activeIndex < filteredIncidents.length - 1 ? activeIndex + 1 : 0;
        setActiveIncidentId(filteredIncidents[nextIndex].id);
      }

      if (event.key.toLowerCase() === 'p') {
        const previousIndex = activeIndex > 0 ? activeIndex - 1 : filteredIncidents.length - 1;
        setActiveIncidentId(filteredIncidents[previousIndex].id);
      }

      if (event.key.toLowerCase() === 'a' && activeIncidentId) {
        const activeIncident = filteredIncidents.find((incident) => incident.id === activeIncidentId);
        if (activeIncident) {
          setSelectedIncident(activeIncident);
        }
      }

      if (event.key.toLowerCase() === 's' && activeIncidentId) {
        setManageModalIncidentId(activeIncidentId);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIncidentId, filteredIncidents, selectedStatus]);

  function getRecommendation(incident) {
    if (!workloadStats.length) {
      return null;
    }

    const recommended = [...workloadStats].sort((first, second) => first.active - second.active)[0];
    return maintenanceUsers.find((user) => user.id === recommended.id) || null;
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage status updates and assignments for maintenance teams."
      breadcrumbItems={[{ label: 'Admin' }]}
    >
      <section className="admin-top-strip">
        <div className="admin-shortcuts-hint">
          <p>Shortcuts: N next ticket, P previous ticket, A open details, S open manage modal</p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setNotificationOpen((previous) => !previous);
            setUnreadCount(0);
          }}
        >
          Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
        </button>
      </section>

      <section className="admin-overview-grid">
        <article className="admin-overview-card">
          <p>Total Incidents</p>
          <h3>{overview.total}</h3>
        </article>
        <article className="admin-overview-card">
          <p>Pending Queue</p>
          <h3>{overview.pending}</h3>
        </article>
        <article className="admin-overview-card">
          <p>In Progress</p>
          <h3>{overview.inProgress}</h3>
        </article>
        <article className="admin-overview-card">
          <p>Resolved</p>
          <h3>{overview.resolved}</h3>
        </article>
      </section>

      <section className="panel admin-utility-panel">
        <div className="panel-headline">
          <h2>Workload Dashboard</h2>
          <span>Maintenance Team</span>
        </div>

        <div className="workload-grid">
          {workloadStats.map((staff) => (
            <article key={staff.id} className="workload-card">
              <h4>{staff.name}</h4>
              <p>Active Incidents</p>
              <strong>{staff.active}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel admin-utility-panel">
        <div className="panel-headline">
          <h2>Map Triage</h2>
          <span>{filteredIncidents.length} visible incidents</span>
        </div>

        <MapContainer className="admin-map" center={DEFAULT_CENTER} zoom={11} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredIncidents.map((incident) => (
            <CircleMarker
              key={`map-${incident.id}`}
              center={[Number(incident.latitude), Number(incident.longitude)]}
              pathOptions={{
                color:
                  incident.status === 'Resolved'
                    ? '#166534'
                    : incident.status === 'In Progress'
                      ? '#1d4ed8'
                      : '#9a6700',
                fillOpacity: 0.45,
              }}
              radius={7}
            >
              <Popup>
                <strong>Incident #{incident.id}</strong>
                <p>{incident.description}</p>
                <p>Status: {incident.status}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </section>

      <section className="panel">
        <div className="panel-headline">
          <h2>Admin Workboard</h2>
          <div className="workboard-toolbar">
            <input
              type="search"
              className="search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by incident ID, description, or assignee"
            />
            <Select
              isSearchable={false}
              isClearable={false}
              classNamePrefix="react-select"
              options={ADMIN_STATUS_FILTERS}
              value={ADMIN_STATUS_FILTERS.find((option) => option.value === statusFilter)}
              onChange={(option) => setStatusFilter(option?.value || 'All')}
            />
            <button type="button" className="ghost-button" onClick={exportCsv}>
              Export CSV
            </button>
            <button type="button" className="ghost-button" onClick={exportPdf}>
              Export PDF / Print
            </button>
          </div>
        </div>

        <p className="panel-subtitle">All incidents are shown here. Use the status filter to switch between Pending, In Progress, and Resolved.</p>

        <div className="panel-headline">
          <h3>Bulk Actions</h3>
          <span>{selectedIncidentIds.length} selected</span>
        </div>

        <div className="admin-bulk-grid">
          <Select
            isSearchable={false}
            classNamePrefix="react-select"
            options={ADMIN_STATUS_FILTERS.filter((option) => option.value !== 'All')}
            value={ADMIN_STATUS_FILTERS.filter((option) => option.value !== 'All').find((option) => option.value === bulkStatus)}
            onChange={(option) => setBulkStatus(option?.value || 'Pending')}
          />
          <button type="button" onClick={applyBulkStatus}>
            Apply Bulk Status
          </button>

          <Select
            isSearchable
            classNamePrefix="react-select"
            options={maintenanceOptions}
            value={maintenanceOptions.find((option) => option.value === bulkAssignee) || null}
            onChange={(option) => setBulkAssignee(option?.value || null)}
          />
          <button type="button" onClick={applyBulkAssignment}>
            Apply Bulk Assignment
          </button>
        </div>

        {loading && (
          <div className="stack-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && incidents.length === 0 && (
          <EmptyState
            title="No incidents available"
            description="When incidents are reported, you can assign teams and update status here."
          />
        )}

        {!loading && filteredIncidents.length > 0 && (
          <div className="incident-list admin-incident-list">
            {filteredIncidents.map((incident) => {
              return (
                <article
                  key={incident.id}
                  className={`admin-ticket-card ${activeIncidentId === incident.id ? 'active-ticket' : ''}`}
                  onClick={() => setActiveIncidentId(incident.id)}
                >
                <div className="admin-ticket-top">
                  <div className="admin-ticket-title-wrap">
                    <input
                      type="checkbox"
                      checked={selectedIncidentIds.includes(toIncidentKey(incident.id))}
                      onChange={() => toggleIncidentSelection(incident.id)}
                      onClick={(event) => event.stopPropagation()}
                    />
                    <strong>Incident #{incident.id}</strong>
                  </div>
                  <span className={`status-pill status-${incident.status.toLowerCase().replace(' ', '-')}`}>
                    {incident.status}
                  </span>
                </div>

                <div className="ticket-meta-row">
                  <span className={`priority-pill priority-${getPriorityInfo(incident).tone}`}>
                    Priority {getPriorityInfo(incident).label}
                  </span>
                  <span className={`sla-pill sla-${getSlaInfo(incident).tone}`}>
                    SLA: {getSlaInfo(incident).label}
                  </span>
                </div>

                <p className="admin-ticket-description">{incident.description}</p>

                <p className="muted-small">
                  Assigned to <strong>{incident.assignments?.[0]?.assignee?.name || 'Not assigned yet'}</strong>
                </p>

                {incident.assignments?.[0]?.assignee?.name ? null : (
                  <div className="recommendation-row">
                    <span>
                      Suggested: <strong>{getRecommendation(incident)?.name || 'No recommendation'}</strong>
                    </span>
                    {getRecommendation(incident) && (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedAssignee((previous) => ({
                            ...previous,
                            [incident.id]: getRecommendation(incident).id,
                          }));
                        }}
                      >
                        Use
                      </button>
                    )}
                  </div>
                )}

                <div className="ticket-actions-row">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveIncidentId(incident.id);
                      setManageModalIncidentId(incident.id);
                    }}
                  >
                    Manage
                  </button>
                  <button
                    type="button"
                    className="ghost-button view-details-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIncident(incident);
                    }}
                  >
                    Details
                  </button>
                </div>

                <div className="note-block">
                  <label htmlFor={`note-${incident.id}`}>Internal Notes</label>
                  <textarea
                    id={`note-${incident.id}`}
                    rows={2}
                    placeholder="Private operational notes"
                    value={internalNotes[incident.id] || ''}
                    onChange={(event) =>
                      setInternalNotes((previous) => ({
                        ...previous,
                        [incident.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => saveInternalNote(incident.id, internalNotes[incident.id] || '')}
                  >
                    Save Note
                  </button>
                </div>

              </article>
            );
            })}
          </div>
        )}

        {!loading && incidents.length > 0 && filteredIncidents.length === 0 && (
          <EmptyState
            title="No incidents match your filters"
            description="Try a different search query or status filter to see incidents."
          />
        )}
      </section>

      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        buildPhotoUrl={buildPhotoUrl}
      />

      <Modal
        isOpen={Boolean(manageIncident)}
        onClose={() => setManageModalIncidentId(null)}
        cardClassName="manage-incident-modal"
        title={`Manage Incident #${manageIncident?.id || ''}`}
        actions={
          <>
            <button type="button" className="ghost-button" onClick={() => setManageModalIncidentId(null)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!manageIncident}
              onClick={() => {
                if (!manageIncident) {
                  return;
                }

                saveManagedIncidentChanges(manageIncident.id);
              }}
            >
              Save Changes
            </button>
          </>
        }
      >
        {manageIncident ? (
          <div className="manage-modal-shell">
            <p className="manage-modal-subtitle">Update the incident stage and assign the maintenance owner in one action.</p>

            <div className="manage-modal-summary-grid">
              <article className="manage-summary-item">
                <span className="manage-summary-label">Current Stage</span>
                <strong>{manageIncident.status}</strong>
              </article>
              <article className="manage-summary-item">
                <span className="manage-summary-label">Current Assignee</span>
                <strong>{manageIncident.assignments?.[0]?.assignee?.name || 'Not assigned yet'}</strong>
              </article>
              <article className="manage-summary-item">
                <span className="manage-summary-label">Reported</span>
                <strong>{manageIncident.created_at ? new Date(manageIncident.created_at).toLocaleString() : 'Unknown'}</strong>
              </article>
            </div>

            <div className="manage-modal-grid">
              <section className="manage-field-card">
                <label htmlFor={`manage-status-${manageIncident.id}`}>New status</label>
                <Select
                  inputId={`manage-status-${manageIncident.id}`}
                  isSearchable={false}
                  isClearable={false}
                  classNamePrefix="react-select"
                  options={(STATUS_FLOW[manageIncident.status] || [manageIncident.status]).map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  value={
                    selectedStatus[manageIncident.id]
                      ? { value: selectedStatus[manageIncident.id], label: selectedStatus[manageIncident.id] }
                      : null
                  }
                  onChange={(option) =>
                    setSelectedStatus((previous) => ({
                      ...previous,
                      [manageIncident.id]: option?.value,
                    }))
                  }
                />
              </section>

              <section className="manage-field-card">
                <label htmlFor={`manage-assignee-${manageIncident.id}`}>Assign maintenance team</label>
                <Select
                  inputId={`manage-assignee-${manageIncident.id}`}
                  isSearchable
                  isClearable
                  classNamePrefix="react-select"
                  options={maintenanceOptions}
                  value={maintenanceOptions.find((option) => option.value === selectedAssignee[manageIncident.id]) || null}
                  onChange={(option) =>
                    setSelectedAssignee((previous) => ({
                      ...previous,
                      [manageIncident.id]: option?.value || null,
                    }))
                  }
                />
                {!selectedAssignee[manageIncident.id] && getRecommendation(manageIncident) && (
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() =>
                      setSelectedAssignee((previous) => ({
                        ...previous,
                        [manageIncident.id]: getRecommendation(manageIncident).id,
                      }))
                    }
                  >
                    Use Suggested: {getRecommendation(manageIncident).name}
                  </button>
                )}
              </section>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={resolveChecklist.open}
        onClose={() =>
          setResolveChecklist({
            open: false,
            incidentId: null,
            closureNote: '',
            beforePhoto: null,
            afterPhoto: null,
          })
        }
        title={`Resolve Checklist - #${resolveChecklist.incidentId || ''}`}
        actions={
          <>
            <button
              type="button"
              className="ghost-button"
              onClick={() =>
                setResolveChecklist({
                  open: false,
                  incidentId: null,
                  closureNote: '',
                  beforePhoto: null,
                  afterPhoto: null,
                })
              }
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!resolveChecklist.closureNote.trim()) {
                  toast.error('Checklist incomplete', 'Add a closure note before resolving.');
                  return;
                }

                if (!resolveChecklist.beforePhoto) {
                  toast.error('Checklist incomplete', 'Upload a before photo before resolving.');
                  return;
                }

                updateIncidentStatus(resolveChecklist.incidentId);

                setResolveChecklist({
                  open: false,
                  incidentId: null,
                  closureNote: '',
                  beforePhoto: null,
                  afterPhoto: null,
                });
              }}
            >
              Complete Resolve
            </button>
          </>
        }
      >
        <div className="resolve-grid">
          <label htmlFor="closure-note">Closure Note</label>
          <textarea
            id="closure-note"
            rows={3}
            value={resolveChecklist.closureNote}
            onChange={(event) =>
              setResolveChecklist((previous) => ({
                ...previous,
                closureNote: event.target.value,
              }))
            }
          />

          <label htmlFor="before-photo">Before Photo (required)</label>
          <input
            id="before-photo"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setResolveChecklist((previous) => ({
                ...previous,
                beforePhoto: event.target.files?.[0] || null,
              }))
            }
          />

          <label htmlFor="after-photo">After Photo (optional)</label>
          <input
            id="after-photo"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setResolveChecklist((previous) => ({
                ...previous,
                afterPhoto: event.target.files?.[0] || null,
              }))
            }
          />
        </div>
      </Modal>

      <Modal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        title="Notification Center"
      >
        <div className="notification-list">
          {notifications.length === 0 && <p className="muted-small">No notifications yet.</p>}
          {notifications.map((item) => (
            <article key={item.id} className={`notification-item ${item.type}`}>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </article>
          ))}
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default AdminDashboardPage;
