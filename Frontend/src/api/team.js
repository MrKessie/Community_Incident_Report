import api from './axios';

export const teamApi = {
  getAssignedIncidents: (params) => api.get('/team/incidents', { params }),
  getIncidentById: (id) => api.get(`/team/incidents/${id}`),
  acknowledgeIncident: (id) => api.put(`/team/incidents/${id}/acknowledge`),
  updateProgress: (id, formData) => api.put(`/team/incidents/${id}/update`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  resolveIncident: (id, data) => api.put(`/team/incidents/${id}/resolve`, data),
  uploadResponsePhotos: (id, formData) => api.post(`/team/incidents/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
