import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  plan: 'free' | 'standard' | 'premium';
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        set({ user: data.user, token: data.token });
      },

      register: async (name, email, password, role) => {
        const { data } = await api.post('/api/auth/register', { name, email, password, role });
        localStorage.setItem('token', data.token);
        set({ user: data.user, token: data.token });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
