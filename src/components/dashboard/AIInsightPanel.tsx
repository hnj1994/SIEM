import { useState, useEffect } from 'react';
import { Brain, RefreshCw, ArrowRight } from 'lucide-react';
import { useAlertStore } from '@/store/alertStore';
import { getRuleLevel } from '@/types';
import { useNavigate } from 'react-router-dom';

const DEMO_INSIGHTS = [
  'Detected coordinated SSH brute force from 3 unique source IPs. Pattern suggests automated credential stuffing. Recommend blocking /24 subnet.',
  'PowerShell execution with encoded commands on workstation-04 matches T1059.001. Possible initial access via phishing. Isolate and investigate.',
  'Failed login spike on win-dc-01 (+340% from baseline). Cross-correlating with lateral movement indicators. Escalate to Tier 2.',
  'Ransomware-like file modification pattern detected. 847 files encrypted in 2 minutes. Immediate isolation required.',
  'Network scan from 10.0.0.45 targeting ports 22, 3389, 5985. T1046 technique observed. No successful connections yet.',
];

export default function AIInsightPanel() {
  const { alerts } = useAlertStore();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(DEMO_INSIGHTS[0]);
  const [loading, setLoading] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  const refreshInsight = () => {
    setLoading(true);
    setTimeout(() => {
      const next = (insightIndex + 1) % DEMO_INSIGHTS.length;
      setInsightIndex(next);
      setInsight(DEMO_INSIGHTS[next]);
      setLoading(false);
    }, 1200);
  };

  const criticalCount = alerts.filter(a => getRuleLevel(a.rule.level) === 'critical').length;

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))',
        border: '1px solid rgba(139,92,246,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 100, height: 100,
        borderRadius: '50%', background: 'rgba(139,92,246,0.1)', filter: 'blur(30px)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Brain size={14} color="white" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>AI Threat Intelligence</span>
        <button
          onClick={refreshInsight}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {criticalCount > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 6, padding: '6px 10px', marginBottom: 10,
          fontSize: 11, color: '#ef4444', fontWeight: 600,
        }}>
          ⚠ {criticalCount} CRITICAL alert{criticalCount !== 1 ? 's' : ''} require immediate attention
        </div>
      )}

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        {insight}
      </p>

      <button
        onClick={() => navigate('/chat')}
        style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 12, color: '#8b5cf6', background: 'transparent',
          border: 'none', cursor: 'pointer', fontWeight: 500,
        }}
      >
        Ask AI Copilot <ArrowRight size={12} />
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
