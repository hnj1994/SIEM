import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/Dashboard';
import Alerts from '@/pages/Alerts';
import AlertDetail from '@/pages/AlertDetail';
import ThreatHunting from '@/pages/ThreatHunting';
import MitreAttack from '@/pages/MitreAttack';
import Chat from '@/pages/Chat';
import Incidents from '@/pages/Incidents';
import Agents from '@/pages/Agents';
import Compliance from '@/pages/Compliance';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
            retry: 1,
        },
    },
});
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
}
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/alerts", element: _jsx(ProtectedRoute, { children: _jsx(Alerts, {}) }) }), _jsx(Route, { path: "/alerts/:id", element: _jsx(ProtectedRoute, { children: _jsx(AlertDetail, {}) }) }), _jsx(Route, { path: "/hunting", element: _jsx(ProtectedRoute, { children: _jsx(ThreatHunting, {}) }) }), _jsx(Route, { path: "/mitre", element: _jsx(ProtectedRoute, { children: _jsx(MitreAttack, {}) }) }), _jsx(Route, { path: "/chat", element: _jsx(ProtectedRoute, { children: _jsx(Chat, {}) }) }), _jsx(Route, { path: "/incidents", element: _jsx(ProtectedRoute, { children: _jsx(Incidents, {}) }) }), _jsx(Route, { path: "/agents", element: _jsx(ProtectedRoute, { children: _jsx(Agents, {}) }) }), _jsx(Route, { path: "/compliance", element: _jsx(ProtectedRoute, { children: _jsx(Compliance, {}) }) }), _jsx(Route, { path: "/reports", element: _jsx(ProtectedRoute, { children: _jsx(Reports, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(Settings, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
