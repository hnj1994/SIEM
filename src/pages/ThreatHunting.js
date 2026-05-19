import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAlertStore } from '@/store/alertStore';
import AlertTable from '@/components/common/AlertTable';
import { Search, Sparkles, BookOpen, Play } from 'lucide-react';
import { translateToQuery } from '@/api/ollamaApi';
const SAVED_HUNTS = [
    { name: 'Failed SSH Logins (24h)', query: 'rule.groups:authentication_failed', nl: 'Show all SSH authentication failures' },
    { name: 'PowerShell Activity', query: 'rule.groups:powershell', nl: 'Find suspicious PowerShell execution' },
    { name: 'Malware Detections', query: 'rule.groups:malware', nl: 'Show malware and virus detections' },
    { name: 'Lateral Movement', query: 'rule.groups:lateral', nl: 'Detect lateral movement techniques' },
    { name: 'Critical Events', query: 'rule.level:>=13', nl: 'Show all critical severity events' },
    { name: 'Network Scans', query: 'rule.groups:scan', nl: 'Find network port scan activity' },
];
const SUGGESTED_QUERIES = [
    'Show failed logins in last 24 hours',
    'Find suspicious PowerShell activity',
    'Show ransomware or malware detections',
    'Detect privilege escalation attempts',
    'Show network scanning activity',
    'Find lateral movement indicators',
];
export default function ThreatHunting() {
    const { alerts } = useAlertStore();
    const [nlQuery, setNlQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [translatedQuery, setTranslatedQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const executeSearch = async (queryText) => {
        setNlQuery(queryText);
        setIsSearching(true);
        setHasSearched(true);
        try {
            const query = await translateToQuery(queryText);
            setTranslatedQuery(query);
            // Apply query as filter on mock data
            const lower = queryText.toLowerCase();
            const filtered = alerts.filter(a => {
                if (lower.includes('ssh') || lower.includes('login') || lower.includes('fail')) {
                    return a.rule.groups.some(g => g.includes('ssh') || g.includes('auth'));
                }
                if (lower.includes('powershell')) {
                    return a.rule.groups.includes('powershell') || a.rule.description.toLowerCase().includes('powershell');
                }
                if (lower.includes('malware') || lower.includes('ransomware')) {
                    return a.rule.groups.some(g => g.includes('malware') || g.includes('ransomware'));
                }
                if (lower.includes('critical')) {
                    return a.rule.level >= 13;
                }
                if (lower.includes('scan')) {
                    return a.rule.groups.includes('scan');
                }
                if (lower.includes('lateral')) {
                    return a.rule.groups.includes('lateral');
                }
                return a.rule.description.toLowerCase().includes(lower) ||
                    a.rule.groups.some(g => g.toLowerCase().includes(lower));
            });
            setResults(filtered);
        }
        catch {
            setResults(alerts.slice(0, 20));
            setTranslatedQuery('(AI translation unavailable)');
        }
        setIsSearching(false);
    };
    return (_jsx(Layout, { title: "Threat Hunting", children: _jsxs("div", { style: { display: 'flex', gap: 16, height: 'calc(100vh - 100px)' }, children: [_jsx("div", { style: { width: 260, display: 'flex', flexDirection: 'column', gap: 16 }, children: _jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }, children: [_jsx(BookOpen, { size: 14, style: { color: 'var(--accent-blue)' } }), _jsx("span", { style: { fontSize: 13, fontWeight: 600 }, children: "Hunt Playbooks" })] }), SAVED_HUNTS.map((hunt) => (_jsxs("button", { onClick: () => executeSearch(hunt.nl), style: {
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '8px 10px', marginBottom: 4, borderRadius: 6,
                                    background: 'transparent', border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)', cursor: 'pointer',
                                    transition: 'all 0.15s', fontSize: 12,
                                }, onMouseEnter: e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--accent-blue)'; }, onMouseLeave: e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }, children: [_jsx("div", { style: { fontWeight: 500, marginBottom: 2 }, children: hunt.name }), _jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }, children: hunt.query })] }, hunt.name)))] }) }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsxs("div", { className: "card", style: { padding: 16 }, children: [_jsxs("div", { style: { fontSize: 13, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx(Sparkles, { size: 14, style: { color: '#8b5cf6' } }), "AI-Powered Natural Language Search"] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("div", { style: { position: 'relative', flex: 1 }, children: [_jsx(Search, { size: 14, style: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } }), _jsx("input", { className: "input", style: { width: '100%', paddingLeft: 36, fontSize: 14 }, placeholder: 'e.g. "Show failed logins in last 24 hours"', value: nlQuery, onChange: e => setNlQuery(e.target.value), onKeyDown: e => e.key === 'Enter' && nlQuery && executeSearch(nlQuery) })] }), _jsxs("button", { onClick: () => nlQuery && executeSearch(nlQuery), className: "btn-primary", disabled: isSearching, children: [_jsx(Play, { size: 13 }), " ", isSearching ? 'Hunting...' : 'Hunt'] })] }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }, children: SUGGESTED_QUERIES.map(q => (_jsx("button", { onClick: () => executeSearch(q), style: {
                                            padding: '4px 10px', borderRadius: 20, fontSize: 11,
                                            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                                            color: 'var(--accent-blue)', cursor: 'pointer',
                                        }, children: q }, q))) }), translatedQuery && (_jsxs("div", { style: {
                                        marginTop: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.2)',
                                        borderRadius: 6, fontSize: 12, fontFamily: 'monospace', color: '#10b981',
                                    }, children: ["Query: ", translatedQuery] }))] }), _jsxs("div", { className: "card", style: { flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }, children: [_jsx("div", { style: { padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: _jsx("span", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: hasSearched ? _jsxs(_Fragment, { children: [results.length, " results found"] }) : 'Enter a query or select a playbook to begin hunting' }) }), _jsxs("div", { style: { flex: 1, overflow: 'auto' }, children: [hasSearched && _jsx(AlertTable, { alerts: results }), !hasSearched && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }, children: [_jsx(Search, { size: 40, style: { color: 'var(--text-muted)', opacity: 0.4 } }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-muted)' }, children: "Start hunting for threats" })] }))] })] })] })] }) }));
}
