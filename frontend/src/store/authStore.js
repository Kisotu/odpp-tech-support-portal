import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: !!token });
      },
      
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      hasRole: (role) => {
        const user = get().user;
        if (!user) return false;
        if (role === 'admin') return user.role === 'admin';
        if (role === 'ict_officer') return ['admin', 'ict_officer'].includes(user.role);
        return true;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const hasToken = !!state.token;
        state.isAuthenticated = hasToken;
      },
    }
  )
);
