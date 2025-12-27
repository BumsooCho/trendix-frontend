'use client';

import { ChatMessage as ChatMessageType } from '@/types/chat';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatVideoList from './ChatVideoList';

interface ChatMessageProps {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isEmpty = !message.content || message.content.trim() === '';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={` ${message.videos?.length ? 'w-full max-w-none' : 'max-w-[80%]'} rounded-2xl px-4 py-3 ${isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}>
                {isEmpty && !isUser ? (
                    <div className="flex items-center gap-2">
                        {/* 로딩 애니메이션 */}
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                ) : (
                    <>
                        {message.videos && message.videos.length > 0 && (
                            <ChatVideoList videos={message.videos} />
                        )}
                        {/* prose: 마크다운 요소에 기본 여백과 스타일 부여
                            prose-sm: 폰트 크기 최적화
                            prose-invert: 어두운 배경에서 글자색을 밝게 반전 (사용자 메시지용)
                        */}
                        <div className={`prose prose-sm max-w-none break-words ${isUser ? 'prose-invert' : 'dark:prose-invert'
                            }`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                        <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
                            {format(new Date(message.timestamp), 'yyyy-MM-dd HH:mm')}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}