import { useState, useEffect } from 'react';
import { incidentsApi } from '../api/incidents';
import { adminApi } from '../api/admin';
import { demoIncidents } from '../utils/demoData';

export function useIncidents(isAdmin = false) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await adminApi.getIncidents() : await incidentsApi.getOwnIncidents();
      setIncidents(res.data.data || res.data || []);
      setError(null);
    } catch (err) {
      console.warn('API error, falling back to demo incidents data:', err);
      setIncidents(demoIncidents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [isAdmin]);

  return { incidents, loading, error, refetch: fetchIncidents };
}
