import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAlertStore } from '@/store/alertStore';
import { getRuleLevel, getSeverityColor } from '@/types';
import SeverityBadge from '@/components/common/SeverityBadge';
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Brain, Copy } from 'lucide-react';
import { explainAlert } from '@/api/ollamaApi';
import ReactMarkdown from 'react-markdown';
export default function AlertDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { alerts } = useAlertStore();
    const alert = alerts.find(a => a.id === id);
    const [aiExplanation, setAiExplanation] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    if (!alert)
        return (_jsx(Layout, { title: "Alert Not Found", children: _jsxs("div", { style: { textAlign: 'center', padding: 60, color: 'var(--text-muted)' }, children: ["Alert not found. ", _jsx("button", { onClick: () => navigate('/alerts'), className: "btn-primary", style: { marginLeft: 12 }, children: "Back to Alerts" })] }) }));
    const severity = getRuleLevel(alert.rule.level);
    const color = getSeverityColor(severity);
    const handleAiExplain = async () => {
        setLoadingAi(true);
        setActiveTab('ai');
        try {
            const explanation = await explainAlert(JSON.stringify(alert, null, 2));
            setAiExplanation(explanation);
        }
        catch {
            setAiExplanation('Unable to connect to Ollama AI. Please check your Ollama server configuration.');
        }
        setLoadingAi(false);
    };
    const tabs = ['overview', 'raw', 'ai'];
    return (_jsx(Layout, { title: "Alert Details", children: _jsxs("div", { style: { maxWidth: 1000, margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }, children: [_jsxs("button", { onClick: () => navigate('/alerts'), className: "btn-secondary", style: { fontSize: 12 }, children: [_jsx(ArrowLeft, { size: 13 }), " Back"] }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }, children: [_jsx(SeverityBadge, { severity: severity }), _jsx("span", { style: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }, children: alert.rule.description })] }), _jsxs("div", { style: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }, children: ["Rule ", alert.rule.id, " \u2022 ", format(new Date(alert.timestamp), 'MMMM dd, yyyy HH:mm:ss')] })] }), _jsxs("button", { onClick: handleAiExplain, className: "btn-primary", style: { gap: 6 }, disabled: loadingAi, children: [_jsx(Brain, { size: 14 }), loadingAi ? 'Analyzing...' : 'AI Explain'] })] }), alert.rule.mitre && (_jsxs("div", { style: {
                        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16,
                    }, children: [alert.rule.mitre.tactic.map((t) => (_jsx("span", { style: {
                                padding: '4px 10px', borderRadius: 6,
                                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                                fontSize: 11, color: '#a78bfa', fontWeight: 600,
                            }, children: t }, t))), alert.rule.mitre.id.map((id) => (_jsx("span", { style: {
                                padding: '4px 10px', borderRadius: 6,
                                background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
                                fontSize: 11, color: '#06b6d4', fontWeight: 600, fontFamily: 'monospace',
                            }, children: id }, id)))] })), _jsx("div", { style: { display: 'flex', gap: 2, marginBottom: 16, background: 'var(--bg-card)', borderRadius: 8, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }, children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), style: {
                            padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
                            fontSize: 13, fontWeight: 500, transition: 'all 0.15s', textTransform: 'capitalize',
                            background: activeTab === tab ? '#3b82f6' : 'transparent',
                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                        }, children: tab === 'ai' ? 'AI Analysis' : tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }), activeTab === 'overview' && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, children: [_jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontSize: 13, fontWeight: 600, marginBottom: 14 }, children: "Alert Information" }), _jsx(InfoRow, { label: "Alert ID", value: alert.id, mono: true }), _jsx(InfoRow, { label: "Rule Level", value: `${alert.rule.level} — ${severity.toUpperCase()}` }), _jsx(InfoRow, { label: "Rule Groups", value: alert.rule.groups.join(', ') }), _jsx(InfoRow, { label: "Location", value: alert.location || 'N/A', mono: true }), _jsx(InfoRow, { label: "Decoder", value: alert.decoder?.name || 'N/A' })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { style: { fontSize: 13, fontWeight: 600, marginBottom: 14 }, children: "Agent Information" }), _jsx(InfoRow, { label: "Agent Name", value: alert.agent.name }), _jsx(InfoRow, { label: "Agent ID", value: alert.agent.id, mono: true }), _jsx(InfoRow, { label: "Agent IP", value: alert.agent.ip, mono: true }), _jsx(InfoRow, { label: "Manager", value: alert.manager.name }), _jsx(InfoRow, { label: "Timestamp", value: format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss'), mono: true })] }), alert.data && (_jsxs("div", { className: "card", style: { gridColumn: '1 / -1' }, children: [_jsx("h3", { style: { fontSize: 13, fontWeight: 600, marginBottom: 14 }, children: "Event Data" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }, children: Object.entries(alert.data).map(([key, val]) => (_jsx(InfoRow, { label: key, value: String(val), mono: true }, key))) })] })), alert.full_log && (_jsxs("div", { className: "card", style: { gridColumn: '1 / -1' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }, children: [_jsx("h3", { style: { fontSize: 13, fontWeight: 600 }, children: "Full Log" }), _jsxs("button", { onClick: () => navigator.clipboard.writeText(alert.full_log || ''), className: "btn-secondary", style: { fontSize: 11, padding: '4px 8px' }, children: [_jsx(Copy, { size: 11 }), " Copy"] })] }), _jsx("pre", { style: {
                                        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                                        color: '#10b981', background: 'rgba(0,0,0,0.3)',
                                        padding: 12, borderRadius: 6, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                                    }, children: alert.full_log })] }))] })), activeTab === 'raw' && (_jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, children: [_jsx("h3", { style: { fontSize: 13, fontWeight: 600 }, children: "Raw Alert JSON" }), _jsxs("button", { onClick: () => navigator.clipboard.writeText(JSON.stringify(alert, null, 2)), className: "btn-secondary", style: { fontSize: 11 }, children: [_jsx(Copy, { size: 11 }), " Copy JSON"] })] }), _jsx("pre", { style: {
                                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                                color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.3)',
                                padding: 16, borderRadius: 6, overflow: 'auto',
                                maxHeight: 500, lineHeight: 1.6,
                            }, children: JSON.stringify(alert, null, 2) })] })), activeTab === 'ai' && (_jsxs("div", { className: "card", style: { background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.04))' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }, children: [_jsx(Brain, { size: 16, style: { color: '#8b5cf6' } }), _jsx("h3", { style: { fontSize: 13, fontWeight: 600 }, children: "AI Security Analysis" }), _jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }, children: "Powered by Ollama / llama3" })] }), loadingAi ? (_jsx("div", { style: { textAlign: 'center', padding: 40 }, children: _jsx("div", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Analyzing alert with AI..." }) })) : aiExplanation ? (_jsx("div", { style: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }, children: _jsx(ReactMarkdown, { children: aiExplanation }) })) : (_jsxs("div", { style: { textAlign: 'center', padding: 40 }, children: [_jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }, children: "Click \"AI Explain\" to analyze this alert with Ollama llama3" }), _jsxs("button", { onClick: handleAiExplain, className: "btn-primary", children: [_jsx(Brain, { size: 14 }), " Analyze Alert"] })] }))] }))] }) }));
}
function InfoRow({ label, value, mono }) {
    return (_jsxs("div", { style: { display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }, children: [_jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)', width: 110, flexShrink: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', paddingTop: 1 }, children: label }), _jsx("span", { style: { fontSize: 12, color: 'var(--text-primary)', fontFamily: mono ? 'JetBrains Mono, monospace' : undefined, wordBreak: 'break-all' }, children: value })] }));
}
