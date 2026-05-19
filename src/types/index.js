export function getRuleLevel(level) {
    if (level >= 13)
        return 'critical';
    if (level >= 10)
        return 'high';
    if (level >= 7)
        return 'medium';
    if (level >= 4)
        return 'low';
    return 'info';
}
export function getSeverityColor(severity) {
    const colors = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#f59e0b',
        low: '#10b981',
        info: '#3b82f6',
    };
    return colors[severity];
}
