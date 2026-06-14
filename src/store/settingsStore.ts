import { create } from "zustand";

interface SettingsStore {
  darkMode: boolean;
  soundVolume: number;
  colorblindMode: boolean;
  fontSize: "normal" | "large";
  rememberMe: boolean;
  setDarkMode: (v: boolean) => void;
  setSoundVolume: (v: number) => void;
  setColorblindMode: (v: boolean) => void;
  setFontSize: (v: "normal" | "large") => void;
  setRememberMe: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  darkMode: true,
  soundVolume: 70,
  colorblindMode: false,
  fontSize: "normal",
  rememberMe: true,
  setDarkMode: (v) => set({ darkMode: v }),
  setSoundVolume: (v) => set({ soundVolume: v }),
  setColorblindMode: (v) => set({ colorblindMode: v }),
  setFontSize: (v) => set({ fontSize: v }),
  setRememberMe: (v) => set({ rememberMe: v }),
}));
