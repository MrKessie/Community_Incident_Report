import { create } from 'zustand';
import api, { setAuthToken } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    setAuthToken(token);
    set({ token, isAuthenticated: !!token });
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      setAuthToken(token);
      set({ user, token, isAuthenticated: true });
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        const firstValidationError = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        return {
          success: false,
          message: firstValidationError || data.message || 'Invalid credentials. Please check email and password.',
        };
      }
      
      // Fallback demo user if API backend is offline/unreachable
      const demoUser = {
        id: 99,
        name: email.split('@')[0] || 'Community User',
        email: email,
        role: email.includes('admin') ? 'admin' : (email.includes('team') || email.includes('captain') || email.includes('lead') ? 'response_team' : 'reporter'),
      };
      const token = 'demo-mobile-token';
      setAuthToken(token);
      set({ user: demoUser, token, isAuthenticated: true });
      await AsyncStorage.setItem('user', JSON.stringify(demoUser));
      return { success: true, user: demoUser, isDemo: true };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;
      setAuthToken(token);
      set({ user, token, isAuthenticated: true });
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        const firstValidationError = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        return {
          success: false,
          message: firstValidationError || data.message || 'Registration failed.',
        };
      }

      // Fallback demo registration if API backend is offline/unreachable
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'reporter',
      };
      const token = 'demo-mobile-token';
      setAuthToken(token);
      set({ user: newUser, token, isAuthenticated: true });
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, user: newUser, isDemo: true };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    setAuthToken(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuthToken(token);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
