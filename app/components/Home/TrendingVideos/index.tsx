'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PlatformTabs, { Platform } from './PlatformTabs'
import CategoryTabs, { youtubeCategories } from './CategoryTabs'
import VideoCard, { Video } from './VideoCard'
import VideoDetailModal from './VideoDetailModal'
import { Icon } from '@iconify/react/dist/iconify.js'

// YouTube 카테고리 ID → backend category_id (또는 동일 ID) 매핑
// 현재는 카테고리 ID를 그대로 사용하므로 all만 별도로 두고 나머지는 그대로 비교합니다.
const CATEGORY_ID_MAP: Record<string, string> = {
    all: 'all',
    '10': '10',
    '20': '20',
    '24': '24',
    '17': '17',
    '25': '25',
    '22': '22',
    '26': '26',
    '28': '28',
}

// /trends/videos/surge 응답 타입 (필요 필드만 정의)
interface SurgeVideoItem {
    video_id: string
    title: string
    channel_id: string
    channel_username?: string
    platform: string
    category?: string | null
    category_id?: string | number | null
    view_count: number
    like_count: number
    comment_count: number
    published_at: string
    thumbnail_url: string
    crawled_at: string
    surge_score?: number
    trending_rank?: number
    is_shorts?: boolean
}

export default function TrendingVideos() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube')
    // URL에서 카테고리 읽어오기 (뒤로가기 시 유지됨)
    const [selectedCategory, setSelectedCategory] = useState<string>(
        searchParams.get('category_id') || 'all'
    )
    // 모달용 선택된 영상
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

    // 급등 전체 데이터 (surge API 기반 Top 10)
    const [globalTop8, setGlobalTop8] = useState<Video[]>([])
    // 카테고리별 추천 영상 데이터
    const [categoryVideos, setCategoryVideos] = useState<Record<string, Video[]>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 전체 급등 Top 10: /trends/videos/surge 기반 (전체 탭)
    // 나머지 카테고리는 /trends/categories/{category}/recommendations 기반
    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                if (selectedCategory === 'all') {
                    // 급등 영상 전체 Top 10 조회
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trends/videos/surge?platform=youtube&limit=10&days=3&velocity_days=1`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            cache: 'no-store',
                            signal: controller.signal,
                        }
                    )

                    if (!res.ok) {
                        throw new Error('급등 영상 데이터를 불러오지 못했습니다!')
                    }

                    const data = await res.json()
                    const items: SurgeVideoItem[] = (data.items ?? []) as SurgeVideoItem[]

                    // 백엔드에서 이미 정렬된 순서를 유지 (재정렬하지 않음)
                    const sorted = [...items]

                    const mapped: Video[] = sorted.slice(0, 10).map((item, index) => ({
                        id: item.video_id,
                        title: item.title,
                        channelName: item.channel_username?.replace('@', '') ?? '',
                        channelId: item.channel_id,
                        thumbnailUrl: item.thumbnail_url,
                        viewCount: item.view_count,
                        viewCountChange: 0,
                        likeCount: item.like_count ?? 0,
                        likeCountChange: 0,
                        publishedAt: item.published_at,
                        duration: '', // 백엔드에서 제공 시 매핑
                        // category_id가 있으면 우선 사용, 없으면 category 문자열 또는 uncategorized
                        categoryId: String(
                            item.category_id ?? item.category ?? 'uncategorized'
                        ),
                        isShort: item.is_shorts || false,
                        trendingRank: item.trending_rank || (index + 1),
                        trendingReason:
                            item.surge_score != null
                                ? `급등 점수 ${item.surge_score.toFixed(1)} - 조회수 ${(item.view_count || 0).toLocaleString()}`
                                : `조회수 ${(item.view_count || 0).toLocaleString()} - 최근 급등`,
                    }))

                    setGlobalTop8(mapped)
                } else {
                    // 개별 카테고리 추천 영상 조회
                    const mappedId = CATEGORY_ID_MAP[selectedCategory] ?? selectedCategory

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trends/menu?category_id=${encodeURIComponent(
                            mappedId
                        )}&limit=20&days=14&platform=youtube`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            cache: 'no-store',
                            signal: controller.signal,
                        }
                    )

                    if (!res.ok) {
                        throw new Error('카테고리 추천 영상을 불러오지 못했습니다.')
                    }

                    const data = await res.json()
                    const items: any[] = data.items ?? []

                    const mapped: Video[] = items.slice(0, 20).map((item, index) => ({
                        id: item.video_id,
                        title: item.title,
                        channelName: item.channel_username?.replace('@', '') ?? '',
                        channelId: item.channel_id,
                        thumbnailUrl: item.thumbnail_url,
                        viewCount: item.view_count,
                        viewCountChange: 0,
                        likeCount: item.like_count ?? 0,
                        likeCountChange: 0,
                        publishedAt: item.published_at,
                        duration: '', // 백엔드에서 제공 시 매핑
                        categoryId: String(
                            item.category_id ?? item.category ?? mappedId
                        ),
                        isShort: item.is_shorts || false,
                        trendingRank: index + 1,
                        trendingReason: `${item.category ?? mappedId} 카테고리 추천 영상`,
                    }))

                    setCategoryVideos((prev) => ({
                        ...prev,
                        [selectedCategory]: mapped,
                    }))
                }
            } catch (e: any) {
                if (e?.name === 'AbortError') return
                console.error(e)
                setError('급등/추천 영상 데이터를 불러오지 못했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()

        return () => controller.abort()
    }, [selectedCategory])

    // 카테고리 변경 시 URL 업데이트 (해시 없이)
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        const params = new URLSearchParams(searchParams.toString())
        if (categoryId === 'all') {
            params.delete('category_id')
        } else {
            params.set('category_id', categoryId)
        }
        const queryString = params.toString()
        router.replace(queryString ? `/?${queryString}` : '/', { scroll: false })
    }

    // 영상 클릭 시 모달 열기
    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video)
    }

    // 카테고리별 필터링:
    // - 전체: surge 기반 globalTop8
    // - 개별 카테고리: recommendations 기반 categoryVideos[selectedCategory]
    const filteredVideos = selectedCategory === 'all'
        ? globalTop8
        : categoryVideos[selectedCategory] || []

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
                    {isLoading ? (
                        <div className='col-span-full text-center py-12 text-gray-500'>
                            <Icon icon='mdi:loading' className='text-5xl mx-auto mb-4 animate-spin' />
                            <p>지금 뜨는 영상을 불러오는 중입니다...</p>
                        </div>
                    ) : error ? (
                        <div className='col-span-full text-center py-12 text-red-500'>
                            <p>{error}</p>
                        </div>
                    ) : filteredVideos.length > 0 ? (
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
