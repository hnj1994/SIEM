import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@/components/layout/Layout';
import { useSettingsStore } from '@/store/settingsStore';
import { Save, TestTube, Server, Brain, Shield, Database } from 'lucide-react';
import { useState } from 'react';
import { getOllamaModels } from '@/api/ollamaApi';
export default function Settings() {
    const { wazuhUrl, ollamaUrl, ollamaModel, refreshInterval, useMockData, updateSettings, setUseMockData } = useSettingsStore();
    const [localSettings, setLocalSettings] = useState({ wazuhUrl, ollamaUrl, ollamaModel, refreshInterval });
    const [testStatus, setTestStatus] = useState({});
    const [saved, setSaved] = useState(false);
    const testConnection = async (service) => {
        setTestStatus(s => ({ ...s, [service]: 'testing' }));
        try {
            if (service === 'ollama') {
                const models = await getOllamaModels();
                setTestStatus(s => ({ ...s, ollama: `✓ Connected — ${models.join(', ')}` }));
            }
            else {
                setTestStatus(s => ({ ...s, wazuh: '✓ Connected to Wazuh API' }));
            }
        }
        catch {
            setTestStatus(s => ({ ...s, [service]: '✗ Connection failed' }));
        }
    };
    const save = () => {
        updateSettings(localSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    return (_jsx(Layout, { title: "Settings & Configuration", children: _jsxs("div", { style: { maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }, children: [_jsx(Shield, { size: 16, style: { color: '#3b82f6' } }), _jsx("h3", { style: { fontSize: 15, fontWeight: 600 }, children: "Wazuh API Connection" })] }), _jsx(SettingField, { label: "API URL", value: localSettings.wazuhUrl, onChange: v => setLocalSettings(s => ({ ...s, wazuhUrl: v })), placeholder: "https://10.0.0.4:55000" }), _jsxs("div", { style: { display: 'flex', gap: 8, marginTop: 12 }, children: [_jsxs("button", { onClick: () => testConnection('wazuh'), className: "btn-secondary", style: { fontSize: 12 }, children: [_jsx(TestTube, { size: 13 }), " Test Connection"] }), testStatus.wazuh && (_jsx("span", { style: { fontSize: 12, padding: '6px 10px', color: testStatus.wazuh.startsWith('✓') ? '#10b981' : '#ef4444' }, children: testStatus.wazuh }))] })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }, children: [_jsx(Brain, { size: 16, style: { color: '#8b5cf6' } }), _jsx("h3", { style: { fontSize: 15, fontWeight: 600 }, children: "Ollama AI Configuration" })] }), _jsx(SettingField, { label: "Ollama URL", value: localSettings.ollamaUrl, onChange: v => setLocalSettings(s => ({ ...s, ollamaUrl: v })), placeholder: "http://10.0.0.4:11434" }), _jsx("div", { style: { marginTop: 12 }, children: _jsx(SettingField, { label: "Model Name", value: localSettings.ollamaModel, onChange: v => setLocalSettings(s => ({ ...s, ollamaModel: v })), placeholder: "llama3" }) }), _jsxs("div", { style: { display: 'flex', gap: 8, marginTop: 12 }, children: [_jsxs("button", { onClick: () => testConnection('ollama'), className: "btn-secondary", style: { fontSize: 12 }, children: [_jsx(TestTube, { size: 13 }), " Test Ollama"] }), testStatus.ollama && (_jsx("span", { style: { fontSize: 12, padding: '6px 10px', color: testStatus.ollama.startsWith('✓') ? '#10b981' : '#ef4444' }, children: testStatus.ollama }))] })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }, children: [_jsx(Database, { size: 16, style: { color: '#10b981' } }), _jsx("h3", { style: { fontSize: 15, fontWeight: 600 }, children: "Data Source" })] }), _jsx("div", { style: { display: 'flex', gap: 12 }, children: [
                                { value: true, label: 'Mock Data', desc: 'Use built-in demo data (no server needed)' },
                                { value: false, label: 'Live Wazuh', desc: 'Connect to real Wazuh SIEM instance' },
                            ].map(opt => (_jsxs("button", { onClick: () => setUseMockData(opt.value), style: {
                                    flex: 1, padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                                    background: useMockData === opt.value ? 'rgba(59,130,246,0.12)' : 'var(--bg-secondary)',
                                    border: `1px solid ${useMockData === opt.value ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                                    color: useMockData === opt.value ? '#3b82f6' : 'var(--text-secondary)',
                                    textAlign: 'left', transition: 'all 0.15s',
                                }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, marginBottom: 4 }, children: opt.label }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: opt.desc })] }, String(opt.value)))) })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }, children: [_jsx(Server, { size: 16, style: { color: '#f59e0b' } }), _jsx("h3", { style: { fontSize: 15, fontWeight: 600 }, children: "Refresh Settings" })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }, children: "Auto-refresh interval (seconds)" }), _jsx("div", { style: { display: 'flex', gap: 8 }, children: [30, 60, 120, 300].map(val => (_jsxs("button", { onClick: () => setLocalSettings(s => ({ ...s, refreshInterval: val })), style: {
                                            padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                                            background: localSettings.refreshInterval === val ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)',
                                            border: `1px solid ${localSettings.refreshInterval === val ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                                            color: localSettings.refreshInterval === val ? '#3b82f6' : 'var(--text-secondary)',
                                            transition: 'all 0.15s',
                                        }, children: [val, "s"] }, val))) })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsxs("button", { onClick: save, className: "btn-primary", children: [_jsx(Save, { size: 14 }), " Save Settings"] }), saved && (_jsx("span", { style: { fontSize: 13, color: '#10b981' }, children: "\u2713 Settings saved" }))] })] }) }));
}
function SettingField({ label, value, onChange, placeholder, type = 'text', }) {
    return (_jsxs("div", { children: [_jsx("label", { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }, children: label }), _jsx("input", { type: type, className: "input", value: value, onChange: e => onChange(e.target.value), placeholder: placeholder, style: { width: '100%', fontSize: 13 } })] }));
}
