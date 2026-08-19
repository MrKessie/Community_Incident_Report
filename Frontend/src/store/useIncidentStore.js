import { create } from 'zustand';
import api from '../services/api';
import { DEMO_INCIDENTS, DEMO_CATEGORIES, DEMO_TEAMS } from '../utils/demoData';

export const useIncidentStore = create((set, get) => ({
  incidents: DEMO_INCIDENTS,
  categories: DEMO_CATEGORIES,
  teams: DEMO_TEAMS,
  selectedIncident: null,
  filters: {
    status: '',
    severity: '',
    category_id: '',
    search: '',
  },
  isLoading: false,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  fetchIncidents: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/incidents', { params: get().filters });
      const data = res.data.data || res.data;
      if (Array.isArray(data)) {
        set({ incidents: data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      // Keep demo incidents on offline fallback
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (Array.isArray(res.data) && res.data.length > 0) {
        set({ categories: res.data });
      }
    } catch (err) {
      // ignore
    }
  },

  fetchTeams: async () => {
    try {
      const res = await api.get('/teams');
      if (Array.isArray(res.data) && res.data.length > 0) {
        set({ teams: res.data });
      }
    } catch (err) {
      // ignore
    }
  },

  createIncident: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/incidents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newInc = res.data.incident;
      set((state) => ({ incidents: [newInc, ...state.incidents], isLoading: false }));
      return newInc;
    } catch (err) {
      // Demo store insert fallback
      const cat = get().categories.find(c => String(c.id) === String(formData.get ? formData.get('category_id') : formData.category_id)) || get().categories[0];
      const newInc = {
        id: Date.now(),
        reference_number: `INC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        title: formData.get ? formData.get('title') : formData.title,
        description: formData.get ? formData.get('description') : formData.description,
        category_id: cat.id,
        category: cat,
        is_anonymous: formData.get ? formData.get('is_anonymous') === 'true' : !!formData.is_anonymous,
        severity: (formData.get ? formData.get('severity') : formData.severity) || 'medium',
        status: 'submitted',
        latitude: parseFloat(formData.get ? formData.get('latitude') : formData.latitude) || 40.7128,
        longitude: parseFloat(formData.get ? formData.get('longitude') : formData.longitude) || -74.0060,
        address: (formData.get ? formData.get('address') : formData.address) || 'Community Location',
        incident_date: new Date().toISOString(),
        reported_at: new Date().toISOString(),
        updates: [],
        status_histories: [{
          id: Date.now(),
          previous_status: 'none',
          new_status: 'submitted',
          reason: 'Reported by citizen',
          created_at: new Date().toISOString()
        }]
      };

      set((state) => ({ incidents: [newInc, ...state.incidents], isLoading: false }));
      return newInc;
    }
  },

  updateIncidentDetails: async (incidentId, payload) => {
    try {
      const res = await api.put(`/incidents/${incidentId}`, payload);
      const updated = res.data?.incident || res.data?.data;
      if (updated) {
        set((state) => ({
          incidents: state.incidents.map((inc) => (inc.id === incidentId ? { ...inc, ...updated } : inc)),
        }));
      }
      return updated;
    } catch (err) {
      set((state) => ({
        incidents: state.incidents.map((inc) => (inc.id === incidentId ? { ...inc, ...payload } : inc)),
      }));
      throw err;
    }
  },

  updateIncidentStatus: async (incidentId, newStatus, reason) => {
    try {
      await api.post(`/incidents/${incidentId}/updates`, { message: reason, new_status: newStatus });
    } catch (err) {
      // Local state update fallback
    } finally {
      set((state) => ({
        incidents: state.incidents.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: newStatus,
              status_histories: [
                ...(inc.status_histories || []),
                { id: Date.now(), previous_status: inc.status, new_status: newStatus, reason, created_at: new Date().toISOString() }
              ],
              updates: [
                { id: Date.now(), update_type: 'status_change', previous_status: inc.status, new_status: newStatus, message: reason, is_public: true, created_at: new Date().toISOString(), updater: { name: 'Current User' } },
                ...(inc.updates || [])
              ]
            };
          }
          return inc;
        })
      }));
    }
  },

  verifyIncident: async (incidentId, action, reason, severity) => {
    const newStatus = action === 'verify' ? 'verified' : 'rejected';
    try {
      await api.post(`/incidents/${incidentId}/verify`, { action, reason, severity });
    } catch (err) {
      // Local fallback
    } finally {
      set((state) => ({
        incidents: state.incidents.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: newStatus,
              severity: severity || inc.severity,
              rejection_reason: action === 'reject' ? reason : null,
              admin_notes: reason || inc.admin_notes,
            };
          }
          return inc;
        })
      }));
    }
  },

  assignTeam: async (incidentId, teamId, notes) => {
    const team = get().teams.find(t => t.id === teamId);
    try {
      await api.post(`/incidents/${incidentId}/assign`, { team_id: teamId, notes });
    } catch (err) {
      // Local fallback
    } finally {
      set((state) => ({
        incidents: state.incidents.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: 'assigned',
              assigned_at: new Date().toISOString(),
              active_assignment: { id: Date.now(), team_id: teamId, team, assigned_at: new Date().toISOString() }
            };
          }
          return inc;
        })
      }));
    }
  },

  markDuplicate: async (incidentId, targetId) => {
    try {
      await api.post(`/incidents/${incidentId}/duplicate`, { duplicate_of_id: targetId });
    } catch (err) {
      // Local fallback
    } finally {
      set((state) => ({
        incidents: state.incidents.map((inc) => {
          if (inc.id === incidentId) {
            return { ...inc, is_duplicate: true, duplicate_of: targetId, status: 'closed' };
          }
          return inc;
        })
      }));
    }
  },

  submitFeedback: async (incidentId, feedbackData) => {
    try {
      await api.post(`/incidents/${incidentId}/feedback`, feedbackData);
    } catch (err) {
      // Local fallback
    } finally {
      set((state) => ({
        incidents: state.incidents.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              feedback: { id: Date.now(), ...feedbackData, submitted_at: new Date().toISOString() }
            };
          }
          return inc;
        })
      }));
    }
  }
}));
