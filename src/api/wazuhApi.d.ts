import { WazuhAlert, Agent } from '@/types';
declare class WazuhApiClient {
    private client;
    private token;
    constructor();
    authenticate(username: string, password: string): Promise<string>;
    setToken(token: string): void;
    getAlerts(params?: {
        limit?: number;
        offset?: number;
        sort?: string;
        q?: string;
        level?: number;
    }): Promise<{
        alerts: WazuhAlert[];
        total: number;
    }>;
    getAgents(params?: {
        limit?: number;
        status?: string;
    }): Promise<{
        agents: Agent[];
        total: number;
    }>;
    getStats(): Promise<Record<string, unknown>>;
    getAgentSummary(): Promise<Record<string, number>>;
}
export declare const wazuhApi: WazuhApiClient;
export {};
