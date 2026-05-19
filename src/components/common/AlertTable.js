import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getRuleLevel } from '@/types';
import SeverityBadge from './SeverityBadge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
export default function AlertTable({ alerts, compact = false, limit }) {
    const navigate = useNavigate();
    const displayed = limit ? alerts.slice(0, limit) : alerts;
    return (_jsxs("div", { style: { overflowX: 'auto' }, children: [_jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '1px solid var(--border)' }, children: [_jsx("th", { style: { ...thStyle, width: 90 }, children: "Severity" }), _jsx("th", { style: { ...thStyle, width: 160 }, children: "Time" }), !compact && _jsx("th", { style: { ...thStyle, width: 80 }, children: "Rule ID" }), _jsx("th", { style: thStyle, children: "Description" }), _jsx("th", { style: { ...thStyle, width: 140 }, children: "Agent" }), !compact && _jsx("th", { style: { ...thStyle, width: 80 }, children: "Action" })] }) }), _jsx("tbody", { children: displayed.map((alert) => {
                            const severity = getRuleLevel(alert.rule.level);
                            return (_jsxs("tr", { className: "table-row", style: {
                                    borderBottom: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                }, onClick: () => navigate(`/alerts/${alert.id}`), children: [_jsx("td", { style: tdStyle, children: _jsx(SeverityBadge, { severity: severity, size: "sm" }) }), _jsx("td", { style: { ...tdStyle, ...monoStyle, fontSize: 11 }, children: format(new Date(alert.timestamp), compact ? 'HH:mm:ss' : 'MMM dd HH:mm:ss') }), !compact && (_jsx("td", { style: { ...tdStyle, ...monoStyle, color: 'var(--accent-blue)', fontSize: 12 }, children: alert.rule.id })), _jsxs("td", { style: { ...tdStyle, fontSize: 13, maxWidth: 300 }, children: [_jsx("div", { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: alert.rule.description }), alert.rule.mitre && (_jsx("div", { style: { fontSize: 10, color: 'var(--accent-purple)', marginTop: 2 }, children: alert.rule.mitre.technique.join(', ') }))] }), _jsxs("td", { style: { ...tdStyle, fontSize: 12 }, children: [_jsx("div", { style: { fontWeight: 500 }, children: alert.agent.name }), _jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: alert.agent.ip })] }), !compact && (_jsx("td", { style: tdStyle, children: _jsx(ChevronRight, { size: 14, style: { color: 'var(--text-muted)' } }) }))] }, alert.id));
                        }) })] }), displayed.length === 0 && (_jsx("div", { style: { textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 14 }, children: "No alerts match your current filters" }))] }));
}
const thStyle = {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
};
const tdStyle = {
    padding: '10px 12px',
    color: 'var(--text-primary)',
    verticalAlign: 'middle',
};
const monoStyle = {
    fontFamily: 'JetBrains Mono, monospace',
};
