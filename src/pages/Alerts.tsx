import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AlertTable from '@/components/common/AlertTable';
import { useAlertStore } from '@/store/alertStore';
import { Filter, Download, RefreshCw, Search } from 'lucide-react';

export default function Alerts() {
  const { filters, setFilters, getFilteredAlerts } = useAlertStore();
  const [searchParams] = useSearchParams();
  const filteredAlerts = getFilteredAlerts();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) setFilters({ search });
  }, [searchParams]);

  const exportCSV = () => {
    const headers = ['Timestamp', 'Severity', 'Rule ID', 'Description', 'Agent', 'Agent IP'];
    const rows = filteredAlerts.map(a => [
      a.timestamp, a.rule.level, a.rule.id, a.rule.description, a.agent.name, a.agent.ip,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soc-alerts-${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <Layout title="Alert Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Filters Bar */}
        <div className="card" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                style={{ width: '100%', paddingLeft: 30, fontSize: 13 }}
                placeholder="Search alerts..."
                value={filters.search}
                onChange={e => setFilters({ search: e.target.value })}
              />
            </div>

            {/* Severity filter */}
            <select
              className="input"
              style={{ width: 140, fontSize: 13 }}
              value={filters.severity}
              onChange={e => setFilters({ severity: e.target.value as typeof filters.severity })}
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>

            {/* Time range */}
            <select
              className="input"
              style={{ width: 140, fontSize: 13 }}
              value={filters.timeRange}
              onChange={e => setFilters({ timeRange: e.target.value as typeof filters.timeRange })}
            >
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Agent filter */}
            <input
              className="input"
              style={{ width: 160, fontSize: 13 }}
              placeholder="Filter by agent..."
              value={filters.agent}
              onChange={e => setFilters({ agent: e.target.value })}
            />

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setFilters({ severity: 'all', agent: '', search: '', timeRange: '24h' })} className="btn-secondary" style={{ fontSize: 12 }}>
                <RefreshCw size={12} /> Reset
              </button>
              <button onClick={exportCSV} className="btn-secondary" style={{ fontSize: 12 }}>
                <Download size={12} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredAlerts.length.toLocaleString()}</strong> alerts
            </span>
          </div>
          <AlertTable alerts={filteredAlerts} />
        </div>
      </div>
    </Layout>
  );
}
