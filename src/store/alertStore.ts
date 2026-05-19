import { create } from 'zustand';
import { WazuhAlert, SeverityLevel, getRuleLevel } from '@/types';
import { MOCK_ALERTS } from '@/api/mockData';

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

export const useAlertStore = create<AlertState>()((set, get) => ({
  alerts: MOCK_ALERTS,
  liveAlerts: [],
  filters: {
    severity: 'all',
    agent: '',
    search: '',
    timeRange: '24h',
  },
  selectedAlert: null,
  isLive: true,

  setAlerts: (alerts) => set({ alerts }),

  addLiveAlert: (alert) =>
    set((state) => ({
      liveAlerts: [alert, ...state.liveAlerts].slice(0, 50),
      alerts: [alert, ...state.alerts],
    })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setSelectedAlert: (alert) => set({ selectedAlert: alert }),

  toggleLive: () => set((state) => ({ isLive: !state.isLive })),

  getFilteredAlerts: () => {
    const { alerts, filters } = get();
    const now = new Date();
    const timeRangeMs = {
      '1h': 3600000,
      '6h': 21600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000,
    }[filters.timeRange];

    return alerts.filter((alert) => {
      const alertTime = new Date(alert.timestamp).getTime();
      if (now.getTime() - alertTime > timeRangeMs) return false;
      if (filters.severity !== 'all' && getRuleLevel(alert.rule.level) !== filters.severity) return false;
      if (filters.agent && !alert.agent.name.includes(filters.agent)) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !alert.rule.description.toLowerCase().includes(search) &&
          !alert.agent.name.toLowerCase().includes(search) &&
          !alert.rule.id.includes(search)
        )
          return false;
      }
      return true;
    });
  },
}));
