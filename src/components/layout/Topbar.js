import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useAlertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store/authStore';
import { getRuleLevel } from '@/types';
import { format } from 'date-fns';
export default function Topbar({ title }) {
    const { theme, toggleTheme } = useSettingsStore();
    const { alerts, isLive, toggleLive } = useAlertStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const criticalAlerts = alerts.filter(a => getRuleLevel(a.rule.level) === 'critical').slice(0, 5);
    return (_jsxs("header", { style: {
            height: 56,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 16,
            flexShrink: 0,
            position: 'relative',
            zIndex: 5,
        }, children: [_jsx("div", { style: { flex: 1 }, children: _jsx("h1", { style: { fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }, children: title || 'Dashboard' }) }), _jsxs("div", { style: { position: 'relative', width: 280 }, children: [_jsx(Search, { size: 14, style: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } }), _jsx("input", { className: "input", style: { width: '100%', paddingLeft: 32, fontSize: 13 }, placeholder: "Search alerts, agents, rules...", value: search, onChange: (e) => setSearch(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && search) {
                                navigate(`/alerts?search=${encodeURIComponent(search)}`);
                                setSearch('');
                            }
                        } })] }), _jsxs("button", { onClick: toggleLive, style: {
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 6,
                    background: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(74,85,104,0.2)',
                    border: isLive ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
                    color: isLive ? '#10b981' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    transition: 'all 0.2s',
                }, children: [isLive ? _jsx(Wifi, { size: 13 }) : _jsx(WifiOff, { size: 13 }), isLive ? 'LIVE' : 'PAUSED'] }), _jsxs("div", { style: { position: 'relative' }, children: [_jsxs("button", { onClick: () => setShowNotifications(!showNotifications), style: {
                            position: 'relative', background: 'transparent', border: '1px solid var(--border)',
                            borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
                            transition: 'all 0.2s',
                        }, children: [_jsx(Bell, { size: 16 }), criticalAlerts.length > 0 && (_jsx("span", { style: {
                                    position: 'absolute', top: -4, right: -4,
                                    background: '#ef4444', color: 'white',
                                    borderRadius: '50%', width: 16, height: 16,
                                    fontSize: 10, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }, children: criticalAlerts.length }))] }), showNotifications && (_jsxs("div", { style: {
                            position: 'absolute', right: 0, top: 44, width: 340,
                            background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
                            borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            zIndex: 100, overflow: 'hidden',
                        }, children: [_jsx("div", { style: { padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }, children: "Recent Critical Alerts" }), criticalAlerts.map((alert) => (_jsxs("div", { onClick: () => { navigate(`/alerts/${alert.id}`); setShowNotifications(false); }, style: {
                                    padding: '10px 16px', borderBottom: '1px solid var(--border)',
                                    cursor: 'pointer', transition: 'background 0.15s',
                                }, onMouseEnter: e => (e.currentTarget.style.background = 'var(--bg-card-hover)'), onMouseLeave: e => (e.currentTarget.style.background = 'transparent'), children: [_jsx("div", { style: { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }, children: alert.rule.description }), _jsxs("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: [alert.agent.name, " \u2022 ", format(new Date(alert.timestamp), 'HH:mm:ss')] })] }, alert.id)))] }))] }), _jsx("button", { onClick: toggleTheme, style: {
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
                }, children: theme === 'dark' ? _jsx(Sun, { size: 16 }) : _jsx(Moon, { size: 16 }) })] }));
}
