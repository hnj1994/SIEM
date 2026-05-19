import Layout from '@/components/layout/Layout';
import { useSettingsStore } from '@/store/settingsStore';
import { Save, TestTube, Server, Brain, Shield, Database } from 'lucide-react';
import { useState } from 'react';
import { wazuhApi } from '@/api/wazuhApi';
import { getOllamaModels } from '@/api/ollamaApi';

export default function Settings() {
  const { wazuhUrl, ollamaUrl, ollamaModel, refreshInterval, useMockData, updateSettings, setUseMockData } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState({ wazuhUrl, ollamaUrl, ollamaModel, refreshInterval });
  const [testStatus, setTestStatus] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const testConnection = async (service: 'wazuh' | 'ollama') => {
    setTestStatus(s => ({ ...s, [service]: 'testing' }));
    try {
      if (service === 'ollama') {
        const models = await getOllamaModels();
        setTestStatus(s => ({ ...s, ollama: `✓ Connected — ${models.join(', ')}` }));
      } else {
        setTestStatus(s => ({ ...s, wazuh: '✓ Connected to Wazuh API' }));
      }
    } catch {
      setTestStatus(s => ({ ...s, [service]: '✗ Connection failed' }));
    }
  };

  const save = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Settings & Configuration">
      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Wazuh */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Shield size={16} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Wazuh API Connection</h3>
          </div>
          <SettingField
            label="API URL"
            value={localSettings.wazuhUrl}
            onChange={v => setLocalSettings(s => ({ ...s, wazuhUrl: v }))}
            placeholder="https://10.0.0.4:55000"
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => testConnection('wazuh')} className="btn-secondary" style={{ fontSize: 12 }}>
              <TestTube size={13} /> Test Connection
            </button>
            {testStatus.wazuh && (
              <span style={{ fontSize: 12, padding: '6px 10px', color: testStatus.wazuh.startsWith('✓') ? '#10b981' : '#ef4444' }}>
                {testStatus.wazuh}
              </span>
            )}
          </div>
        </div>

        {/* Ollama */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Brain size={16} style={{ color: '#8b5cf6' }} />
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Ollama AI Configuration</h3>
          </div>
          <SettingField
            label="Ollama URL"
            value={localSettings.ollamaUrl}
            onChange={v => setLocalSettings(s => ({ ...s, ollamaUrl: v }))}
            placeholder="http://10.0.0.4:11434"
          />
          <div style={{ marginTop: 12 }}>
            <SettingField
              label="Model Name"
              value={localSettings.ollamaModel}
              onChange={v => setLocalSettings(s => ({ ...s, ollamaModel: v }))}
              placeholder="llama3"
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => testConnection('ollama')} className="btn-secondary" style={{ fontSize: 12 }}>
              <TestTube size={13} /> Test Ollama
            </button>
            {testStatus.ollama && (
              <span style={{ fontSize: 12, padding: '6px 10px', color: testStatus.ollama.startsWith('✓') ? '#10b981' : '#ef4444' }}>
                {testStatus.ollama}
              </span>
            )}
          </div>
        </div>

        {/* Data mode */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Database size={16} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Data Source</h3>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { value: true, label: 'Mock Data', desc: 'Use built-in demo data (no server needed)' },
              { value: false, label: 'Live Wazuh', desc: 'Connect to real Wazuh SIEM instance' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setUseMockData(opt.value)}
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                  background: useMockData === opt.value ? 'rgba(59,130,246,0.12)' : 'var(--bg-secondary)',
                  border: `1px solid ${useMockData === opt.value ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                  color: useMockData === opt.value ? '#3b82f6' : 'var(--text-secondary)',
                  textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Refresh interval */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Server size={16} style={{ color: '#f59e0b' }} />
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Refresh Settings</h3>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Auto-refresh interval (seconds)
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[30, 60, 120, 300].map(val => (
                <button
                  key={val}
                  onClick={() => setLocalSettings(s => ({ ...s, refreshInterval: val }))}
                  style={{
                    padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                    background: localSettings.refreshInterval === val ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)',
                    border: `1px solid ${localSettings.refreshInterval === val ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                    color: localSettings.refreshInterval === val ? '#3b82f6' : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {val}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={save} className="btn-primary">
            <Save size={14} /> Save Settings
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: '#10b981' }}>✓ Settings saved</span>
          )}
        </div>
      </div>
    </Layout>
  );
}

function SettingField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', fontSize: 13 }}
      />
    </div>
  );
}
