import api from './axios';

export const incidentsApi = {
  getOwnIncidents: (params) => api.get('/incidents', { params }),
  createIncident: (formData) => api.post('/incidents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  createAnonymousIncident: (formData) => api.post('/auth/anonymous-report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getIncidentById: (id) => api.get(`/incidents/${id}`),
  updateIncident: (id, data) => api.put(`/incidents/${id}`, data),
  deleteIncident: (id) => api.delete(`/incidents/${id}`),
  uploadMedia: (id, formData) => api.post(`/incidents/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMedia: (id, mediaId) => api.delete(`/incidents/${id}/media/${mediaId}`),
  getTimeline: (id) => api.get(`/incidents/${id}/timeline`),
  submitFeedback: (id, data) => api.post(`/incidents/${id}/feedback`, data),
};
