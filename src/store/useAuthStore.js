import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { access_token } = response.data;
          
          set({ token: access_token, isAuthenticated: true });
          
          // Fetch profile immediately after login
          await get().fetchProfile();
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (userData) => {
        try {
          await api.post('/users', {
            ...userData,
            avatar: userData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.name
          });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      fetchProfile: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: response.data });
        } catch (error) {
          console.error('Fetch profile failed:', error);
          get().logout();
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateAvatar: async (avatarUrl) => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await api.put(`/users/${user.id}`, { avatar: avatarUrl });
          set({ user: response.data });
          return true;
        } catch (error) {
          console.error('Update avatar failed:', error);
          throw error;
        }
      }
    }),
    {
      name: 'prime-store-auth', // Nama key di localStorage
    }
  )
);

export default useAuthStore;
