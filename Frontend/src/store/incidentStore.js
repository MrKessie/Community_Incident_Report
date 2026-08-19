import { create } from 'zustand';

export const useIncidentStore = create((set) => ({
  incidents: [],
  currentIncident: null,
  filters: {
    status: '',
    severity: '',
    category_id: '',
    search: '',
  },
  pagination: { page: 1, total: 0 },

  setIncidents: (incidents) => set({ incidents }),
  setCurrentIncident: (incident) => set({ currentIncident: incident }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setPagination: (pagination) => set({ pagination }),
}));
