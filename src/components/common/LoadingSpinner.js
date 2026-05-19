import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LoadingSpinner({ size = 24, color = '#3b82f6' }) {
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }, children: [_jsx("div", { style: {
                    width: size,
                    height: size,
                    border: `2px solid ${color}33`,
                    borderTop: `2px solid ${color}`,
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                } }), _jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })] }));
}
