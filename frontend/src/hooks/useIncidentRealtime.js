import { useEffect, useRef } from 'react';
import apiClient from '../api/client';

function createSnapshot(incidents) {
  return (incidents || [])
    .map((incident) => `${incident.id}:${incident.status}:${incident.updated_at || ''}`)
    .sort()
    .join('|');
}

function useIncidentRealtime({ incidents, setIncidents, onUpdate, intervalMs = 20000, enabled = true }) {
  const snapshotRef = useRef(createSnapshot(incidents));

  useEffect(() => {
    snapshotRef.current = createSnapshot(incidents);
  }, [incidents]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let cancelled = false;

    async function refreshIncidents() {
      try {
        const response = await apiClient.get('/incidents');
        const nextIncidents = response.data.data || [];
        const nextSnapshot = createSnapshot(nextIncidents);

        if (cancelled || nextSnapshot === snapshotRef.current) {
          return;
        }

        snapshotRef.current = nextSnapshot;
        setIncidents(nextIncidents);
        onUpdate?.(nextIncidents);
      } catch {
        // Silent fail: realtime polling should not interrupt user actions.
      }
    }

    const timer = window.setInterval(refreshIncidents, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs, onUpdate, setIncidents]);
}

export default useIncidentRealtime;
