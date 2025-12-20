'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PlatformTabs, { Platform } from './PlatformTabs'
import CategoryTabs, { youtubeCategories } from './CategoryTabs'
import VideoCard, { Video } from './VideoCard'
import VideoDetailModal from './VideoDetailModal'
import { Icon } from '@iconify/react/dist/iconify.js'

// 전체 TOP 8 더미 데이터
const globalTop8: Video[] = [
    { id: 'g1', title: '[속보] 오늘 발표된 새로운 정책, 전문가들의 반응은?', channelName: '뉴스채널 A', channelId: 'ch1', thumbnailUrl: 'https://picsum.photos/seed/g1/400/225', viewCount: 1250000, viewCountChange: 450000, likeCount: 85000, likeCountChange: 12000, publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), duration: '12:34', categoryId: '25', isShort: false, trendingRank: 1, trendingReason: '3시간 만에 조회수 45만 급등' },
    { id: 'g2', title: '이 게임 실화냐? 출시 3일 만에 스팀 1위', channelName: '게임채널', channelId: 'ch2', thumbnailUrl: 'https://picsum.photos/seed/g2/400/225', viewCount: 890000, viewCountChange: 320000, likeCount: 67000, likeCountChange: 8500, publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), duration: '18:22', categoryId: '20', isShort: false, trendingRank: 2, trendingReason: '게임 카테고리 1위' },
    { id: 'g3', title: '단 15초 만에 100만뷰 달성한 비결 #shorts', channelName: '쇼츠마스터', channelId: 'ch3', thumbnailUrl: 'https://picsum.photos/seed/g3/400/225', viewCount: 2100000, viewCountChange: 1800000, likeCount: 180000, likeCountChange: 45000, publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), duration: '0:15', categoryId: '24', isShort: true, trendingRank: 3, trendingReason: 'Shorts 좋아요 급증' },
    { id: 'g4', title: '아이유 신곡 첫 공개 무대! 역대급 라이브', channelName: '음악의 신', channelId: 'ch4', thumbnailUrl: 'https://picsum.photos/seed/g4/400/225', viewCount: 3500000, viewCountChange: 890000, likeCount: 290000, likeCountChange: 67000, publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), duration: '4:32', categoryId: '10', isShort: false, trendingRank: 4, trendingReason: '음악 카테고리 최다 조회' },
    { id: 'g5', title: '프리미어리그 | 손흥민 결승골 폭발', channelName: '스포츠 투데이', channelId: 'ch5', thumbnailUrl: 'https://picsum.photos/seed/g5/400/225', viewCount: 780000, viewCountChange: 280000, likeCount: 52000, likeCountChange: 9800, publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), duration: '8:45', categoryId: '17', isShort: false, trendingRank: 5, trendingReason: '스포츠 카테고리 급상승' },
    { id: 'g6', title: '2024 헤어 트렌드 총정리', channelName: '스타일리스트K', channelId: 'ch6', thumbnailUrl: 'https://picsum.photos/seed/g6/400/225', viewCount: 567000, viewCountChange: 234000, likeCount: 41000, likeCountChange: 7800, publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), duration: '11:55', categoryId: '26', isShort: false, trendingRank: 6, trendingReason: '노하우 카테고리 좋아요 급증' },
    { id: 'g7', title: '최신 AI 기술로 만든 놀라운 결과물', channelName: '테크리뷰', channelId: 'ch7', thumbnailUrl: 'https://picsum.photos/seed/g7/400/225', viewCount: 456000, viewCountChange: 156000, likeCount: 34000, likeCountChange: 5600, publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), duration: '15:20', categoryId: '28', isShort: false, trendingRank: 7, trendingReason: '과학기술 카테고리 급등' },
    { id: 'g8', title: '오늘의 주요 뉴스 브리핑', channelName: '뉴스채널 B', channelId: 'ch8', thumbnailUrl: 'https://picsum.photos/seed/g8/400/225', viewCount: 340000, viewCountChange: 120000, likeCount: 28000, likeCountChange: 4200, publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), duration: '9:20', categoryId: '25', isShort: false, trendingRank: 8, trendingReason: '뉴스 카테고리 상승' },
]

// 카테고리별 TOP 8 더미 데이터 생성 함수
const generateCategoryVideos = (categoryId: string, categoryName: string): Video[] => {
    return Array.from({ length: 8 }, (_, i) => ({
        id: `cat${categoryId}-${i + 1}`,
        title: `${categoryName} 인기 영상 ${i + 1}위 - 지금 화제인 콘텐츠`,
        channelName: `${categoryName} 채널 ${i + 1}`,
        channelId: `ch-${categoryId}-${i + 1}`,
        thumbnailUrl: `https://picsum.photos/seed/${categoryId}-${i}/400/225`,
        viewCount: 1000000 - (i * 80000),
        viewCountChange: 300000 - (i * 25000),
        likeCount: 80000 - (i * 6000),
        likeCountChange: 10000 - (i * 800),
        publishedAt: new Date(Date.now() - (i + 2) * 60 * 60 * 1000).toISOString(),
        duration: `${10 + i}:${30 + i}`,
        categoryId,
        isShort: i % 4 === 0,
        trendingRank: i + 1,
        trendingReason: `${categoryName} 카테고리 ${i + 1}위 급등 영상`,
    }))
}

// 카테고리별 데이터 맵
const categoryVideosMap: Record<string, Video[]> = {
    '10': generateCategoryVideos('10', '음악'),
    '20': generateCategoryVideos('20', '게임'),
    '24': generateCategoryVideos('24', '엔터테인먼트'),
    '17': generateCategoryVideos('17', '스포츠'),
    '25': generateCategoryVideos('25', '뉴스'),
    '22': generateCategoryVideos('22', '브이로그'),
    '26': generateCategoryVideos('26', '노하우/스타일'),
    '28': generateCategoryVideos('28', '과학기술'),
}

export default function TrendingVideos() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube')
    // URL에서 카테고리 읽어오기 (뒤로가기 시 유지됨)
    const [selectedCategory, setSelectedCategory] = useState<string>(
        searchParams.get('category') || 'all'
    )
    // 모달용 선택된 영상
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

    // 카테고리 변경 시 URL 업데이트 (해시 없이)
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        const params = new URLSearchParams(searchParams.toString())
        if (categoryId === 'all') {
            params.delete('category')
        } else {
            params.set('category', categoryId)
        }
        const queryString = params.toString()
        router.replace(queryString ? `/?${queryString}` : '/', { scroll: false })
    }

    // 영상 클릭 시 모달 열기
    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video)
    }

    // 카테고리별 필터링: 전체는 globalTop8, 개별 카테고리는 해당 카테고리 TOP 8
    const filteredVideos = selectedCategory === 'all'
        ? globalTop8
        : categoryVideosMap[selectedCategory] || []

    return (
        <section id='trending-section' className='py-12 scroll-mt-20'>
            <div className='container mx-auto max-w-7xl px-4'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
                    <div>
                        <h2 className='font-bold tracking-tight flex items-center gap-2'>
                            <Icon icon='mdi:fire' className='text-orange-500' />
                            지금 뜨는 영상
                        </h2>
                        <p className='text-gray-500 mt-1'>최근 8시간 기준 급등 영상</p>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <Icon icon='mdi:clock-outline' />
                        <span>마지막 업데이트: 방금 전</span>
                    </div>
                </div>

                {/* Platform Tabs */}
                <PlatformTabs
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={setSelectedPlatform}
                />

                {/* Category Tabs */}
                <CategoryTabs
                    categories={youtubeCategories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Video Grid - 4열 x 2줄 = 8개 */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onVideoClick={handleVideoClick}
                            />
                        ))
                    ) : (
                        <div className='col-span-full text-center py-12 text-gray-500'>
                            <Icon icon='mdi:video-off' className='text-5xl mx-auto mb-4' />
                            <p>해당 카테고리에 급등 영상이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* Load More (placeholder) */}
                <div className='text-center mt-8'>
                    <button className='bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-8 rounded-full transition-colors'>
                        더 보기
                    </button>
                </div>
            </div>

            {/* Video Detail Modal */}
            <VideoDetailModal
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />
        </section>
    )
}
