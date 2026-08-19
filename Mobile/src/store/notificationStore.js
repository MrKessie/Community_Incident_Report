import { create } from 'zustand';
import api from '../api/client';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.notifications) {
        set({
          notifications: res.data.notifications,
          unreadCount: res.data.unread_count ?? 0,
        });
      }
    } catch (e) {}
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (e) {}
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })),
      unreadCount: 0,
    }));
    try {
      await api.put('/notifications/read-all');
    } catch (e) {}
  },
}));
