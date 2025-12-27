import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { messages, conversationId } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response('Invalid messages format', { status: 400 });
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                let backendReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const response = await fetch(`${apiUrl}/chat/stream`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messages,
                            conversationId,
                        }),
                        signal: request.signal,
                    });

                    if (!response.ok) {
                        throw new Error(`API error: ${response.status}`);
                    }

                    backendReader = response.body?.getReader() || null;
                    if (!backendReader) {
                        throw new Error('No response body');
                    }

                    const decoder = new TextDecoder();

                    // 백엔드에서 스트리밍 응답을 받아서 클라이언트로 전달
                    while (true) {
                        const { done, value } = await backendReader.read();

                        if (done) {
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                            controller.close();
                            break;
                        }

                        // 백엔드 응답을 그대로 전달 (이미 SSE 형식: "data: {...}\n\n")
                        const chunk = decoder.decode(value, { stream: true });
                        controller.enqueue(encoder.encode(chunk));
                    }
                } catch (error) {
                    if (error instanceof Error && error.name === 'AbortError') {
                        console.log('Request aborted by client');
                        // ⭐ 백엔드 reader 정리
                        if (backendReader) {
                            try {
                                await backendReader.cancel();
                            } catch (e) {
                                console.error('Error cancelling reader:', e);
                            }
                        }
                        controller.close();
                        return;
                    }

                    console.error('Stream error:', error);
                    const errorMessage = JSON.stringify({
                        error: 'Failed to get response from AI',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    });
                    controller.enqueue(encoder.encode(`data: ${errorMessage}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            },
        });
    } catch (error) {
        console.error('API route error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}