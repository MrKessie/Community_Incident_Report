import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, token, role, isAuthenticated, login, logout, updateUser, setRole } = useAuthStore();
  return { user, token, role, isAuthenticated, login, logout, updateUser, setRole };
}
