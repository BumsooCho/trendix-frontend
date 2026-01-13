'use client';

import { useVideo } from "@/context/VideoContext";

export default function MainDetailPage() {
    const { selectedVideo: video, isLoading } = useVideo();

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 animate-pulse">
                <div className="h-9 bg-gray-200 rounded w-3/4 mb-4"></div>

                <div className="aspect-video w-full rounded-xl bg-gray-200 mb-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="space-y-4">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                            <div className="grid grid-cols-3 gap-4 mt-1">
                                <div className="h-14 bg-gray-200 rounded"></div>
                                <div className="h-14 bg-gray-200 rounded"></div>
                                <div className="h-14 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        <div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                    <div className="h-2 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto mt-4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!video) {
        return <div className="p-8 text-center text-gray-500">비디오 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 mb-6">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.video_id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">채널</h2>
                        <p className="text-lg font-semibold">{video.channel_username?.replace("@", "")}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">플랫폼</h2>
                        <p className="inline-block px-2 py-1 rounded bg-gray-100 text-sm font-medium">{video.platform}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">카테고리</h2>
                        <p className="text-gray-900">{video.category}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">통계</h2>
                        <div className="grid grid-cols-3 gap-4 mt-1">
                            <div className="text-center p-2 bg-gray-50 rounded">
                                <span className="block text-xs text-gray-500">조회수</span>
                                <span className="font-bold text-blue-600">{video.view_count.toLocaleString()}</span>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                                <span className="block text-xs text-gray-500">좋아요</span>
                                <span className="font-bold text-red-500">{video.like_count.toLocaleString()}</span>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                                <span className="block text-xs text-gray-500">댓글</span>
                                <span className="font-bold text-green-600">{video.comment_count.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">분석 점수</h2>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>긍정적</span>
                                    <span>{video.sentiment_score * 100}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, video.sentiment_score * 100))}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 text-right mt-4">
                        분석일: {video.crawled_at ? new Date(video.crawled_at).toLocaleDateString() : new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>

        </div>
    )
}