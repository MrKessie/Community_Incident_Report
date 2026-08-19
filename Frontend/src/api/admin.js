import api from './axios';

export const adminApi = {
  getIncidents: (params) => api.get('/admin/incidents', { params }),
  getIncidentById: (id) => api.get(`/admin/incidents/${id}`),
  verifyIncident: (id, data) => api.put(`/admin/incidents/${id}/verify`, data),
  rejectIncident: (id, data) => api.put(`/admin/incidents/${id}/reject`, data),
  assignIncident: (id, data) => api.put(`/admin/incidents/${id}/assign`, data),
  reassignIncident: (id, data) => api.put(`/admin/incidents/${id}/reassign`, data),
  updateStatus: (id, data) => api.put(`/admin/incidents/${id}/status`, data),
  updatePriority: (id, data) => api.put(`/admin/incidents/${id}/priority`, data),
  addNote: (id, data) => api.post(`/admin/incidents/${id}/notes`, data),
  addPublicUpdate: (id, data) => api.post(`/admin/incidents/${id}/public-update`, data),
  markDuplicate: (id, data) => api.put(`/admin/incidents/${id}/duplicate`, data),
  closeIncident: (id, data) => api.put(`/admin/incidents/${id}/close`, data),
  exportCSV: () => api.get('/admin/incidents/export', { responseType: 'blob' }),

  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  changeRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  toggleActive: (id) => api.put(`/admin/users/${id}/toggle-active`),

  // Team Management
  getTeams: () => api.get('/admin/teams'),
  createTeam: (data) => api.post('/admin/teams', data),
  getTeamById: (id) => api.get(`/admin/teams/${id}`),
  updateTeam: (id, data) => api.put(`/admin/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/admin/teams/${id}`),
  addTeamMember: (id, data) => api.post(`/admin/teams/${id}/members`, data),
  removeTeamMember: (id, userId) => api.delete(`/admin/teams/${id}/members/${userId}`),
  assignTeamLeader: (id, data) => api.put(`/admin/teams/${id}/leader`, data),

  // Category Management
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Announcements
  getAnnouncements: () => api.get('/admin/announcements'),
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/admin/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),

  // Audit Logs
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};
