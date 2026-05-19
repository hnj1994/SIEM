import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wazuhApi } from '@/api/wazuhApi';
export const useAuthStore = create()(persist((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            // Try real Wazuh auth first
            const token = await wazuhApi.authenticate(username, password);
            const user = {
                id: '1',
                username,
                email: `${username}@soc.local`,
                role: username === 'admin' ? 'admin' : 'analyst',
                tenant: 'default',
            };
            set({ user, token, isAuthenticated: true, isLoading: false, error: null });
        }
        catch {
            // Fallback: demo mode login
            const demoUsers = {
                admin: { id: '1', username: 'admin', email: 'admin@soc.local', role: 'admin', tenant: 'default' },
                analyst: { id: '2', username: 'analyst', email: 'analyst@soc.local', role: 'analyst', tenant: 'default' },
                viewer: { id: '3', username: 'viewer', email: 'viewer@soc.local', role: 'viewer', tenant: 'default' },
            };
            if (demoUsers[username] && password === 'demo123') {
                set({ user: demoUsers[username], token: 'demo-token', isAuthenticated: true, isLoading: false, error: null });
            }
            else {
                set({ isLoading: false, error: 'Invalid credentials. Try demo credentials: admin/demo123' });
            }
        }
    },
    logout: () => {
        localStorage.removeItem('wazuh_token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
    },
    clearError: () => set({ error: null }),
}), {
    name: 'soc-auth',
    partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
}));
