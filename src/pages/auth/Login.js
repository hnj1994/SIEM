import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
        if (useAuthStore.getState().isAuthenticated) {
            navigate('/');
        }
    };
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        }, children: [_jsx("div", { style: {
                    position: 'absolute', top: '20%', left: '10%',
                    width: 400, height: 400, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.05)', filter: 'blur(80px)',
                } }), _jsx("div", { style: {
                    position: 'absolute', bottom: '20%', right: '10%',
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'rgba(139,92,246,0.07)', filter: 'blur(60px)',
                } }), _jsx("div", { style: {
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.3,
                } }), _jsxs("div", { style: {
                    position: 'relative', zIndex: 1,
                    width: '100%', maxWidth: 420, padding: '0 20px',
                }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: 40 }, children: [_jsx("div", { style: {
                                    width: 64, height: 64, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    boxShadow: '0 0 40px rgba(59,130,246,0.4)',
                                }, children: _jsx(Shield, { size: 32, color: "white" }) }), _jsx("h1", { style: { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }, children: "SOC Nexus" }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-muted)' }, children: "AI-Powered Security Operations Center" })] }), _jsxs("div", { className: "glass-bright", style: { borderRadius: 16, padding: 32 }, children: [_jsx("h2", { style: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }, children: "Sign In" }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }, children: "Connect to your Wazuh instance" }), error && (_jsxs("div", { style: {
                                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    fontSize: 13, color: '#ef4444',
                                }, children: [_jsx(AlertCircle, { size: 14 }), error] })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsxs("div", { children: [_jsx("label", { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }, children: "USERNAME" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(User, { size: 14, style: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } }), _jsx("input", { className: "input", style: { width: '100%', paddingLeft: 36 }, placeholder: "admin", value: username, onChange: e => setUsername(e.target.value), required: true, autoFocus: true })] })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }, children: "PASSWORD" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Lock, { size: 14, style: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } }), _jsx("input", { className: "input", style: { width: '100%', paddingLeft: 36, paddingRight: 36 }, type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: e => setPassword(e.target.value), required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), style: {
                                                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                                            background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                                        }, children: showPassword ? _jsx(EyeOff, { size: 14 }) : _jsx(Eye, { size: 14 }) })] })] }), _jsx("button", { type: "submit", className: "btn-primary", style: { width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: 15 }, disabled: isLoading, children: isLoading ? 'Authenticating...' : 'Sign In to SOC Nexus' })] }), _jsxs("div", { style: {
                                    marginTop: 20, padding: '12px', background: 'rgba(59,130,246,0.08)',
                                    borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)',
                                }, children: [_jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }, children: "Demo credentials:" }), _jsxs("p", { style: { fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }, children: ["admin / demo123 \u00A0 (Admin)", _jsx("br", {}), "analyst / demo123 (Analyst)"] })] })] }), _jsx("p", { style: { textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20 }, children: "SOC Nexus v1.0.0 \u2022 Powered by Wazuh + Ollama" })] })] }));
}
