import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAlertStore } from '@/store/alertStore';
import { format, subHours } from 'date-fns';
export default function AlertTimeline() {
    const { alerts } = useAlertStore();
    // Group alerts by hour for last 24 hours
    const data = Array.from({ length: 24 }, (_, i) => {
        const hour = subHours(new Date(), 23 - i);
        const hourStart = hour.getTime();
        const hourEnd = hourStart + 3600000;
        const count = alerts.filter(a => {
            const t = new Date(a.timestamp).getTime();
            return t >= hourStart && t < hourEnd;
        }).length;
        return {
            time: format(hour, 'HH:mm'),
            alerts: count,
            critical: alerts.filter(a => {
                const t = new Date(a.timestamp).getTime();
                return t >= hourStart && t < hourEnd && a.rule.level >= 13;
            }).length,
        };
    });
    return (_jsxs("div", { className: "card", style: { height: 280 }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }, children: "Alert Timeline (24h)" }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(AreaChart, { data: data, margin: { top: 5, right: 10, left: -20, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "colorAlerts", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3b82f6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#3b82f6", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "colorCritical", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }), _jsx(XAxis, { dataKey: "time", tick: { fontSize: 10, fill: 'var(--text-muted)' }, tickLine: false, axisLine: false, interval: 3 }), _jsx(YAxis, { tick: { fontSize: 10, fill: 'var(--text-muted)' }, tickLine: false, axisLine: false }), _jsx(Tooltip, { contentStyle: {
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                fontSize: 12,
                                color: 'var(--text-primary)',
                            } }), _jsx(Area, { type: "monotone", dataKey: "alerts", stroke: "#3b82f6", fill: "url(#colorAlerts)", strokeWidth: 2, name: "Total" }), _jsx(Area, { type: "monotone", dataKey: "critical", stroke: "#ef4444", fill: "url(#colorCritical)", strokeWidth: 2, name: "Critical" })] }) })] }));
}
