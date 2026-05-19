import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { FileText, Download, Brain, Calendar, Shield, Activity } from 'lucide-react';
import { useAlertStore } from '@/store/alertStore';
import { getRuleLevel } from '@/types';
import { generateIncidentSummary } from '@/api/ollamaApi';
import { MOCK_AGENTS, MOCK_INCIDENTS } from '@/api/mockData';
import ReactMarkdown from 'react-markdown';
const TEMPLATES = [
    { id: 'daily', label: 'Daily SOC Report', icon: _jsx(Calendar, { size: 16 }), desc: 'End-of-day security summary' },
    { id: 'weekly', label: 'Weekly Threat Summary', icon: _jsx(Shield, { size: 16 }), desc: 'Week-over-week threat analysis' },
    { id: 'incident', label: 'Incident Report', icon: _jsx(Activity, { size: 16 }), desc: 'Detailed incident narrative' },
];
export default function Reports() {
    const { alerts } = useAlertStore();
    const [selectedTemplate, setSelectedTemplate] = useState('daily');
    const [generatedReport, setGeneratedReport] = useState('');
    const [generating, setGenerating] = useState(false);
    const last24hAlerts = alerts.filter(a => Date.now() - new Date(a.timestamp).getTime() < 86400000);
    const criticalAlerts = last24hAlerts.filter(a => getRuleLevel(a.rule.level) === 'critical');
    const activeAgents = MOCK_AGENTS.filter(a => a.status === 'active').length;
    const generateReport = async () => {
        setGenerating(true);
        const reportData = {
            period: selectedTemplate,
            totalAlerts: last24hAlerts.length,
            criticalAlerts: criticalAlerts.length,
            activeAgents,
            openIncidents: MOCK_INCIDENTS.filter(i => i.status === 'open' || i.status === 'investigating').length,
            topRules: last24hAlerts.slice(0, 5).map(a => a.rule.description),
            incidents: MOCK_INCIDENTS.map(i => ({ id: i.id, title: i.title, severity: i.severity, status: i.status })),
        };
        try {
            const report = await generateIncidentSummary(`Generate a professional ${selectedTemplate} SOC report with this data: ${JSON.stringify(reportData, null, 2)}`);
            setGeneratedReport(report);
        }
        catch {
            setGeneratedReport(`# ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} SOC Report\n\n**Generated:** ${new Date().toLocaleString()}\n\n## Executive Summary\n\nDuring the reporting period, the SOC detected **${last24hAlerts.length} security events** including **${criticalAlerts.length} critical severity alerts**. All ${activeAgents} active agents are reporting normally.\n\n## Key Metrics\n\n- Total Alerts: ${last24hAlerts.length}\n- Critical: ${criticalAlerts.length}\n- Active Agents: ${activeAgents}\n- Open Incidents: ${MOCK_INCIDENTS.filter(i => i.status === 'open').length}\n\n## Incidents\n\n${MOCK_INCIDENTS.map(i => `- **${i.id}**: ${i.title} (${i.severity.toUpperCase()}) — ${i.status}`).join('\n')}\n\n## Recommendations\n\n1. Review and contain all critical alerts immediately\n2. Investigate SSH brute force campaign\n3. Update endpoint agent software\n4. Schedule penetration test`);
        }
        setGenerating(false);
    };
    const downloadReport = () => {
        const blob = new Blob([generatedReport], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `soc-${selectedTemplate}-report-${new Date().toISOString().split('T')[0]}.md`;
        link.click();
    };
    return (_jsx(Layout, { title: "SOC Reports", children: _jsxs("div", { style: { display: 'flex', gap: 20, height: 'calc(100vh - 100px)' }, children: [_jsxs("div", { style: { width: 280 }, children: [_jsxs("div", { className: "card", style: { marginBottom: 16 }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, marginBottom: 12 }, children: "Report Templates" }), TEMPLATES.map((t) => (_jsxs("button", { onClick: () => setSelectedTemplate(t.id), style: {
                                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                        padding: '10px 12px', borderRadius: 8, marginBottom: 6,
                                        background: selectedTemplate === t.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                                        border: `1px solid ${selectedTemplate === t.id ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                                        color: selectedTemplate === t.id ? '#3b82f6' : 'var(--text-secondary)',
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                    }, children: [t.icon, _jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 500 }, children: t.label }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }, children: t.desc })] })] }, t.id)))] }), _jsxs("div", { className: "card", children: [_jsx("div", { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }, children: "Report Data" }), [
                                    { label: 'Alerts (24h)', value: last24hAlerts.length },
                                    { label: 'Critical', value: criticalAlerts.length },
                                    { label: 'Active Agents', value: activeAgents },
                                    { label: 'Open Incidents', value: MOCK_INCIDENTS.filter(i => i.status !== 'closed').length },
                                ].map(s => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }, children: [_jsx("span", { style: { color: 'var(--text-muted)' }, children: s.label }), _jsx("span", { style: { fontWeight: 600 }, children: s.value })] }, s.label)))] })] }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }, children: [_jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: generateReport, className: "btn-primary", disabled: generating, children: [_jsx(Brain, { size: 14 }), " ", generating ? 'Generating with AI...' : 'Generate Report'] }), generatedReport && (_jsxs("button", { onClick: downloadReport, className: "btn-secondary", children: [_jsx(Download, { size: 14 }), " Download .md"] }))] }), _jsx("div", { className: "card", style: { flex: 1, overflow: 'auto' }, children: generatedReport ? (_jsx("div", { style: { fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }, children: _jsx(ReactMarkdown, { children: generatedReport }) })) : (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }, children: [_jsx(FileText, { size: 48, style: { color: 'var(--text-muted)', opacity: 0.3 } }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-muted)' }, children: "Select a template and click Generate Report" })] })) })] })] }) }));
}
