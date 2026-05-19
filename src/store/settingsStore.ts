import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light';
  useMockData: boolean;
  wazuhUrl: string;
  ollamaUrl: string;
  ollamaModel: string;
  refreshInterval: number;
  toggleTheme: () => void;
  setUseMockData: (value: boolean) => void;
  updateSettings: (settings: Partial<Omit<SettingsState, 'toggleTheme' | 'setUseMockData' | 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      useMockData: true,
      wazuhUrl: import.meta.env.VITE_WAZUH_API_URL || 'https://10.0.0.4:55000',
      ollamaUrl: import.meta.env.VITE_OLLAMA_API_URL || 'http://10.0.0.4:11434',
      ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || 'llama3',
      refreshInterval: 30,

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setUseMockData: (value) => set({ useMockData: value }),

      updateSettings: (settings) => set(settings),
    }),
    { name: 'soc-settings' }
  )
);
