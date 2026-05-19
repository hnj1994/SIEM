import { AlertTriangle, Cpu, UserX, Bug, Shield, Activity } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import { useAlertStore } from '@/store/alertStore';
import { getRuleLevel } from '@/types';
import { MOCK_AGENTS } from '@/api/mockData';

export default function StatsRow() {
  const { alerts } = useAlertStore();

  const now = new Date();
  const last24h = alerts.filter(a => now.getTime() - new Date(a.timestamp).getTime() < 86400000);
  const criticalCount = last24h.filter(a => getRuleLevel(a.rule.level) === 'critical').length;
  const failedLogins = last24h.filter(a => a.rule.groups.some(g => g.includes('authentication_fail'))).length;
  const malware = last24h.filter(a => a.rule.groups.some(g => g.includes('malware') || g.includes('ransomware'))).length;
  const activeAgents = MOCK_AGENTS.filter(a => a.status === 'active').length;

  const stats = [
    {
      title: 'Total Alerts (24h)',
      value: last24h.length.toLocaleString(),
      subtitle: 'Events processed',
      icon: <AlertTriangle size={16} />,
      color: '#3b82f6',
      trend: { value: 12, label: 'vs yesterday' },
    },
    {
      title: 'Critical Alerts',
      value: criticalCount,
      subtitle: 'Immediate action needed',
      icon: <Shield size={16} />,
      color: '#ef4444',
      glow: criticalCount > 0,
    },
    {
      title: 'Failed Logins',
      value: failedLogins.toLocaleString(),
      subtitle: 'Authentication failures',
      icon: <UserX size={16} />,
      color: '#f97316',
      trend: { value: 8, label: 'vs yesterday' },
    },
    {
      title: 'Malware Detections',
      value: malware,
      subtitle: 'Threats detected',
      icon: <Bug size={16} />,
      color: '#f59e0b',
    },
    {
      title: 'Active Agents',
      value: `${activeAgents}/${MOCK_AGENTS.length}`,
      subtitle: 'Endpoints monitored',
      icon: <Cpu size={16} />,
      color: '#10b981',
    },
    {
      title: 'Open Incidents',
      value: 3,
      subtitle: 'Require investigation',
      icon: <Activity size={16} />,
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
      gap: 16,
    }}>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
