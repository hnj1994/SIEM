import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@/components/layout/Layout';
import { MOCK_AGENTS } from '@/api/mockData';
import { Monitor, Server, Apple, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useAlertStore } from '@/store/alertStore';
function PlatformIcon({ platform }) {
    if (platform === 'windows')
        return _jsx(Monitor, { size: 16, style: { color: '#3b82f6' } });
    if (platform === 'darwin')
        return _jsx(Apple, { size: 16, style: { color: '#94a3b8' } });
    return _jsx(Server, { size: 16, style: { color: '#10b981' } });
}
function StatusBadge({ status }) {
    const config = {
        active: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Active' },
        disconnected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Disconnected' },
        pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Pending' },
        never_connected: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', label: 'Never Connected' },
    }[status] || { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', label: status };
    return (_jsxs("span", { style: {
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 20,
            background: config.bg, border: `1px solid ${config.border}`,
            fontSize: 11, color: config.color, fontWeight: 600,
        }, children: [_jsx("div", { style: { width: 5, height: 5, borderRadius: '50%', background: config.color } }), config.label] }));
}
export default function Agents() {
    const { alerts } = useAlertStore();
    const activeCount = MOCK_AGENTS.filter(a => a.status === 'active').length;
    return (_jsx(Layout, { title: "Endpoint Agents", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }, children: [
                        { label: 'Total Agents', value: MOCK_AGENTS.length, color: '#3b82f6' },
                        { label: 'Active', value: activeCount, color: '#10b981' },
                        { label: 'Disconnected', value: MOCK_AGENTS.filter(a => a.status === 'disconnected').length, color: '#ef4444' },
                        { label: 'Pending', value: MOCK_AGENTS.filter(a => a.status === 'pending').length, color: '#f59e0b' },
                    ].map(s => (_jsxs("div", { className: "card", style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 28, fontWeight: 800, color: s.color }, children: s.value }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }, children: s.label })] }, s.label))) }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }, children: MOCK_AGENTS.map((agent) => {
                        const agentAlerts = alerts.filter(a => a.agent.name === agent.name).length;
                        return (_jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: {
                                                        width: 38, height: 38, borderRadius: 8,
                                                        background: 'var(--bg-secondary)',
                                                        border: '1px solid var(--border)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }, children: _jsx(PlatformIcon, { platform: agent.os.platform }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 14, fontWeight: 600 }, children: agent.name }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }, children: agent.ip })] })] }), _jsx(StatusBadge, { status: agent.status })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsx(Info, { label: "OS", value: agent.os.name }), _jsx(Info, { label: "Version", value: agent.version.replace('Wazuh ', '') }), _jsx(Info, { label: "ID", value: agent.id, mono: true }), _jsx(Info, { label: "Group", value: agent.group.join(', ') })] }), _jsxs("div", { style: {
                                        marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }, children: [_jsx(Clock, { size: 11 }), format(new Date(agent.lastKeepAlive), 'MMM dd HH:mm')] }), _jsxs("div", { style: {
                                                display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
                                                color: agentAlerts > 0 ? '#f97316' : 'var(--text-muted)',
                                            }, children: [_jsx(Shield, { size: 11 }), agentAlerts, " alerts"] })] })] }, agent.id));
                    }) })] }) }));
}
function Info({ label, value, mono }) {
    return (_jsxs("div", { children: [_jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }, children: label }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-secondary)', fontFamily: mono ? 'monospace' : undefined, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: value })] }));
}
