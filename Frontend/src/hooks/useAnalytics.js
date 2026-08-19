import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analytics';

export function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [overview, category, status, severity, month, responseTimes, teamPerf, resRates] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getIncidentsByCategory(),
          analyticsApi.getIncidentsByStatus(),
          analyticsApi.getIncidentsBySeverity(),
          analyticsApi.getIncidentsByMonth(),
          analyticsApi.getResponseTimes(),
          analyticsApi.getTeamPerformance(),
          analyticsApi.getResolutionRates(),
        ]);
        setData({
          overview: overview.data,
          byCategory: category.data,
          byStatus: status.data,
          bySeverity: severity.data,
          byMonth: month.data,
          responseTimes: responseTimes.data,
          teamPerformance: teamPerf.data,
          resolutionRates: resRates.data,
        });
      } catch (err) {
        console.error('Failed to load analytics metrics:', err);
        setData({
          overview: { total_incidents: 0, pending_review: 0, active_dispatches: 0, resolved_total: 0 },
          byCategory: [],
          byStatus: [],
          bySeverity: [],
          byMonth: [],
          responseTimes: { avg_assignment_minutes: 0, avg_field_arrival_minutes: 0, avg_resolution_hours: 0, trend: [] },
          teamPerformance: [],
          resolutionRates: { total_incidents: 0, resolved_incidents: 0, resolution_rate_percentage: 0 },
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading };
}
