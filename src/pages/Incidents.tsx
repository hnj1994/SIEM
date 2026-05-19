import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { MOCK_INCIDENTS } from '@/api/mockData';
import { Incident } from '@/types';
import { AlertTriangle, Clock, User, ChevronRight, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { generateIncidentSummary } from '@/api/ollamaApi';
import ReactMarkdown from 'react-markdown';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  open: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Open' },
  investigating: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Investigating' },
  contained: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Contained' },
  resolved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Resolved' },
  closed: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: 'Closed' },
};

const SEVERITY_CONFIG: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#10b981',
};

export default function Incidents() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const generateAISummary = async (incident: Incident) => {
    setLoadingAi(true);
    try {
      const summary = await generateIncidentSummary(JSON.stringify(incident, null, 2));
      setAiSummary(summary);
    } catch {
      setAiSummary('Unable to connect to Ollama. Ensure the Ollama server is running.');
    }
    setLoadingAi(false);
  };

  return (
    <Layout title="Incident Response">
      <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 100px)' }}>
        {/* Incident List */}
        <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {MOCK_INCIDENTS.map((inc) => (
            <div
              key={inc.id}
              className="card"
              onClick={() => { setSelectedIncident(inc); setAiSummary(''); }}
              style={{
                cursor: 'pointer', transition: 'all 0.15s',
                borderLeft: `3px solid ${SEVERITY_CONFIG[inc.severity] || '#64748b'}`,
                ...(selectedIncident?.id === inc.id ? { borderColor: '#3b82f6', background: 'var(--bg-card-hover)' } : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--accent-blue)', fontWeight: 600 }}>{inc.id}</span>
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 10,
                  background: STATUS_CONFIG[inc.status]?.bg || 'rgba(100,116,139,0.1)',
                  color: STATUS_CONFIG[inc.status]?.color || '#64748b',
                  fontWeight: 600, textTransform: 'uppercase',
                }}>
                  {STATUS_CONFIG[inc.status]?.label || inc.status}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{inc.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.description}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={9} />{format(new Date(inc.createdAt), 'MMM dd HH:mm')}
                </span>
                {inc.assignee && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><User size={9} />{inc.assignee.split('@')[0]}</span>}
                <span>{inc.alerts.length} alerts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incident Detail */}
        {selectedIncident ? (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--accent-blue)', fontFamily: 'monospace', marginBottom: 4 }}>{selectedIncident.id}</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selectedIncident.title}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedIncident.description}</p>
                </div>
                <button onClick={() => generateAISummary(selectedIncident)} className="btn-primary" disabled={loadingAi}>
                  <Brain size={14} /> {loadingAi ? 'Generating...' : 'AI Summary'}
                </button>
              </div>

              {/* MITRE Tactics */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedIncident.mitreTactics.map(t => (
                  <span key={t} style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 11,
                    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                    color: '#a78bfa', fontWeight: 500,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            {aiSummary && (
              <div className="card" style={{ background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Brain size={14} style={{ color: '#8b5cf6' }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>AI Incident Summary</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <ReactMarkdown>{aiSummary}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Incident Timeline</h3>
              <div style={{ position: 'relative', paddingLeft: 20 }}>
                <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
                {selectedIncident.timeline.map((evt) => (
                  <div key={evt.id} style={{ position: 'relative', marginBottom: 20 }}>
                    <div style={{
                      position: 'absolute', left: -20, top: 4,
                      width: 10, height: 10, borderRadius: '50%',
                      background: evt.type === 'alert' ? '#ef4444' : evt.type === 'action' ? '#3b82f6' : evt.type === 'escalation' ? '#f97316' : '#8b5cf6',
                      border: '2px solid var(--bg-primary)',
                    }} />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
                      {format(new Date(evt.timestamp), 'MMM dd HH:mm:ss')}
                      {evt.actor && <span style={{ color: 'var(--accent-blue)', marginLeft: 8 }}> — {evt.actor}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{evt.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <AlertTriangle size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Select an incident to view details</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
