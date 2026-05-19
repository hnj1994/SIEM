import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@/components/layout/Layout';
import { CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
const FRAMEWORKS = [
    {
        name: 'CIS Controls v8',
        controls: [
            { id: '1', name: 'Inventory of Enterprise Assets', status: 'pass', desc: 'All assets discovered via Wazuh agents' },
            { id: '2', name: 'Inventory of Software Assets', status: 'pass', desc: 'Software inventory via SCA' },
            { id: '3', name: 'Data Protection', status: 'warning', desc: 'Partial encryption controls' },
            { id: '4', name: 'Secure Configuration', status: 'pass', desc: 'Wazuh SCA checks enabled' },
            { id: '5', name: 'Account Management', status: 'warning', desc: 'Multi-factor auth not enforced on all systems' },
            { id: '6', name: 'Access Control Management', status: 'fail', desc: 'Privileged access review overdue' },
            { id: '7', name: 'Continuous Vulnerability Management', status: 'pass', desc: 'Vulnerability scans running' },
            { id: '8', name: 'Audit Log Management', status: 'pass', desc: 'Wazuh collecting all audit logs' },
        ],
    },
    {
        name: 'PCI DSS v4.0',
        controls: [
            { id: '1', name: 'Network Security Controls', status: 'pass', desc: 'Firewall rules monitored' },
            { id: '2', name: 'Default Passwords', status: 'warning', desc: 'Some systems with default accounts detected' },
            { id: '3', name: 'Cardholder Data Protection', status: 'pass', desc: 'No PAN data in logs detected' },
            { id: '6', name: 'Secure Development', status: 'warning', desc: 'Web app vulnerability alerts present' },
            { id: '10', name: 'Log and Monitor Access', status: 'pass', desc: 'Full audit trail via Wazuh' },
            { id: '11', name: 'Security Testing', status: 'fail', desc: 'Penetration test overdue' },
        ],
    },
    {
        name: 'NIST Cybersecurity Framework',
        controls: [
            { id: 'ID', name: 'Identify', status: 'pass', desc: 'Asset and risk identification via Wazuh' },
            { id: 'PR', name: 'Protect', status: 'warning', desc: 'Some protective controls need review' },
            { id: 'DE', name: 'Detect', status: 'pass', desc: 'Real-time detection via SIEM' },
            { id: 'RS', name: 'Respond', status: 'warning', desc: 'Incident response procedures partially documented' },
            { id: 'RC', name: 'Recover', status: 'fail', desc: 'Disaster recovery plan not tested' },
        ],
    },
];
function StatusIcon({ status }) {
    if (status === 'pass')
        return _jsx(CheckCircle, { size: 16, style: { color: '#10b981' } });
    if (status === 'fail')
        return _jsx(XCircle, { size: 16, style: { color: '#ef4444' } });
    return _jsx(AlertCircle, { size: 16, style: { color: '#f59e0b' } });
}
export default function Compliance() {
    return (_jsx(Layout, { title: "Compliance & Frameworks", children: _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: FRAMEWORKS.map((framework) => {
                const pass = framework.controls.filter(c => c.status === 'pass').length;
                const total = framework.controls.length;
                const pct = Math.round((pass / total) * 100);
                return (_jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: {
                                                width: 36, height: 36, borderRadius: 8,
                                                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }, children: _jsx(Shield, { size: 16, style: { color: '#3b82f6' } }) }), _jsx("h3", { style: { fontSize: 16, fontWeight: 700 }, children: framework.name })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsxs("span", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: [pass, "/", total, " controls"] }), _jsxs("div", { style: {
                                                fontSize: 18, fontWeight: 800,
                                                color: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444',
                                            }, children: [pct, "%"] })] })] }), _jsx("div", { style: { height: 6, background: 'var(--border)', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }, children: _jsx("div", { style: {
                                    height: '100%', width: `${pct}%`,
                                    background: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444',
                                    borderRadius: 3, transition: 'width 0.5s ease',
                                } }) }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 8 }, children: framework.controls.map((control) => (_jsxs("div", { style: {
                                    display: 'flex', gap: 10, padding: '10px 12px',
                                    background: 'var(--bg-secondary)', borderRadius: 8,
                                    border: '1px solid var(--border)',
                                }, children: [_jsx(StatusIcon, { status: control.status }), _jsxs("div", { children: [_jsxs("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 2 }, children: [control.id, ". ", control.name] }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: control.desc })] })] }, control.id))) })] }, framework.name));
            }) }) }));
}
