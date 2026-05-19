import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function StatCard({ title, value, subtitle, icon, color = '#3b82f6', trend, glow }) {
    return (_jsxs("div", { className: "card", style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            ...(glow ? { boxShadow: `0 0 20px ${color}33` } : {}),
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx("span", { style: { fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }, children: title }), _jsx("div", { style: {
                            width: 36, height: 36, borderRadius: 8,
                            background: `${color}1a`,
                            border: `1px solid ${color}33`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color,
                        }, children: icon })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }, children: value }), subtitle && _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }, children: subtitle })] }), trend && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4 }, children: [_jsxs("span", { style: {
                            fontSize: 11,
                            color: trend.value > 0 ? '#ef4444' : '#10b981',
                            fontWeight: 600,
                        }, children: [trend.value > 0 ? '↑' : '↓', " ", Math.abs(trend.value), "%"] }), _jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: trend.label })] }))] }));
}
