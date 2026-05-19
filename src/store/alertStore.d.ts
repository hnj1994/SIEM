import { WazuhAlert, SeverityLevel } from '@/types';
interface AlertFilters {
    severity: SeverityLevel | 'all';
    agent: string;
    search: string;
    timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
}
interface AlertState {
    alerts: WazuhAlert[];
    liveAlerts: WazuhAlert[];
    filters: AlertFilters;
    selectedAlert: WazuhAlert | null;
    isLive: boolean;
    setAlerts: (alerts: WazuhAlert[]) => void;
    addLiveAlert: (alert: WazuhAlert) => void;
    setFilters: (filters: Partial<AlertFilters>) => void;
    setSelectedAlert: (alert: WazuhAlert | null) => void;
    toggleLive: () => void;
    getFilteredAlerts: () => WazuhAlert[];
}
export declare const useAlertStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AlertState>>;
export {};
