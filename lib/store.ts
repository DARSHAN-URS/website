import { create } from 'zustand';

interface UserState {
  user: any | null;
  role: 'employer' | 'worker';
  setUser: (user: any) => void;
  setRole: (role: 'employer' | 'worker') => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  role: 'employer',
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  logout: () => set({ user: null }),
}));
