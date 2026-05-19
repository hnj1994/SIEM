import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { MOCK_INCIDENTS } from '@/api/mockData';
import { AlertTriangle, Clock, User, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { generateIncidentSummary } from '@/api/ollamaApi';
import ReactMarkdown from 'react-markdown';
const STATUS_CONFIG = {
    open: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Open' },
    investigating: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Investigating' },
    contained: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Contained' },
    resolved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Resolved' },
    closed: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: 'Closed' },
};
const SEVERITY_CONFIG = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981',
};
export default function Incidents() {
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [aiSummary, setAiSummary] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);
    const generateAISummary = async (incident) => {
        setLoadingAi(true);
        try {
            const summary = await generateIncidentSummary(JSON.stringify(incident, null, 2));
            setAiSummary(summary);
        }
        catch {
            setAiSummary('Unable to connect to Ollama. Ensure the Ollama server is running.');
        }
        setLoadingAi(false);
    };
    return (_jsx(Layout, { title: "Incident Response", children: _jsxs("div", { style: { display: 'flex', gap: 20, height: 'calc(100vh - 100px)' }, children: [_jsx("div", { style: { width: 360, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }, children: MOCK_INCIDENTS.map((inc) => (_jsxs("div", { className: "card", onClick: () => { setSelectedIncident(inc); setAiSummary(''); }, style: {
                            cursor: 'pointer', transition: 'all 0.15s',
                            borderLeft: `3px solid ${SEVERITY_CONFIG[inc.severity] || '#64748b'}`,
                            ...(selectedIncident?.id === inc.id ? { borderColor: '#3b82f6', background: 'var(--bg-card-hover)' } : {}),
                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }, children: [_jsx("span", { style: { fontSize: 11, fontFamily: 'monospace', color: 'var(--accent-blue)', fontWeight: 600 }, children: inc.id }), _jsx("span", { style: {
                                            fontSize: 10, padding: '2px 7px', borderRadius: 10,
                                            background: STATUS_CONFIG[inc.status]?.bg || 'rgba(100,116,139,0.1)',
                                            color: STATUS_CONFIG[inc.status]?.color || '#64748b',
                                            fontWeight: 600, textTransform: 'uppercase',
                                        }, children: STATUS_CONFIG[inc.status]?.label || inc.status })] }), _jsx("div", { style: { fontSize: 13, fontWeight: 600, marginBottom: 6 }, children: inc.title }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: inc.description }), _jsxs("div", { style: { display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-muted)' }, children: [_jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: 3 }, children: [_jsx(Clock, { size: 9 }), format(new Date(inc.createdAt), 'MMM dd HH:mm')] }), inc.assignee && _jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: 3 }, children: [_jsx(User, { size: 9 }), inc.assignee.split('@')[0]] }), _jsxs("span", { children: [inc.alerts.length, " alerts"] })] })] }, inc.id))) }), selectedIncident ? (_jsxs("div", { style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 11, color: 'var(--accent-blue)', fontFamily: 'monospace', marginBottom: 4 }, children: selectedIncident.id }), _jsx("h2", { style: { fontSize: 18, fontWeight: 700, marginBottom: 4 }, children: selectedIncident.title }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: selectedIncident.description })] }), _jsxs("button", { onClick: () => generateAISummary(selectedIncident), className: "btn-primary", disabled: loadingAi, children: [_jsx(Brain, { size: 14 }), " ", loadingAi ? 'Generating...' : 'AI Summary'] })] }), _jsx("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap' }, children: selectedIncident.mitreTactics.map(t => (_jsx("span", { style: {
                                            padding: '3px 10px', borderRadius: 6, fontSize: 11,
                                            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                                            color: '#a78bfa', fontWeight: 500,
                                        }, children: t }, t))) })] }), aiSummary && (_jsxs("div", { className: "card", style: { background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.2)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }, children: [_jsx(Brain, { size: 14, style: { color: '#8b5cf6' } }), _jsx("span", { style: { fontSize: 13, fontWeight: 600 }, children: "AI Incident Summary" })] }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }, children: _jsx(ReactMarkdown, { children: aiSummary }) })] })), _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontSize: 14, fontWeight: 600, marginBottom: 16 }, children: "Incident Timeline" }), _jsxs("div", { style: { position: 'relative', paddingLeft: 20 }, children: [_jsx("div", { style: { position: 'absolute', left: 6, top: 0, bottom: 0, width: 1, background: 'var(--border)' } }), selectedIncident.timeline.map((evt) => (_jsxs("div", { style: { position: 'relative', marginBottom: 20 }, children: [_jsx("div", { style: {
                                                        position: 'absolute', left: -20, top: 4,
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        background: evt.type === 'alert' ? '#ef4444' : evt.type === 'action' ? '#3b82f6' : evt.type === 'escalation' ? '#f97316' : '#8b5cf6',
                                                        border: '2px solid var(--bg-primary)',
                                                    } }), _jsxs("div", { style: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }, children: [format(new Date(evt.timestamp), 'MMM dd HH:mm:ss'), evt.actor && _jsxs("span", { style: { color: 'var(--accent-blue)', marginLeft: 8 }, children: [" \u2014 ", evt.actor] })] }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-primary)' }, children: evt.description })] }, evt.id)))] })] })] })) : (_jsxs("div", { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }, children: [_jsx(AlertTriangle, { size: 48, style: { color: 'var(--text-muted)', opacity: 0.3 } }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-muted)' }, children: "Select an incident to view details" })] }))] }) }));
}
