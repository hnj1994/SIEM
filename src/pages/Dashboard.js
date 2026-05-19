import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Layout, { title: "Security Operations Center", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsx(StatsRow, {}), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, children: [_jsx(AlertTimeline, {}), _jsx(AlertSeverityChart, {})] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }, children: [_jsx(TopHostsChart, {}), _jsx(LiveAlertFeed, {}), _jsx(AIInsightPanel, {})] }), _jsxs("div", { className: "card", style: { padding: 0, overflow: 'hidden' }, children: [_jsxs("div", { style: {
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px 20px', borderBottom: '1px solid var(--border)',
                            }, children: [_jsx("h3", { style: { fontSize: 14, fontWeight: 600 }, children: "Recent Alerts" }), _jsxs(Link, { to: "/alerts", style: {
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none',
                                    }, children: ["View All ", _jsx(ArrowRight, { size: 12 })] })] }), _jsx(AlertTable, { alerts: recentAlerts, limit: 10 })] })] }) }));
}
