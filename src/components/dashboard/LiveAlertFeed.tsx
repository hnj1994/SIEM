import { useEffect, useRef } from 'react';
import { useAlertStore } from '@/store/alertStore';
import { generateMockAlerts } from '@/api/mockData';
import { getRuleLevel } from '@/types';
import SeverityBadge from '@/components/common/SeverityBadge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function LiveAlertFeed() {
  const { liveAlerts, addLiveAlert, isLive } = useAlertStore();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      const newAlert = generateMockAlerts(1)[0];
      newAlert.timestamp = new Date().toISOString();
      addLiveAlert(newAlert);
    }, 3000 + Math.random() * 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive, addLiveAlert]);

  return (
    <div className="card" style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} style={{ color: '#f59e0b' }} />
          Live Alert Feed
        </div>
        {isLive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>STREAMING</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {liveAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 13 }}>
            {isLive ? 'Waiting for alerts...' : 'Live feed paused'}
          </div>
        ) : (
          liveAlerts.map((alert, i) => (
            <div
              key={alert.id + i}
              onClick={() => navigate(`/alerts/${alert.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                animation: i === 0 ? 'fadeIn 0.3s ease' : undefined,
              }}
            >
              <SeverityBadge severity={getRuleLevel(alert.rule.level)} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.rule.description}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{alert.agent.name}</div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                {format(new Date(alert.timestamp), 'HH:mm:ss')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
