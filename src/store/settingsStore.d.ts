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
export declare const useSettingsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SettingsState>, "setState" | "persist"> & {
    setState(partial: SettingsState | Partial<SettingsState> | ((state: SettingsState) => SettingsState | Partial<SettingsState>), replace?: false): unknown;
    setState(state: SettingsState | ((state: SettingsState) => SettingsState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SettingsState, SettingsState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SettingsState) => void) => () => void;
        onFinishHydration: (fn: (state: SettingsState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SettingsState, SettingsState, unknown>>;
    };
}>;
export {};
