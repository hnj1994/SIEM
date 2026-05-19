import Layout from '@/components/layout/Layout';
import { useAlertStore } from '@/store/alertStore';
import { useState } from 'react';
import { WazuhAlert } from '@/types';

const MITRE_MATRIX = [
  {
    tactic: 'Initial Access', id: 'TA0001',
    techniques: ['T1190 Exploit Public-Facing App', 'T1566 Phishing', 'T1133 External Remote Services', 'T1189 Drive-by Compromise'],
  },
  {
    tactic: 'Execution', id: 'TA0002',
    techniques: ['T1059.001 PowerShell', 'T1059.003 Cmd', 'T1053 Scheduled Task', 'T1569 System Services'],
  },
  {
    tactic: 'Persistence', id: 'TA0003',
    techniques: ['T1547 Boot Autostart', 'T1053.005 Sched Task', 'T1136 Create Account', 'T1078 Valid Accounts'],
  },
  {
    tactic: 'Privilege Escalation', id: 'TA0004',
    techniques: ['T1548 Abuse Elevation', 'T1055 Process Injection', 'T1134 Token Manipulation', 'T1546 Event Triggered'],
  },
  {
    tactic: 'Defense Evasion', id: 'TA0005',
    techniques: ['T1070 Indicator Removal', 'T1027 Obfuscated Files', 'T1036 Masquerading', 'T1562 Impair Defenses'],
  },
  {
    tactic: 'Credential Access', id: 'TA0006',
    techniques: ['T1110 Brute Force', 'T1003.001 LSASS Memory', 'T1555 Creds from Password Stores', 'T1212 Exploit Auth'],
  },
  {
    tactic: 'Discovery', id: 'TA0007',
    techniques: ['T1046 Network Scan', 'T1082 System Info', 'T1083 File Discovery', 'T1135 Network Share'],
  },
  {
    tactic: 'Lateral Movement', id: 'TA0008',
    techniques: ['T1570 Lateral Transfer', 'T1021 Remote Services', 'T1534 Internal Spear', 'T1550 Use Alt Auth'],
  },
  {
    tactic: 'Collection', id: 'TA0009',
    techniques: ['T1560 Archive Collected', 'T1005 Local Data', 'T1039 Network Share Data', 'T1025 Data from Removable'],
  },
  {
    tactic: 'Exfiltration', id: 'TA0010',
    techniques: ['T1041 Exfil over C2', 'T1048 Exfil Alt Protocol', 'T1567 Exfil to Web', 'T1052 Exfil Physical'],
  },
  {
    tactic: 'Impact', id: 'TA0040',
    techniques: ['T1486 Data Encryption', 'T1489 Service Stop', 'T1490 Inhibit Recovery', 'T1485 Data Destruction'],
  },
];

function getCoverageColor(tacticName: string, alerts: WazuhAlert[]) {
  const count = alerts.filter(a => a.rule.mitre?.tactic?.includes(tacticName)).length;
  if (count === 0) return { bg: 'var(--bg-card)', border: 'var(--border)', text: 'var(--text-muted)', count: 0 };
  if (count >= 20) return { bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.5)', text: '#ef4444', count };
  if (count >= 10) return { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#f97316', count };
  if (count >= 5) return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#f59e0b', count };
  return { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', count };
}

export default function MitreAttack() {
  const { alerts } = useAlertStore();
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const selectedTacticData = MITRE_MATRIX.find(t => t.id === selectedTactic);

  return (
    <Layout title="MITRE ATT&CK Matrix">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Legend */}
        <div className="card" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Coverage Heat Map:</span>
            {[
              { label: 'No Activity', bg: 'var(--bg-card)', border: 'var(--border)' },
              { label: '1-4 Alerts', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
              { label: '5-9 Alerts', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
              { label: '10-19 Alerts', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' },
              { label: '20+ Alerts', bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.5)' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: l.bg, border: `1px solid ${l.border}` }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Matrix Grid */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${MITRE_MATRIX.length}, minmax(120px, 1fr))`,
            gap: 6,
            minWidth: 1400,
          }}>
            {/* Tactic headers */}
            {MITRE_MATRIX.map((tactic) => {
              const { bg, border, text, count } = getCoverageColor(tactic.tactic, alerts);
              return (
                <div key={tactic.id}>
                  <div
                    onClick={() => setSelectedTactic(selectedTactic === tactic.id ? null : tactic.id)}
                    style={{
                      background: selectedTactic === tactic.id ? 'rgba(59,130,246,0.2)' : bg,
                      border: `1px solid ${selectedTactic === tactic.id ? '#3b82f6' : border}`,
                      borderRadius: 6,
                      padding: '8px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: selectedTactic === tactic.id ? '#3b82f6' : text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tactic.tactic}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{tactic.id}</div>
                    {count > 0 && <div style={{ fontSize: 16, fontWeight: 800, color: text, marginTop: 2 }}>{count}</div>}
                  </div>

                  {/* Techniques */}
                  {tactic.techniques.map((tech) => {
                    const techId = tech.split(' ')[0];
                    const techName = tech.split(' ').slice(1).join(' ');
                    const hasHit = alerts.some(a => a.rule.mitre?.id.includes(techId));
                    const isHovered = hoveredCell === techId;
                    return (
                      <div
                        key={techId}
                        onMouseEnter={() => setHoveredCell(techId)}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          background: hasHit
                            ? (isHovered ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.12)')
                            : (isHovered ? 'var(--bg-card-hover)' : 'var(--bg-card)'),
                          border: `1px solid ${hasHit ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                          borderRadius: 4,
                          padding: '6px 6px',
                          marginBottom: 4,
                          cursor: 'pointer',
                          transition: 'all 0.12s',
                        }}
                      >
                        <div style={{ fontSize: 9, color: hasHit ? '#ef4444' : 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 1 }}>{techId}</div>
                        <div style={{ fontSize: 10, color: hasHit ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.3 }}>{techName}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected tactic detail */}
        {selectedTacticData && (
          <div className="card" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{selectedTacticData.tactic} ({selectedTacticData.id})</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              {alerts.filter(a => a.rule.mitre?.tactic?.includes(selectedTacticData.tactic)).length} alerts mapped to this tactic in your environment.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedTacticData.techniques.map(t => {
                const techId = t.split(' ')[0];
                const count = alerts.filter(a => a.rule.mitre?.id.includes(techId)).length;
                return (
                  <div key={techId} style={{
                    padding: '6px 12px', borderRadius: 6,
                    background: count > 0 ? 'rgba(239,68,68,0.15)' : 'var(--bg-card)',
                    border: `1px solid ${count > 0 ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                    fontSize: 12,
                  }}>
                    <span style={{ color: count > 0 ? '#ef4444' : 'var(--text-muted)', fontFamily: 'monospace', marginRight: 6 }}>{techId}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{t.split(' ').slice(1).join(' ')}</span>
                    {count > 0 && <span style={{ marginLeft: 6, color: '#ef4444', fontWeight: 700 }}>({count})</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
