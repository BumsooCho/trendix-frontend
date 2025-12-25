'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

// --- 기존 ChannelAnalysisClient.tsx에서 가져온 더미 데이터 및 헬퍼 함수 ---
interface ChannelVideo {
    id: string
    title: string
    thumbnailUrl: string
    viewCount: number
    trendAvgViewCount: number
    publishedAt: string
    performance: 'above' | 'average' | 'below'
}

interface ChannelData {
    channelId: string
    channelName: string
    channelThumbnail: string
    subscriberCount: number
    totalVideos: number
    overallPerformance: number // 트렌드 대비 성과 (%)
}

// 더미 데이터 (위젯에 맞게 간소화)
const getDummyChannelData = (): ChannelData => ({
    channelId: 'UCxxxxxx',
    channelName: 'Trendix 분석 채널',
    channelThumbnail: 'https://picsum.photos/seed/trendixchannel/100/100',
    subscriberCount: 125000,
    totalVideos: 342,
    overallPerformance: 78,
    recentVideos: [
        {
            id: 'v1',
            title: '최근 영상1 - 트렌드 상회',
            thumbnailUrl: 'https://picsum.photos/seed/widgetv1/160/90',
            viewCount: 45000,
            trendAvgViewCount: 32000,
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            performance: 'above',
        },
        {
            id: 'v2',
            title: '최근 영상2 - 평균 수준',
            thumbnailUrl: 'https://picsum.photos/seed/widgetv2/160/90',
            viewCount: 28000,
            trendAvgViewCount: 30000,
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            performance: 'average',
        },
    ],
});

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

function getPerformanceColor(performance: string) {
    switch (performance) {
        case 'above': return 'text-green-600 bg-green-50'
        case 'average': return 'text-yellow-600 bg-yellow-50'
        case 'below': return 'text-red-600 bg-red-50'
        default: return 'text-gray-600 bg-gray-50'
    }
}

function getPerformanceLabel(performance: string) {
    switch (performance) {
        case 'above': return '트렌드 상회'
        case 'average': return '평균 수준'
        case 'below': return '트렌드 하회'
        default: return '-'
    }
}
// --- 끝 ---

const ChannelAnalysisWidget = () => {
    const [channelData, setChannelData] = useState<ChannelData | null>(null);

    useEffect(() => {
        // 위젯 로드 시 더미 데이터 즉시 로드
        setChannelData(getDummyChannelData());
    }, []);

    if (!channelData) {
        return <div className="flex items-center justify-center w-full h-full text-gray-500">로딩 중...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-800 mb-4">내 채널 분석 요약</h3>
            
            {/* 채널 개요 */}
            <div className="flex items-center gap-3 mb-4">
                <Image
                    src={channelData.channelThumbnail}
                    alt={channelData.channelName}
                    width={40}
                    height={40}
                    className="rounded-full flex-shrink-0"
                />
                <div>
                    <h4 className="font-medium text-gray-900 line-clamp-1">{channelData.channelName}</h4>
                    <p className="text-sm text-gray-500">구독자 {formatNumber(channelData.subscriberCount)}명</p>
                </div>
            </div>

            {/* 성과 요약 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 text-center mb-4">
                <div className="text-3xl font-bold text-primary">{channelData.overallPerformance}%</div>
                <div className="text-xs text-gray-600">트렌드 대비 종합 성과</div>
            </div>

            {/* 최근 영상 분석 (상위 2개) */}
            <div className="mb-4">
                <h5 className="font-semibold text-gray-700 mb-2">최근 영상 성과</h5>
                {channelData.recentVideos.slice(0, 2).map((video) => (
                    <div key={video.id} className="flex items-center gap-2 mb-2 p-2 border rounded-md text-sm">
                        <div className="relative w-16 h-9 flex-shrink-0">
                            <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover rounded-sm" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="line-clamp-1 text-gray-800">{video.title}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(video.performance)}`}>
                                {getPerformanceLabel(video.performance)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 전체 분석 페이지로 이동 버튼 */}
            <Link 
                href="/channel"
                className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-center text-sm flex items-center justify-center gap-1"
            >
                전체 분석 페이지로 이동 <Icon icon="mdi:arrow-right" />
            </Link>
        </div>
    );
};

export default ChannelAnalysisWidget;