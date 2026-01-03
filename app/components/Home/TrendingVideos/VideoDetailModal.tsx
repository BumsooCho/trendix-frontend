'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react/dist/iconify.js'

interface Video {
    id: string
    title: string
    channelName: string
    channelId: string
    thumbnailUrl: string
    viewCount: number
    viewCountChange: number
    likeCount: number
    likeCountChange: number
    publishedAt: string
    duration: string
    categoryId: string
    isShort: boolean
    trendingRank?: number
    trendingReason?: string
}

interface VideoDetailModalProps {
    video: Video | null
    onClose: () => void
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

function formatChange(num: number): string {
    const sign = num >= 0 ? '+' : ''
    return sign + formatNumber(num)
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`
    return `${Math.floor(seconds / 604800)}주 전`
}

interface ViewHistoryItem {
    snapshot_date: string
    view_count: number
    like_count: number
    comment_count: number
}

function SimpleChart({ 
    data, 
    label, 
    color, 
    isLoading 
}: { 
    data: { time: string; count: number }[], 
    label: string, 
    color: string,
    isLoading?: boolean
}) {
    if (isLoading) {
        return (
            <div className='bg-gray-50 rounded-lg p-3'>
                <h4 className='font-medium text-gray-700 mb-3 text-sm'>{label} 추이</h4>
                <div className='flex items-center justify-center h-40'>
                    <Icon icon='mdi:loading' className='text-2xl text-gray-400 animate-spin' />
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className='bg-gray-50 rounded-lg p-3'>
                <h4 className='font-medium text-gray-700 mb-3 text-sm'>{label} 추이</h4>
                <div className='flex items-center justify-center h-40 text-gray-400 text-sm'>
                    데이터 없음
                </div>
            </div>
        )
    }

    // Y축 최대값을 데이터 최댓값 + 5%로 설정 (여유 공간 확보)
    const actualMax = Math.max(...data.map(d => d.count), 1)
    const actualMin = Math.min(...data.map(d => d.count), 0)
    const maxCount = actualMax + (actualMax * 0.05) // 최댓값 + 5%
    const minCount = actualMin

    return (
        <div className='bg-gray-50 rounded-lg p-3'>
            <h4 className='font-medium text-gray-700 mb-3 text-sm'>{label} 추이</h4>
            
            {/* 막대 그래프 영역 */}
            <div className='flex items-end justify-center gap-1 h-40 mb-1 px-2'>
                {data.map((item, i) => {
                    // 각 막대의 높이를 MAX+5% 값 기준으로 계산
                    const heightPercent = ((item.count - minCount) / (maxCount - minCount)) * 100
                    
                    return (
                        <div 
                            key={i} 
                            className='flex flex-col items-center group relative'
                            style={{ width: `${Math.max(100 / data.length, 2)}%` }}
                        >
                            <div
                                className={`w-full rounded-t-md transition-all duration-200 ${color} hover:brightness-110 cursor-pointer shadow-sm`}
                                style={{ 
                                    height: `${heightPercent}%`, 
                                    minHeight: '4px',
                                    minWidth: '8px'
                                }}
                            >
                                {/* 툴팁 */}
                                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none'>
                                    <div className='bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg'>
                                        {item.time}<br />
                                        <span className='font-semibold'>{formatNumber(item.count)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {/* X축 날짜 라벨 */}
            <div className='flex justify-between text-[9px] text-gray-400 mb-2 overflow-hidden'>
                {data.map((item, i) => {
                    // 날짜가 많으면 간격을 두고 표시
                    const showLabel = data.length <= 10 || i % Math.ceil(data.length / 10) === 0 || i === data.length - 1
                    
                    return (
                        <div 
                            key={i} 
                            className='flex-1 text-center'
                            style={{ 
                                visibility: showLabel ? 'visible' : 'hidden' 
                            }}
                        >
                            {item.time}
                        </div>
                    )
                })}
            </div>
            
            {/* 통계 정보 */}
            <div className='flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-200'>
                <span>MIN: {formatNumber(actualMin)}</span>
                <span className='font-medium text-gray-700'>
                    MAX: {formatNumber(actualMax)}
                </span>
                <span className='text-green-600 font-medium'>
                    +{formatNumber(data[data.length - 1].count - data[0].count)}
                </span>
            </div>
        </div>
    )
}

export default function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
    const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    // 비디오가 변경될 때마다 조회수 추이 데이터 가져오기
    useEffect(() => {
        if (!video) return

        const controller = new AbortController()
        
        const fetchViewHistory = async () => {
            setIsLoadingHistory(true)
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
                
                if (!apiBaseUrl) {
                    console.error('NEXT_PUBLIC_API_BASE_URL is not defined. Please set it in .env.local')
                    setViewHistory([])
                    setIsLoadingHistory(false)
                    return
                }

                const url = `${apiBaseUrl}/trends/videos/${video.id}/view_history?platform=youtube&limit=30`
                console.log('Fetching view history from:', url)

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                    signal: controller.signal,
                })

                if (res.ok) {
                    const data = await res.json()
                    const history: ViewHistoryItem[] = data.history || []
                    
                    // 날짜 순서대로 정렬 (오래된 것 -> 최신)
                    const sortedByDate = history.sort((a, b) => {
                        const dateA = new Date(a.snapshot_date).getTime()
                        const dateB = new Date(b.snapshot_date).getTime()
                        return dateA - dateB
                    })
                    
                    console.log('View history loaded:', sortedByDate.length, 'days')
                    if (sortedByDate.length > 0) {
                        console.log('First date:', sortedByDate[0].snapshot_date, 'view_count:', sortedByDate[0].view_count)
                        console.log('Last date:', sortedByDate[sortedByDate.length - 1].snapshot_date, 'view_count:', sortedByDate[sortedByDate.length - 1].view_count)
                    }
                    
                    setViewHistory(sortedByDate)
                } else {
                    const errorText = await res.text().catch(() => '')
                    console.error('Failed to fetch view history:', {
                        status: res.status,
                        statusText: res.statusText,
                        error: errorText,
                        url: res.url
                    })
                    setViewHistory([])
                }
            } catch (error: any) {
                if (error?.name !== 'AbortError') {
                    console.error('Error fetching view history:', error)
                }
                setViewHistory([])
            } finally {
                setIsLoadingHistory(false)
            }
        }

        fetchViewHistory()

        return () => controller.abort()
    }, [video])

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // 스크롤 방지
    useEffect(() => {
        if (!video) return

        const originalStyle = window.getComputedStyle(document.body).overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalStyle
        }
    }, [video])

    if (!video) return null

    return (
        <div
            className='fixed inset-0 z-[100] flex items-center justify-center p-4'
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-[-1]' />

            {/* Modal */}
            <div
                className='relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
                >
                    <Icon icon='mdi:close' className='text-xl' />
                </button>

                {/* Thumbnail */}
                <div className='relative aspect-video'>
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className='object-cover rounded-t-2xl'
                    />
                    {video.trendingRank && video.trendingRank <= 10 && (
                        <div className='absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg'>
                            <Icon icon='mdi:fire' className='text-xl' />
                            <span className='font-bold'>급등 #{video.trendingRank}</span>
                        </div>
                    )}
                    <div className='absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm'>
                        {video.duration}
                    </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                    {/* Title */}
                    <h2 className='text-xl font-bold text-gray-900 mb-3'>{video.title}</h2>

                    {/* Channel & Stats */}
                    <div className='flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-4'>
                        <span className='font-medium'>{video.channelName}</span>
                        <span className='text-gray-300'>|</span>
                        <div className='flex items-center gap-1'>
                            <Icon icon='mdi:eye' />
                            <span>{formatNumber(video.viewCount)}</span>
                            <span className='text-green-500'>{formatChange(video.viewCountChange)}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Icon icon='mdi:thumb-up' />
                            <span>{formatNumber(video.likeCount)}</span>
                            <span className='text-green-500'>{formatChange(video.likeCountChange)}</span>
                        </div>
                        <span className='text-gray-400'>{timeAgo(video.publishedAt)}</span>
                    </div>

                    {/* Trending reason */}
                    {video.trendingReason && (
                        <div className='bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-4'>
                            <div className='flex items-start gap-3'>
                                <div className='p-2 bg-orange-100 rounded-lg'>
                                    <Icon icon='mdi:trending-up' className='text-xl text-orange-600' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-orange-800 mb-1'>급등 분석</h3>
                                    <p className='text-orange-700 text-sm'>{video.trendingReason}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Charts */}
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <SimpleChart 
                            data={viewHistory.map(item => ({
                                time: new Date(item.snapshot_date).toLocaleDateString('ko-KR', { 
                                    month: 'short', 
                                    day: 'numeric'
                                }),
                                count: item.view_count
                            }))}
                            label='조회수' 
                            color='bg-blue-500'
                            isLoading={isLoadingHistory}
                        />
                        <SimpleChart
                            data={viewHistory.map(item => ({
                                time: new Date(item.snapshot_date).toLocaleDateString('ko-KR', { 
                                    month: 'short', 
                                    day: 'numeric'
                                }),
                                count: item.like_count
                            }))}
                            label='좋아요'
                            color='bg-pink-500'
                            isLoading={isLoadingHistory}
                        />
                    </div>

                    {/* Actions */}
                    <div className='flex gap-3'>
                        <a
                            href={`https://youtube.com/watch?v=${video.id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors'
                        >
                            <Icon icon='mdi:youtube' />
                            YouTube에서 보기
                        </a>
                        <button
                            onClick={onClose}
                            className='flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors'
                        >
                            <Icon icon='mdi:close' />
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
