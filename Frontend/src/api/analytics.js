import api from './axios';

export const analyticsApi = {
  getOverview: (params) => api.get('/admin/analytics/overview', { params }),
  getIncidentsByCategory: () => api.get('/admin/analytics/incidents-by-category'),
  getIncidentsByStatus: () => api.get('/admin/analytics/incidents-by-status'),
  getIncidentsBySeverity: () => api.get('/admin/analytics/incidents-by-severity'),
  getIncidentsByMonth: () => api.get('/admin/analytics/incidents-by-month'),
  getResponseTimes: () => api.get('/admin/analytics/response-times'),
  getTeamPerformance: () => api.get('/admin/analytics/team-performance'),
  getResolutionRates: () => api.get('/admin/analytics/resolution-rates'),
  getMapData: () => api.get('/admin/analytics/map-data'),
};
