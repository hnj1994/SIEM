import axios, { AxiosInstance } from 'axios';
import { WazuhAlert, Agent } from '@/types';

const BASE_URL = import.meta.env.VITE_WAZUH_API_URL || 'https://10.0.0.4:55000';

class WazuhApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/wazuh',
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          localStorage.removeItem('wazuh_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async authenticate(username: string, password: string): Promise<string> {
    const credentials = btoa(`${username}:${password}`);
    const response = await this.client.post('/security/user/authenticate', null, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    this.token = response.data.data.token;
    if (this.token) {
      localStorage.setItem('wazuh_token', this.token);
    }
    return this.token!;
  }

  setToken(token: string) {
    this.token = token;
  }

  async getAlerts(params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    q?: string;
    level?: number;
  }): Promise<{ alerts: WazuhAlert[]; total: number }> {
    const response = await this.client.get('/alerts', { params: { ...params, limit: params?.limit || 100 } });
    return {
      alerts: response.data.data?.affected_items || [],
      total: response.data.data?.total_affected_items || 0,
    };
  }

  async getAgents(params?: { limit?: number; status?: string }): Promise<{ agents: Agent[]; total: number }> {
    const response = await this.client.get('/agents', { params });
    const items = response.data.data?.affected_items || [];
    const agents: Agent[] = items.map((a: Record<string, unknown>) => ({
      id: a.id as string,
      name: a.name as string,
      ip: a.ip as string,
      os: a.os || { name: 'Unknown', version: '', platform: 'linux' },
      status: a.status as Agent['status'],
      version: a.version as string,
      lastKeepAlive: a.lastKeepAlive as string,
      registerIP: a.registerIP as string,
      group: (a.group as string[]) || ['default'],
    }));
    return { agents, total: response.data.data?.total_affected_items || 0 };
  }

  async getStats(): Promise<Record<string, unknown>> {
    const response = await this.client.get('/manager/stats/hourly');
    return response.data.data || {};
  }

  async getAgentSummary(): Promise<Record<string, number>> {
    const response = await this.client.get('/agents/summary/status');
    return response.data.data || {};
  }
}

export const wazuhApi = new WazuhApiClient();
