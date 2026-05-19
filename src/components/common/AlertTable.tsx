import { WazuhAlert, getRuleLevel } from '@/types';
import SeverityBadge from './SeverityBadge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
  alerts: WazuhAlert[];
  compact?: boolean;
  limit?: number;
}

export default function AlertTable({ alerts, compact = false, limit }: Props) {
  const navigate = useNavigate();
  const displayed = limit ? alerts.slice(0, limit) : alerts;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ ...thStyle, width: 90 }}>Severity</th>
            <th style={{ ...thStyle, width: 160 }}>Time</th>
            {!compact && <th style={{ ...thStyle, width: 80 }}>Rule ID</th>}
            <th style={thStyle}>Description</th>
            <th style={{ ...thStyle, width: 140 }}>Agent</th>
            {!compact && <th style={{ ...thStyle, width: 80 }}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {displayed.map((alert) => {
            const severity = getRuleLevel(alert.rule.level);
            return (
              <tr
                key={alert.id}
                className="table-row"
                style={{
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/alerts/${alert.id}`)}
              >
                <td style={tdStyle}><SeverityBadge severity={severity} size="sm" /></td>
                <td style={{ ...tdStyle, ...monoStyle, fontSize: 11 }}>
                  {format(new Date(alert.timestamp), compact ? 'HH:mm:ss' : 'MMM dd HH:mm:ss')}
                </td>
                {!compact && (
                  <td style={{ ...tdStyle, ...monoStyle, color: 'var(--accent-blue)', fontSize: 12 }}>
                    {alert.rule.id}
                  </td>
                )}
                <td style={{ ...tdStyle, fontSize: 13, maxWidth: 300 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {alert.rule.description}
                  </div>
                  {alert.rule.mitre && (
                    <div style={{ fontSize: 10, color: 'var(--accent-purple)', marginTop: 2 }}>
                      {alert.rule.mitre.technique.join(', ')}
                    </div>
                  )}
                </td>
                <td style={{ ...tdStyle, fontSize: 12 }}>
                  <div style={{ fontWeight: 500 }}>{alert.agent.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{alert.agent.ip}</div>
                </td>
                {!compact && (
                  <td style={tdStyle}>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {displayed.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 14 }}>
          No alerts match your current filters
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  color: 'var(--text-primary)',
  verticalAlign: 'middle',
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
};
