import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAlertStore } from '@/store/alertStore';
export default function TopHostsChart() {
    const { alerts } = useAlertStore();
    const hostCounts = alerts.slice(0, 500).reduce((acc, alert) => {
        acc[alert.agent.name] = (acc[alert.agent.name] || 0) + 1;
        return acc;
    }, {});
    const data = Object.entries(hostCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([name, count], i) => ({ name, count, rank: i + 1 }));
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#64748b'];
    return (_jsxs("div", { className: "card", style: { height: 280 }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }, children: "Top Attacked Hosts" }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(BarChart, { data: data, layout: "vertical", margin: { top: 0, right: 10, left: -10, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)", horizontal: false }), _jsx(XAxis, { type: "number", tick: { fontSize: 10, fill: 'var(--text-muted)' }, tickLine: false, axisLine: false }), _jsx(YAxis, { type: "category", dataKey: "name", tick: { fontSize: 11, fill: 'var(--text-secondary)' }, tickLine: false, axisLine: false, width: 110 }), _jsx(Tooltip, { contentStyle: {
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                fontSize: 12,
                                color: 'var(--text-primary)',
                            } }), _jsx(Bar, { dataKey: "count", radius: [0, 4, 4, 0], children: data.map((_, i) => _jsx(Cell, { fill: colors[i] || '#3b82f6' }, i)) })] }) })] }));
}
