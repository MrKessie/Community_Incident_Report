import { create } from 'zustand';
import api from '../services/api';
import { DEMO_ANNOUNCEMENTS } from '../utils/demoData';

export const useAnnouncementStore = create((set, get) => ({
  announcements: DEMO_ANNOUNCEMENTS,
  isLoading: false,

  fetchActive: async () => {
    try {
      const res = await api.get('/announcements/active');
      if (Array.isArray(res.data) && res.data.length > 0) {
        set({ announcements: res.data });
      }
    } catch (err) {
      // fallback
    }
  },

  createAnnouncement: async (data) => {
    try {
      const res = await api.post('/announcements', data);
      const newAnn = res.data.announcement;
      set((state) => ({ announcements: [newAnn, ...state.announcements] }));
      return newAnn;
    } catch (err) {
      const newAnn = { id: Date.now(), ...data, is_active: true, created_at: new Date().toISOString() };
      set((state) => ({ announcements: [newAnn, ...state.announcements] }));
      return newAnn;
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
    } catch (err) {
      // ignore
    } finally {
      set((state) => ({ announcements: state.announcements.filter(a => a.id !== id) }));
    }
  }
}));
