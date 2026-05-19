import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AlertTable from '@/components/common/AlertTable';
import { useAlertStore } from '@/store/alertStore';
import { Filter, Download, RefreshCw, Search } from 'lucide-react';
export default function Alerts() {
    const { filters, setFilters, getFilteredAlerts } = useAlertStore();
    const [searchParams] = useSearchParams();
    const filteredAlerts = getFilteredAlerts();
    useEffect(() => {
        const search = searchParams.get('search');
        if (search)
            setFilters({ search });
    }, [searchParams]);
    const exportCSV = () => {
        const headers = ['Timestamp', 'Severity', 'Rule ID', 'Description', 'Agent', 'Agent IP'];
        const rows = filteredAlerts.map(a => [
            a.timestamp, a.rule.level, a.rule.id, a.rule.description, a.agent.name, a.agent.ip,
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `soc-alerts-${new Date().toISOString()}.csv`;
        link.click();
    };
    return (_jsx(Layout, { title: "Alert Management", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsx("div", { className: "card", style: { padding: '14px 20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }, children: [_jsx(Filter, { size: 14, style: { color: 'var(--text-muted)' } }), _jsxs("div", { style: { position: 'relative', flex: 1, minWidth: 200 }, children: [_jsx(Search, { size: 13, style: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } }), _jsx("input", { className: "input", style: { width: '100%', paddingLeft: 30, fontSize: 13 }, placeholder: "Search alerts...", value: filters.search, onChange: e => setFilters({ search: e.target.value }) })] }), _jsxs("select", { className: "input", style: { width: 140, fontSize: 13 }, value: filters.severity, onChange: e => setFilters({ severity: e.target.value }), children: [_jsx("option", { value: "all", children: "All Severity" }), _jsx("option", { value: "critical", children: "Critical" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "info", children: "Info" })] }), _jsxs("select", { className: "input", style: { width: 140, fontSize: 13 }, value: filters.timeRange, onChange: e => setFilters({ timeRange: e.target.value }), children: [_jsx("option", { value: "1h", children: "Last 1 Hour" }), _jsx("option", { value: "6h", children: "Last 6 Hours" }), _jsx("option", { value: "24h", children: "Last 24 Hours" }), _jsx("option", { value: "7d", children: "Last 7 Days" }), _jsx("option", { value: "30d", children: "Last 30 Days" })] }), _jsx("input", { className: "input", style: { width: 160, fontSize: 13 }, placeholder: "Filter by agent...", value: filters.agent, onChange: e => setFilters({ agent: e.target.value }) }), _jsxs("div", { style: { marginLeft: 'auto', display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: () => setFilters({ severity: 'all', agent: '', search: '', timeRange: '24h' }), className: "btn-secondary", style: { fontSize: 12 }, children: [_jsx(RefreshCw, { size: 12 }), " Reset"] }), _jsxs("button", { onClick: exportCSV, className: "btn-secondary", style: { fontSize: 12 }, children: [_jsx(Download, { size: 12 }), " Export CSV"] })] })] }) }), _jsxs("div", { className: "card", style: { padding: 0, overflow: 'hidden' }, children: [_jsx("div", { style: {
                                padding: '12px 20px', borderBottom: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }, children: _jsxs("span", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: ["Showing ", _jsx("strong", { style: { color: 'var(--text-primary)' }, children: filteredAlerts.length.toLocaleString() }), " alerts"] }) }), _jsx(AlertTable, { alerts: filteredAlerts })] })] }) }));
}
