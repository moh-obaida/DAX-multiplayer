import { create } from "zustand";

export interface SettingsState {
  darkMode: boolean;
  soundVolume: number;
  colorblindMode: boolean;
  fontSize: "normal" | "large";
  rememberMe: boolean;
}

interface SettingsStore extends SettingsState {
  setDarkMode: (v: boolean) => void;
  setSoundVolume: (v: number) => void;
  setColorblindMode: (v: boolean) => void;
  setFontSize: (v: "normal" | "large") => void;
  setRememberMe: (v: boolean) => void;
  resetPreferences: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = "dax-settings";

const defaults: SettingsState = {
  darkMode: true,
  soundVolume: 70,
  colorblindMode: false,
  fontSize: "normal",
  rememberMe: true,
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

function saveSettings(state: SettingsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function applySettingsToDocument(state: SettingsState) {
  const root = document.documentElement;
  root.classList.toggle("dax-light-mode", !state.darkMode);
  root.classList.toggle("dax-font-large", state.fontSize === "large");
  root.classList.toggle("dax-colorblind", state.colorblindMode);
  root.dataset.soundVolume = String(state.soundVolume);
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaults,

  hydrate: () => {
    const loaded = loadSettings();
    set(loaded);
    applySettingsToDocument(loaded);
  },

  setDarkMode: (v) => {
    set({ darkMode: v });
    const state = { ...get(), darkMode: v };
    saveSettings(state);
    applySettingsToDocument(state);
  },

  setSoundVolume: (v) => {
    set({ soundVolume: v });
    const state = { ...get(), soundVolume: v };
    saveSettings(state);
    applySettingsToDocument(state);
  },

  setColorblindMode: (v) => {
    set({ colorblindMode: v });
    const state = { ...get(), colorblindMode: v };
    saveSettings(state);
    applySettingsToDocument(state);
  },

  setFontSize: (v) => {
    set({ fontSize: v });
    const state = { ...get(), fontSize: v };
    saveSettings(state);
    applySettingsToDocument(state);
  },

  setRememberMe: (v) => {
    set({ rememberMe: v });
    saveSettings({ ...get(), rememberMe: v });
  },

  resetPreferences: () => {
    set(defaults);
    saveSettings(defaults);
    applySettingsToDocument(defaults);
  },
}));
