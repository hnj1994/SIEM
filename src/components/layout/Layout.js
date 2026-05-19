import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from './Sidebar';
import Topbar from './Topbar';
export default function Layout({ children, title }) {
    return (_jsxs("div", { style: { display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }, children: [_jsx(Sidebar, {}), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }, children: [_jsx(Topbar, { title: title }), _jsx("main", { style: { flex: 1, overflow: 'auto', padding: '20px' }, children: children })] })] }));
}
