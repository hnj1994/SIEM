import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useAlertStore } from '@/store/alertStore';
import { generateMockAlerts } from '@/api/mockData';
import { getRuleLevel } from '@/types';
import SeverityBadge from '@/components/common/SeverityBadge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
export default function LiveAlertFeed() {
    const { liveAlerts, addLiveAlert, isLive } = useAlertStore();
    const navigate = useNavigate();
    const timerRef = useRef(null);
    useEffect(() => {
        if (!isLive) {
            if (timerRef.current)
                clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            const newAlert = generateMockAlerts(1)[0];
            newAlert.timestamp = new Date().toISOString();
            addLiveAlert(newAlert);
        }, 3000 + Math.random() * 4000);
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [isLive, addLiveAlert]);
    return (_jsxs("div", { className: "card", style: { height: 280, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, children: [_jsxs("div", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx(Zap, { size: 14, style: { color: '#f59e0b' } }), "Live Alert Feed"] }), isLive && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4 }, children: [_jsx("div", { style: { width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' } }), _jsx("span", { style: { fontSize: 10, color: '#10b981', fontWeight: 600 }, children: "STREAMING" })] }))] }), _jsx("div", { style: { flex: 1, overflowY: 'auto' }, children: liveAlerts.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 13 }, children: isLive ? 'Waiting for alerts...' : 'Live feed paused' })) : (liveAlerts.map((alert, i) => (_jsxs("div", { onClick: () => navigate(`/alerts/${alert.id}`), style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                        animation: i === 0 ? 'fadeIn 0.3s ease' : undefined,
                    }, children: [_jsx(SeverityBadge, { severity: getRuleLevel(alert.rule.level), size: "sm" }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("div", { style: { fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: alert.rule.description }), _jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: alert.agent.name })] }), _jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }, children: format(new Date(alert.timestamp), 'HH:mm:ss') })] }, alert.id + i)))) })] }));
}
