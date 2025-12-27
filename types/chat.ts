export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    timestamp: Date;
    videos?: Video[];
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
}

export interface ChatResponse {
    message: string;
    conversationId: string;
    done: boolean;
}
