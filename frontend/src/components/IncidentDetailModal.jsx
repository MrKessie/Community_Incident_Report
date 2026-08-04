import Modal from './Modal';

function IncidentDetailModal({ incident, isOpen, onClose, buildPhotoUrl }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Incident #${incident?.id || ''}`}>
      {incident && (
        <div className="incident-detail-grid">
          <p>
            <strong>Status:</strong> {incident.status}
          </p>
          <p>
            <strong>Description:</strong> {incident.description}
          </p>
          <p>
            <strong>Coordinates:</strong> {incident.latitude}, {incident.longitude}
          </p>
          {incident.created_at && (
            <p>
              <strong>Reported:</strong> {new Date(incident.created_at).toLocaleString()}
            </p>
          )}
          {incident.photo_url && <img src={buildPhotoUrl(incident.photo_url)} alt="Incident" className="incident-photo detail" />}

          <div className="timeline-block">
            <h4>Status Timeline</h4>
            {(incident.status_history || []).length === 0 && <p className="muted-small">No history available.</p>}
            {(incident.status_history || []).length > 0 && (
              <ul className="status-timeline">
                {incident.status_history.map((entry) => (
                  <li key={`${incident.id}-${entry.updated_at}-${entry.status}`}>
                    <span className="timeline-dot" />
                    <div>
                      <p className="timeline-status">{entry.status}</p>
                      <p className="timeline-time">{new Date(entry.updated_at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default IncidentDetailModal;
