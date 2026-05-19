import { create } from 'zustand';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: `# Welcome to SOC Nexus AI 🛡️\n\nI'm your AI-powered security analyst. I can help you:\n\n- **Analyze alerts** — paste any Wazuh alert for instant analysis\n- **Threat hunting** — "Show failed logins in last 24 hours"\n- **Incident response** — get step-by-step playbooks\n- **MITRE ATT&CK** — map techniques to your alerts\n- **Generate reports** — create professional incident summaries\n\nWhat can I help you investigate today?`,
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, i) =>
        i === state.messages.length - 1 ? { ...msg, content, loading: false } : msg
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearChat: () =>
    set({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: `# Welcome to SOC Nexus AI 🛡️\n\nI'm your AI-powered security analyst. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
