import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.login({ email, password });
          const { token, user } = res.data;
          localStorage.setItem('traveloop_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.register({ name, email, password });
          const { token, user } = res.data;
          localStorage.setItem('traveloop_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          const message = err.response?.data?.message
            || err.message
            || 'Registration failed. Please try again.';
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem('traveloop_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (user) => set({ user }),

      fetchMe: async () => {
        try {
          const res = await authAPI.getMe();
          set({ user: res.data.user });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'traveloop_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
