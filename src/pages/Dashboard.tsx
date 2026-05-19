import Layout from '@/components/layout/Layout';
import StatsRow from '@/components/dashboard/StatsRow';
import AlertTimeline from '@/components/dashboard/AlertTimeline';
import AlertSeverityChart from '@/components/dashboard/AlertSeverityChart';
import TopHostsChart from '@/components/dashboard/TopHostsChart';
import LiveAlertFeed from '@/components/dashboard/LiveAlertFeed';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import AlertTable from '@/components/common/AlertTable';
import { useAlertStore } from '@/store/alertStore';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { alerts } = useAlertStore();
  const recentAlerts = alerts.slice(0, 10);

  return (
    <Layout title="Security Operations Center">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Stats Row */}
        <StatsRow />

        {/* Row 2: Timeline + Severity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <AlertTimeline />
          <AlertSeverityChart />
        </div>

        {/* Row 3: Top Hosts + Live Feed + AI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <TopHostsChart />
          <LiveAlertFeed />
          <AIInsightPanel />
        </div>

        {/* Recent Alerts Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Alerts</h3>
            <Link
              to="/alerts"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none',
              }}
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <AlertTable alerts={recentAlerts} limit={10} />
        </div>
      </div>
    </Layout>
  );
}
