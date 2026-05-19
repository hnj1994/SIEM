import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useAlertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store/authStore';
import { getRuleLevel } from '@/types';
import { format } from 'date-fns';

export default function Topbar({ title }: { title?: string }) {
  const { theme, toggleTheme } = useSettingsStore();
  const { alerts, isLive, toggleLive } = useAlertStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const criticalAlerts = alerts.filter(a => getRuleLevel(a.rule.level) === 'critical').slice(0, 5);

  return (
    <header style={{
      height: 56,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      flexShrink: 0,
      position: 'relative',
      zIndex: 5,
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{title || 'Dashboard'}</h1>
      </div>

      {/* Global search */}
      <div style={{ position: 'relative', width: 280 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="input"
          style={{ width: '100%', paddingLeft: 32, fontSize: 13 }}
          placeholder="Search alerts, agents, rules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search) {
              navigate(`/alerts?search=${encodeURIComponent(search)}`);
              setSearch('');
            }
          }}
        />
      </div>

      {/* Live toggle */}
      <button
        onClick={toggleLive}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 6,
          background: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(74,85,104,0.2)',
          border: isLive ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
          color: isLive ? '#10b981' : 'var(--text-muted)',
          cursor: 'pointer', fontSize: 12, fontWeight: 600,
          transition: 'all 0.2s',
        }}
      >
        {isLive ? <Wifi size={13} /> : <WifiOff size={13} />}
        {isLive ? 'LIVE' : 'PAUSED'}
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            position: 'relative', background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}
        >
          <Bell size={16} />
          {criticalAlerts.length > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: '#ef4444', color: 'white',
              borderRadius: '50%', width: 16, height: 16,
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{criticalAlerts.length}</span>
          )}
        </button>
        {showNotifications && (
          <div style={{
            position: 'absolute', right: 0, top: 44, width: 340,
            background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
            borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 100, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>Recent Critical Alerts</div>
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => { navigate(`/alerts/${alert.id}`); setShowNotifications(false); }}
                style={{
                  padding: '10px 16px', borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{alert.rule.description}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.agent.name} • {format(new Date(alert.timestamp), 'HH:mm:ss')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
        }}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
