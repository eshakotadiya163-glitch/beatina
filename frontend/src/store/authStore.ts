import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        try {
          await api.post('/users/logout');
        } catch (error) {
          console.error('Logout error', error);
        }
        set({ user: null });
        localStorage.removeItem('userInfo');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
