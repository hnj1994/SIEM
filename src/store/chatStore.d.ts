import { ChatMessage } from '@/types';
interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    addMessage: (message: ChatMessage) => void;
    updateLastMessage: (content: string) => void;
    setLoading: (loading: boolean) => void;
    clearChat: () => void;
}
export declare const useChatStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ChatState>>;
export {};
