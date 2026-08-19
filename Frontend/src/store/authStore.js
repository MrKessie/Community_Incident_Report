import { create } from 'zustand';

const initialToken = localStorage.getItem('cir_token') || localStorage.getItem('auth_token') || null;
const initialUser = JSON.parse(localStorage.getItem('cir_user') || localStorage.getItem('user_data') || 'null');

export const useAuthStore = create((set) => ({
  user: initialUser,
  token: initialToken,
  role: initialUser?.role || 'admin',
  isAuthenticated: !!initialToken,

  login: (user, token) => {
    if (token) {
      localStorage.setItem('cir_token', token);
      localStorage.setItem('auth_token', token);
    }
    if (user) {
      localStorage.setItem('cir_user', JSON.stringify(user));
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    set({ user, token, role: user?.role, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('cir_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('cir_user');
    localStorage.removeItem('user_data');
    set({ user: null, token: null, role: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
    set({ user, role: user.role });
  },

  setRole: (role) => {
    const roleNames = {
      super_admin: 'Super Admin',
      admin: 'System Admin',
      response_team: 'Captain David Vance',
      reporter: 'Alex Morgan',
    };
    const updatedUser = {
      id: 1,
      name: roleNames[role] || 'User',
      email: `${role}@community.com`,
      role: role,
    };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    set({ user: updatedUser, role: role });
  },
}));
