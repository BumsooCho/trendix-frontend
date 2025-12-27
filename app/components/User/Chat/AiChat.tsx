'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import toast from 'react-hot-toast';

export default function AiChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [conversationId, setConversationId] = useState<string>('');
    const abortControllerRef = useRef<AbortController | null>(null);

    // 컴포넌트 마운트 시 conversationId 생성
    useEffect(() => {
        setConversationId(`conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    const handleStopStreaming = useCallback(() => {
        console.log('Stopping stream...', conversationId);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();  // ⭐ 이게 백엔드까지 전파됨
            abortControllerRef.current = null;
            setIsStreaming(false);
            setIsLoading(false);
            toast.success('응답 생성이 중지되었습니다.');
        }
    }, [conversationId]);

    const handleSendMessage = useCallback(async (content: string) => {
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setIsStreaming(true);

        // ⭐ 새로운 AbortController 생성
        abortControllerRef.current = new AbortController();

        try {
            // 현재 메시지까지 포함된 전체 메시지 리스트 생성
            const newMessages = [...messages, userMessage];

            // 백엔드로 보낼 메시지 리스트 (id, timestamp 등 제외하고 role, content만 전송)
            const apiMessages = newMessages.map(({ role, content }) => ({
                role,
                content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    conversationId,
                }),
                signal: abortControllerRef.current.signal,  // ⭐ signal 연결
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            const assistantMessageId = `assistant-${Date.now()}`;

            setMessages((prev) => [...prev, {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            }]);

            setIsLoading(false);

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            continue;
                        }

                        if (line.startsWith('event: error')) {
                            console.error('Stream error:', data);
                            toast.error('AI 응답 중 오류가 발생했습니다.');
                            continue;
                        }

                        // conversationId 체크 및 content 추출
                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.conversationId) {
                                console.log('Received conversationId:', parsed.conversationId);
                                continue;
                            }

                            // 백엔드에서 videos 데이터 처리
                            if (parsed.videos) {
                                setMessages((prev) => {
                                    return prev.map((msg) =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, videos: parsed.videos }
                                            : msg
                                    );
                                });
                                continue;
                            }

                            // 백엔드에서 {"content": "..."} 형식으로 보냄
                            if (parsed.content) {
                                setMessages((prev) => {
                                    return prev.map((msg) =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, content: msg.content + parsed.content }
                                            : msg
                                    );
                                });
                            }
                        } catch {
                            // JSON이 아니면 일반 텍스트로 처리
                            if (data) {
                                setMessages((prev) => {
                                    return prev.map((msg) =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, content: msg.content + data }
                                            : msg
                                    );
                                });
                            }
                        }
                    }
                }
            }

            setIsStreaming(false);
            abortControllerRef.current = null;
        } catch (error) {
            // ⭐ AbortError는 정상적인 중지이므로 에러로 처리하지 않음
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Stream aborted by user');
                setIsStreaming(false);
                setIsLoading(false);
                return;
            }
            console.error('Error sending message:', error);
            toast.error('메시지 전송에 실패했습니다.');
            setIsLoading(false);
            setIsStreaming(false);
            abortControllerRef.current = null;

            setMessages((prev) => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1]?.role === 'assistant' &&
                    newMessages[newMessages.length - 1]?.content === '') {
                    newMessages.pop();
                }
                return newMessages;
            });
        }
    }, [conversationId, messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 shadow-lg">
                <h1 className="text-2xl font-bold">Trendix 채팅</h1>
                <p className="text-sm text-blue-100 mt-1">콘텐츠 추천 및 가이드를 알려드립니다.</p>
            </div>

            {/* Chat Container */}
            <ChatContainer messages={messages} isLoading={isLoading} isStreaming={isStreaming} />

            {/* Input */}
            <ChatInput
                onSend={handleSendMessage}
                onStop={handleStopStreaming}
                disabled={isLoading}
                isStreaming={isStreaming}
            />
        </div>
    );
}