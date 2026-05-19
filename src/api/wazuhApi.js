import axios from 'axios';
const BASE_URL = import.meta.env.VITE_WAZUH_API_URL || 'https://10.0.0.4:55000';
class WazuhApiClient {
    constructor() {
        this.token = null;
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
        this.client.interceptors.response.use((response) => response, async (error) => {
            if (error.response?.status === 401) {
                this.token = null;
                localStorage.removeItem('wazuh_token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    async authenticate(username, password) {
        const credentials = btoa(`${username}:${password}`);
        const response = await this.client.post('/security/user/authenticate', null, {
            headers: { Authorization: `Basic ${credentials}` },
        });
        this.token = response.data.data.token;
        if (this.token) {
            localStorage.setItem('wazuh_token', this.token);
        }
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }
    async getAlerts(params) {
        const response = await this.client.get('/alerts', { params: { ...params, limit: params?.limit || 100 } });
        return {
            alerts: response.data.data?.affected_items || [],
            total: response.data.data?.total_affected_items || 0,
        };
    }
    async getAgents(params) {
        const response = await this.client.get('/agents', { params });
        const items = response.data.data?.affected_items || [];
        const agents = items.map((a) => ({
            id: a.id,
            name: a.name,
            ip: a.ip,
            os: a.os || { name: 'Unknown', version: '', platform: 'linux' },
            status: a.status,
            version: a.version,
            lastKeepAlive: a.lastKeepAlive,
            registerIP: a.registerIP,
            group: a.group || ['default'],
        }));
        return { agents, total: response.data.data?.total_affected_items || 0 };
    }
    async getStats() {
        const response = await this.client.get('/manager/stats/hourly');
        return response.data.data || {};
    }
    async getAgentSummary() {
        const response = await this.client.get('/agents/summary/status');
        return response.data.data || {};
    }
}
export const wazuhApi = new WazuhApiClient();
