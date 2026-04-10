import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: any | null;
  role: 'employer' | 'worker';
  language: string;
  setUser: (user: any) => void;
  setRole: (role: 'employer' | 'worker') => void;
  setLanguage: (lang: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      role: 'employer',
      language: 'EN',
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setLanguage: (language) => set({ language }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
