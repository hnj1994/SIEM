import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAlertStore } from '@/store/alertStore';
import { getRuleLevel } from '@/types';
const COLORS = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981',
    info: '#3b82f6',
};
export default function AlertSeverityChart() {
    const { alerts } = useAlertStore();
    const counts = alerts.slice(0, 500).reduce((acc, alert) => {
        const level = getRuleLevel(alert.rule.level);
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});
    const data = Object.entries(counts)
        .map(([name, value]) => ({ name: name.toUpperCase(), value, color: COLORS[name] }))
        .sort((a, b) => b.value - a.value);
    return (_jsxs("div", { className: "card", style: { height: 280 }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }, children: "Alert Severity Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 85, paddingAngle: 3, dataKey: "value", children: data.map((entry, index) => (_jsx(Cell, { fill: entry.color, stroke: "transparent" }, index))) }), _jsx(Tooltip, { contentStyle: {
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                color: 'var(--text-primary)',
                                fontSize: 12,
                            } }), _jsx(Legend, { iconType: "circle", iconSize: 8, formatter: (value) => _jsx("span", { style: { fontSize: 11, color: 'var(--text-secondary)' }, children: value }) })] }) })] }));
}
