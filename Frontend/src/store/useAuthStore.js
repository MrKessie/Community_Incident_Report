import { create } from 'zustand';
import api from '../services/api';
import { DEMO_USERS } from '../utils/demoData';

const initialUser = JSON.parse(localStorage.getItem('cir_user') || localStorage.getItem('user_data') || 'null');
const initialToken = localStorage.getItem('cir_token') || localStorage.getItem('auth_token') || null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,

  setUser: (user, token) => {
    if (token) {
      localStorage.setItem('cir_token', token);
      localStorage.setItem('auth_token', token);
    }
    if (user) {
      localStorage.setItem('cir_user', JSON.stringify(user));
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    set({ user, token: token || get().token, isAuthenticated: true });
  },

  switchDemoRole: (roleKey) => {
    const selectedUser = DEMO_USERS[roleKey] || DEMO_USERS.admin;
    const token = `demo-token-${roleKey}`;
    localStorage.setItem('cir_token', token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('cir_user', JSON.stringify(selectedUser));
    localStorage.setItem('user_data', JSON.stringify(selectedUser));
    set({ user: selectedUser, token, isAuthenticated: true });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      get().setUser(user, token);
      set({ isLoading: false });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false });
      // Fallback demo login if API is unavailable
      const matchedRole = Object.keys(DEMO_USERS).find(k => DEMO_USERS[k].email === email) || 'admin';
      const demoUser = DEMO_USERS[matchedRole];
      get().setUser(demoUser, `demo-token-${matchedRole}`);
      return { success: true, user: demoUser, isDemo: true };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', userData);
      const { user, token } = res.data;
      get().setUser(user, token);
      set({ isLoading: false });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false });
      // Demo fallback
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'reporter',
        roles: ['reporter'],
      };
      get().setUser(newUser, 'demo-token-reporter');
      return { success: true, user: newUser, isDemo: true };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore offline logout errors
    } finally {
      localStorage.removeItem('cir_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('cir_user');
      localStorage.removeItem('user_data');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
