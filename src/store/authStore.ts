import { create } from "zustand";
import type { User } from "../types/game";

const AUTH_KEY = "dax-user";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (partial: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null, remember: boolean) {
  if (user && remember) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,

  hydrate: () => {
    set({ user: loadUser() });
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      const remember = localStorage.getItem("dax-settings");
      const rememberMe = remember ? JSON.parse(remember).rememberMe !== false : true;
      saveUser(user, rememberMe);
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial };
    set({ user: updated });
    const settingsRaw = localStorage.getItem("dax-settings");
    const rememberMe = settingsRaw ? JSON.parse(settingsRaw).rememberMe !== false : true;
    saveUser(updated, rememberMe);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ user: null });
  },
}));
