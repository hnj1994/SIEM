import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAlertStore } from '@/store/alertStore';
import { getRuleLevel, getSeverityColor } from '@/types';
import SeverityBadge from '@/components/common/SeverityBadge';
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Brain, Copy, ExternalLink } from 'lucide-react';
import { explainAlert } from '@/api/ollamaApi';
import ReactMarkdown from 'react-markdown';

export default function AlertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts } = useAlertStore();
  const alert = alerts.find(a => a.id === id);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'raw' | 'ai'>('overview');

  if (!alert) return (
    <Layout title="Alert Not Found">
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
        Alert not found. <button onClick={() => navigate('/alerts')} className="btn-primary" style={{ marginLeft: 12 }}>Back to Alerts</button>
      </div>
    </Layout>
  );

  const severity = getRuleLevel(alert.rule.level);
  const color = getSeverityColor(severity);

  const handleAiExplain = async () => {
    setLoadingAi(true);
    setActiveTab('ai');
    try {
      const explanation = await explainAlert(JSON.stringify(alert, null, 2));
      setAiExplanation(explanation);
    } catch {
      setAiExplanation('⚠️ Unable to connect to Ollama AI server at http://4.188.228.167:11434. Please check your Ollama server configuration and ensure it is accessible.');
    }
    setLoadingAi(false);
  };

  const tabs = ['overview', 'raw', 'ai'] as const;

  return (
    <Layout title="Alert Details">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate('/alerts')} className="btn-secondary" style={{ fontSize: 12 }}>
            <ArrowLeft size={13} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <SeverityBadge severity={severity} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{alert.rule.description}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Rule {alert.rule.id} &bull; {format(new Date(alert.timestamp), 'MMMM dd, yyyy HH:mm:ss')}
            </div>
          </div>
          <button onClick={handleAiExplain} className="btn-primary" style={{ gap: 6 }} disabled={loadingAi}>
            <Brain size={14} />{loadingAi ? 'Analyzing...' : 'AI Explain'}
          </button>
        </div>

        {/* MITRE badge */}
        {alert.rule.mitre && (
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16,
          }}>
            {alert.rule.mitre.tactic.map((t) => (
              <span key={t} style={{
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                fontSize: 11, color: '#a78bfa', fontWeight: 600,
              }}>{t}</span>
            ))}
            {alert.rule.mitre.id.map((id) => (
              <span key={id} style={{
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
                fontSize: 11, color: '#06b6d4', fontWeight: 600, fontFamily: 'monospace',
              }}>{id}</span>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 16, background: 'var(--bg-card)', borderRadius: 8, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, transition: 'all 0.15s', textTransform: 'capitalize',
                background: activeTab === tab ? '#3b82f6' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-muted)',
              }}
            >
              {tab === 'ai' ? 'AI Analysis' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Alert Info */}
            <div className="card">
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Alert Information</h3>
              <InfoRow label="Alert ID" value={alert.id} mono />
              <InfoRow label="Rule Level" value={`${alert.rule.level} — ${severity.toUpperCase()}`} />
              <InfoRow label="Rule Groups" value={alert.rule.groups.join(', ')} />
              <InfoRow label="Location" value={alert.location || 'N/A'} mono />
              <InfoRow label="Decoder" value={alert.decoder?.name || 'N/A'} />
            </div>
            {/* Agent Info */}
            <div className="card">
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Agent Information</h3>
              <InfoRow label="Agent Name" value={alert.agent.name} />
              <InfoRow label="Agent ID" value={alert.agent.id} mono />
              <InfoRow label="Agent IP" value={alert.agent.ip} mono />
              <InfoRow label="Manager" value={alert.manager.name} />
              <InfoRow label="Timestamp" value={format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')} mono />
            </div>
            {/* Event Data */}
            {alert.data && (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Event Data</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {Object.entries(alert.data).map(([key, val]) => (
                    <InfoRow key={key} label={key} value={String(val)} mono />
                  ))}
                </div>
              </div>
            )}
            {/* Full Log */}
            {alert.full_log && (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600 }}>Full Log</h3>
                  <button onClick={() => navigator.clipboard.writeText(alert.full_log || '')} className="btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}>
                    <Copy size={11} /> Copy
                  </button>
                </div>
                <pre style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  color: '#10b981', background: 'rgba(0,0,0,0.3)',
                  padding: 12, borderRadius: 6, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                }}>{alert.full_log}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600 }}>Raw Alert JSON</h3>
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(alert, null, 2))} className="btn-secondary" style={{ fontSize: 11 }}>
                <Copy size={11} /> Copy JSON
              </button>
            </div>
            <pre style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.3)',
              padding: 16, borderRadius: 6, overflow: 'auto',
              maxHeight: 500, lineHeight: 1.6,
            }}>{JSON.stringify(alert, null, 2)}</pre>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.04))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Brain size={16} style={{ color: '#8b5cf6' }} />
              <h3 style={{ fontSize: 13, fontWeight: 600 }}>AI Security Analysis</h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>Powered by Ollama / llama3</span>
            </div>
            {loadingAi ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Analyzing alert with AI...</div>
              </div>
            ) : aiExplanation ? (
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <ReactMarkdown>{aiExplanation}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Click "AI Explain" to analyze this alert with Ollama llama3</p>
                <button onClick={handleAiExplain} className="btn-primary"><Brain size={14} /> Analyze Alert</button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 110, flexShrink: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: mono ? 'JetBrains Mono, monospace' : undefined, wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}
