'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

// --- VideoCompareClient.tsx에서 가져온 로직과 타입 ---
interface CompareVideo {
    id: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    viewGrowthRate: number; // 조회수 증가율 (%)
    likeRatio: number; // 좋아요 비율 (%)
    tags: string[];
}

const getDummyVideo = (id: string, isFirst: boolean): CompareVideo => ({
    id,
    title: isFirst ? '[더미 A] 오늘 발표된 새로운 정책' : '[더미 B] 정책 분석 및 영향',
    channelName: isFirst ? '뉴스채널 A' : '경제분석TV',
    thumbnailUrl: `https://picsum.photos/seed/${id}/320/180`,
    viewCount: isFirst ? 1250000 : 890000,
    likeCount: isFirst ? 85000 : 62000,
    commentCount: isFirst ? 3200 : 2100,
    viewGrowthRate: isFirst ? 450 : 280,
    likeRatio: isFirst ? 6.8 : 7.0,
    tags: isFirst ? ['뉴스', '속보', '정책'] : ['경제', '분석', '정책'],
});

function formatNumber(num: number): string {
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    return num.toLocaleString();
}

function getWinner(a: number, b: number): 'A' | 'B' | 'tie' {
    if (a > b) return 'A';
    if (b > a) return 'B';
    return 'tie';
}

// --- 위젯용으로 재구성된 UI 및 로직 ---

interface CompactVideoInputProps {
    label: string;
    videoUrl: string;
    onUrlChange: (url: string) => void;
    onAnalyze: () => void;
    loading: boolean;
}

function CompactVideoInput({ label, videoUrl, onUrlChange, onAnalyze, loading }: CompactVideoInputProps) {
    return (
        <div>
            <label className='block text-xs font-medium text-gray-600 mb-1'>{label}</label>
            <div className='flex gap-2'>
                <input
                    type='text'
                    value={videoUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder='영상 URL'
                    className='flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent outline-none'
                />
                <button
                    onClick={onAnalyze}
                    disabled={loading || !videoUrl.trim()}
                    className='px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary/90 disabled:bg-gray-300'
                >
                    {loading ? '...' : '분석'}
                </button>
            </div>
        </div>
    );
}

const VideoCompareWidget = () => {
    const [videoUrlA, setVideoUrlA] = useState('');
    const [videoUrlB, setVideoUrlB] = useState('');
    const [videoA, setVideoA] = useState<CompareVideo | null>(null);
    const [videoB, setVideoB] = useState<CompareVideo | null>(null);
    const [loadingA, setLoadingA] = useState(false);
    const [loadingB, setLoadingB] = useState(false);

    const analyzeVideoA = () => {
        setLoadingA(true);
        setTimeout(() => {
            setVideoA(getDummyVideo(videoUrlA || 'videoA', true));
            setLoadingA(false);
        }, 800);
    };

    const analyzeVideoB = () => {
        setLoadingB(true);
        setTimeout(() => {
            setVideoB(getDummyVideo(videoUrlB || 'videoB', false));
            setLoadingB(false);
        }, 800);
    };
    
    return (
        <div className="w-full h-full flex flex-col p-3 overflow-y-auto">
            {/* Input Section */}
            <div className="flex flex-col gap-3 mb-3">
                <CompactVideoInput
                    label='영상 A'
                    videoUrl={videoUrlA}
                    onUrlChange={setVideoUrlA}
                    onAnalyze={analyzeVideoA}
                    loading={loadingA}
                />
                <CompactVideoInput
                    label='영상 B'
                    videoUrl={videoUrlB}
                    onUrlChange={setVideoUrlB}
                    onAnalyze={analyzeVideoB}
                    loading={loadingB}
                />
            </div>

            {/* Result Section */}
            {videoA && videoB ? (
                <div className="flex-1 flex flex-col">
                    <div className='grid grid-cols-2 gap-2 mb-2'>
                        {[videoA, videoB].map((video, index) => (
                             <div key={index} className="text-center">
                                <div className="relative w-full aspect-video rounded-md overflow-hidden mb-1">
                                    <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                                </div>
                                <p className="text-xs font-medium line-clamp-2">{video.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className='bg-gray-50 rounded-lg p-2 text-xs'>
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className={`font-bold ${getWinner(videoA.viewCount, videoB.viewCount) === 'A' ? 'text-blue-600' : 'text-gray-700'}`}>{formatNumber(videoA.viewCount)}</span>
                            <span className="text-gray-500">조회수</span>
                            <span className={`font-bold ${getWinner(videoA.viewCount, videoB.viewCount) === 'B' ? 'text-blue-600' : 'text-gray-700'}`}>{formatNumber(videoB.viewCount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className={`font-bold ${getWinner(videoA.likeCount, videoB.likeCount) === 'A' ? 'text-blue-600' : 'text-gray-700'}`}>{formatNumber(videoA.likeCount)}</span>
                            <span className="text-gray-500">좋아요</span>
                            <span className={`font-bold ${getWinner(videoA.likeCount, videoB.likeCount) === 'B' ? 'text-blue-600' : 'text-gray-700'}`}>{formatNumber(videoB.likeCount)}</span>
                        </div>
                         <div className="flex justify-between items-center py-1">
                            <span className={`font-bold ${getWinner(videoA.commentCount, videoB.commentCount) === 'A' ? 'text-blue-600' : 'text-gray-700'}`}>{formatNumber(videoA.commentCount)}</span>
                            <span className="text-gray-500">댓글</span>
                            <span className={`font-bold ${getWinner(videoA.commentCount, videoB.commentCount) === 'B' ? 'text-blue-600' : 'text-gray-700'}`}>{formatNumber(videoB.commentCount)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg p-4">
                    <Icon icon="mdi:video-compare-outline" className="text-4xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">비교할 두 영상의 URL을 입력해주세요.</p>
                </div>
            )}
        </div>
    );
};

export default VideoCompareWidget;
