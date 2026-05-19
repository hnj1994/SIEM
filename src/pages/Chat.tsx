import { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { useChatStore } from '@/store/chatStore';
import { useAlertStore } from '@/store/alertStore';
import { streamOllamaChat, OllamaMessage } from '@/api/ollamaApi';
import { Send, Trash2, Bot, User, StopCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { ChatMessage } from '@/types';

const SUGGESTED = [
  'Show me a summary of critical alerts from today',
  'Explain MITRE ATT&CK T1110 technique',
  'What are the top 5 attack vectors I should monitor?',
  'Generate an incident response playbook for ransomware',
  'How do I investigate suspicious PowerShell activity?',
  'What does a successful brute force attack look like in logs?',
];

export default function Chat() {
  const { messages, addMessage, updateLastMessage, setLoading, isLoading, clearChat } = useChatStore();
  const { alerts } = useAlertStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    const assistantMsg: ChatMessage = {
      id: String(Date.now() + 1),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      loading: true,
    };
    addMessage(assistantMsg);
    setLoading(true);

    abortRef.current = new AbortController();
    let accumulated = '';

    try {
      const history: OllamaMessage[] = messages
        .filter(m => m.role !== 'system' && m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      history.push({ role: 'user', content: text });

      for await (const chunk of streamOllamaChat(history, abortRef.current.signal)) {
        accumulated += chunk;
        updateLastMessage(accumulated);
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        updateLastMessage('⚠️ Unable to connect to Ollama. Make sure your Ollama server is running at `http://10.0.0.4:11434`.\n\nIn demo mode, I can still help with general security questions using my training data.');
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading, addMessage, updateLastMessage, setLoading]);

  const stopGeneration = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <Layout title="AI SOC Copilot">
      <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 16 }}>
        {/* Sidebar */}
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested</div>
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 0', paddingBottom: 8, marginBottom: 8,
                  background: 'transparent', border: 'none',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  fontSize: 12, lineHeight: 1.4,
                } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.color = '#3b82f6')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Sparkles size={10} style={{ marginRight: 4, opacity: 0.6 }} />
                {s}
              </button>
            ))}
          </div>

          <div className="card">
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Context</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {alerts.length} alerts loaded<br />
              Model: llama3<br />
              Server: 10.0.0.4:11434
            </div>
          </div>

          <button onClick={clearChat} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
            <Trash2 size={12} /> Clear Chat
          </button>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: 16, borderTop: '1px solid var(--border)',
            display: 'flex', gap: 10, alignItems: 'flex-end',
          }}>
            <textarea
              className="input"
              style={{
                flex: 1, resize: 'none', minHeight: 44, maxHeight: 120,
                lineHeight: 1.5, fontSize: 14,
              }}
              placeholder="Ask anything about your security alerts..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              rows={1}
            />
            {isLoading ? (
              <button onClick={stopGeneration} className="btn-secondary" style={{ height: 44, padding: '0 16px' }}>
                <StopCircle size={16} />
              </button>
            ) : (
              <button
                onClick={() => sendMessage(input)}
                className="btn-primary"
                style={{ height: 44, padding: '0 16px' }}
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 20,
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUser ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
      </div>
      <div style={{ maxWidth: '80%' }}>
        <div style={{
          padding: '12px 16px',
          background: isUser ? 'rgba(59,130,246,0.15)' : 'var(--bg-card-hover)',
          border: `1px solid ${isUser ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
          borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)',
        }}>
          {message.loading ? (
            <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6',
                  animation: `bounce 1s ${i * 0.15}s infinite`,
                }} />
              ))}
              <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} } @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
      </div>
    </div>
  );
}
