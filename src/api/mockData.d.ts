import { WazuhAlert, Agent, Incident, DashboardStats } from '@/types';
export declare function generateMockAlerts(count?: number): WazuhAlert[];
export declare function generateMockAgents(): Agent[];
export declare function generateMockIncidents(): Incident[];
export declare function generateDashboardStats(): DashboardStats;
export declare const MOCK_ALERTS: WazuhAlert[];
export declare const MOCK_AGENTS: Agent[];
export declare const MOCK_INCIDENTS: Incident[];
export declare const MOCK_STATS: DashboardStats;
