import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, AlertTriangle, Search, Map, MessageSquare, Activity, FileText, Settings, Users, ChevronLeft, ChevronRight, LogOut, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: Activity, label: 'Incidents', path: '/incidents' },
    { icon: Search, label: 'Threat Hunting', path: '/hunting' },
    { icon: Map, label: 'MITRE ATT&CK', path: '/mitre' },
    { icon: MessageSquare, label: 'AI Copilot', path: '/chat' },
    { icon: Users, label: 'Agents', path: '/agents' },
    { icon: CheckSquare, label: 'Compliance', path: '/compliance' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuthStore();
    const location = useLocation();
    return (_jsxs("aside", { style: {
            width: collapsed ? 60 : 220,
            minWidth: collapsed ? 60 : 220,
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease, min-width 0.3s ease',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10,
        }, children: [_jsxs("div", { style: {
                    padding: '20px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderBottom: '1px solid var(--border)',
                    minHeight: 64,
                }, children: [_jsx("div", { style: {
                            width: 32, height: 32, borderRadius: 8,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, boxShadow: '0 0 12px rgba(59,130,246,0.4)',
                        }, children: _jsx(Shield, { size: 18, color: "white" }) }), !collapsed && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }, children: "SOC Nexus" }), _jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }, children: "Security Platform" })] }))] }), !collapsed && (_jsx("div", { style: { padding: '8px 14px' }, children: _jsxs("div", { style: {
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: 6,
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }, children: [_jsx("div", { style: {
                                width: 6, height: 6, borderRadius: '50%',
                                background: '#10b981',
                                boxShadow: '0 0 6px #10b981',
                                animation: 'pulse 2s infinite',
                            } }), _jsx("span", { style: { fontSize: 11, color: '#10b981', fontWeight: 600 }, children: "LIVE MONITORING" })] }) })), _jsx("nav", { style: { flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }, children: navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (_jsxs(NavLink, { to: item.path, className: "nav-item", style: {
                            ...(isActive ? {
                                background: 'rgba(59,130,246,0.15)',
                                color: '#3b82f6',
                                borderLeft: '2px solid #3b82f6',
                            } : {}),
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            paddingLeft: collapsed ? 0 : 14,
                            marginBottom: 2,
                        }, title: collapsed ? item.label : undefined, children: [_jsx(item.icon, { size: 18, style: { flexShrink: 0 } }), !collapsed && _jsx("span", { children: item.label })] }, item.path));
                }) }), !collapsed && (_jsxs("div", { style: {
                    padding: '12px 14px',
                    borderTop: '1px solid var(--border)',
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }, children: [_jsx("div", { style: {
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 13, fontWeight: 600, color: 'white', flexShrink: 0,
                                }, children: user?.username?.[0]?.toUpperCase() || 'A' }), _jsxs("div", { style: { overflow: 'hidden' }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: user?.username }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }, children: user?.role })] })] }), _jsxs("button", { onClick: logout, className: "btn-secondary", style: { width: '100%', justifyContent: 'center', fontSize: 12 }, children: [_jsx(LogOut, { size: 14 }), " Sign Out"] })] })), _jsx("button", { onClick: () => setCollapsed(!collapsed), style: {
                    position: 'absolute',
                    right: -12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 24, height: 24,
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20,
                    transition: 'all 0.2s',
                }, children: collapsed ? _jsx(ChevronRight, { size: 12 }) : _jsx(ChevronLeft, { size: 12 }) })] }));
}
