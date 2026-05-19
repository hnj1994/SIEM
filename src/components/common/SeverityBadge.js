import { jsx as _jsx } from "react/jsx-runtime";
export default function SeverityBadge({ severity, size = 'md' }) {
    const labels = {
        critical: 'CRITICAL',
        high: 'HIGH',
        medium: 'MEDIUM',
        low: 'LOW',
        info: 'INFO',
    };
    return (_jsx("span", { className: `tag severity-${severity}`, style: { fontSize: size === 'sm' ? 10 : 11 }, children: labels[severity] }));
}
