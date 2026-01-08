/* eslint-disable react/no-array-index-key */
'use client'

import { useEffect, useMemo, useState } from 'react'
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

interface ViewHistoryItem {
    snapshot_date: string // YYYY-MM-DD
    view_count: number
    like_count: number
    comment_count: number
}

function formatNumber(num: number): string {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
    return String(num)
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

type ChartPoint = { time: string; count: number }

function DeltaBarChart({
    data,
    label,
    colorClass,
    isLoading,
}: {
    data: ChartPoint[]
    label: string
    colorClass: string
    isLoading?: boolean
}) {
    if (isLoading) {
        return (
            <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                <h4 className='font-medium text-gray-700 mb-3 text-sm pb-2 border-b border-gray-200'>
                    {label} 추이
                </h4>
                <div className='flex items-center justify-center h-48'>
                    <Icon icon='mdi:loading' className='text-2xl text-gray-400 animate-spin' />
                </div>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                <h4 className='font-medium text-gray-700 mb-3 text-sm pb-2 border-b border-gray-200'>
                    {label} 추이
                </h4>
                <div className='flex items-center justify-center h-48 text-gray-400 text-sm'>
                    데이터 없음
                </div>
            </div>
        )
    }

    // Y축: 최소값 기준 차이(Δ) 스케일
    const realMin = Math.min(...data.map((d) => d.count))
    const realMax = Math.max(...data.map((d) => d.count))
    const range = Math.max(realMax - realMin, 0)
    const allSameValue = range === 0

    const oldestCount = data[0]?.count ?? 0
    const newestCount = data[data.length - 1]?.count ?? 0
    const deltaCount = newestCount - oldestCount

    const dataWithDelta = data.map((item) => ({
        ...item,
        delta: item.count - realMin,
    }))

    // X축: 10개 이하 => 화면에 모두, 10개 초과 => 가로 스크롤로 모두
    const isScrollable = dataWithDelta.length > 10
    const barWidthPx = 28

    return (
        <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
            <h4 className='font-medium text-gray-700 mb-3 text-sm pb-2 border-b border-gray-200'>
                {label} 추이
            </h4>

            {/* Bars */}
            {isScrollable ? (
                <div className='h-48 mb-1 px-2 overflow-x-auto'>
                    <div className='h-full flex items-end gap-1'>
                        {dataWithDelta.map((item, i) => {
                            const heightPercent = range > 0 ? (item.delta / range) * 100 : 100

                            return (
                                <div
                                    key={i}
                                    className='h-full flex flex-col justify-end items-center group relative shrink-0'
                                    style={{ width: barWidthPx }}
                                >
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-200 ${colorClass} hover:brightness-110 cursor-pointer shadow-sm`}
                                        style={{
                                            height: `${heightPercent}%`,
                                            minHeight: '4px',
                                            minWidth: '8px',
                                        }}
                                    >
                                        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none'>
                                            <div className='bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg'>
                                                {item.time}
                                                <br />
                                                <span className='font-semibold'>+{formatNumber(item.delta)}</span>
                                                <span className='text-gray-300 text-[10px]'> (총 {formatNumber(item.count)})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className='h-48 mb-1 px-2'>
                    <div className='h-full flex items-end gap-1'>
                        {dataWithDelta.map((item, i) => {
                            const heightPercent = range > 0 ? (item.delta / range) * 100 : 100

                            return (
                                <div
                                    key={i}
                                    className='h-full flex-1 flex flex-col justify-end items-center group relative'
                                    style={{ minWidth: 28 }}
                                >
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-200 ${colorClass} hover:brightness-110 cursor-pointer shadow-sm`}
                                        style={{
                                            height: `${heightPercent}%`,
                                            minHeight: '4px',
                                        }}
                                    >
                                        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none'>
                                            <div className='bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg'>
                                                {item.time}
                                                <br />
                                                <span className='font-semibold'>+{formatNumber(item.delta)}</span>
                                                <span className='text-gray-300 text-[10px]'> (총 {formatNumber(item.count)})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* X labels: show all, newest at the end (data already in old->new order) */}
            {isScrollable ? (
                <div className='px-2 overflow-x-auto mb-2'>
                    <div className='flex gap-1 text-[9px] text-gray-400'>
                        {dataWithDelta.map((item, i) => (
                            <div key={i} className='text-center shrink-0' style={{ width: barWidthPx }}>
                                {item.time}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='px-2 mb-2'>
                    <div className='flex gap-1 text-[9px] text-gray-400'>
                        {dataWithDelta.map((item, i) => (
                            <div key={i} className='text-center flex-1' style={{ minWidth: 28 }}>
                                {item.time}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className='flex justify-between text-xs text-gray-500 pt-2'>
                <span>MIN: 0</span>
                <span className='font-medium text-gray-700'>MAX: {formatNumber(range)}</span>
                {allSameValue ? (
                    <span className='text-gray-600 font-medium'>변동 없음</span>
                ) : (
                    <span className='text-green-600 font-medium'>{formatChange(deltaCount)}</span>
                )}
            </div>
            <div className='mt-1 text-[11px] text-gray-400'>기준값(최소): {formatNumber(realMin)}</div>
        </div>
    )
}

export default function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
    const [history, setHistory] = useState<ViewHistoryItem[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    // Fetch view history when video changes
    useEffect(() => {
        if (!video) return

        const controller = new AbortController()

        const fetchViewHistory = async () => {
            setIsLoadingHistory(true)
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
                if (!apiBaseUrl) {
                    console.error('NEXT_PUBLIC_API_BASE_URL is not defined. Please set it in .env.local')
                    setHistory([])
                    return
                }

                const url = `${apiBaseUrl}/trends/videos/${video.id}/view_history?platform=youtube&limit=30`
                const res = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                    signal: controller.signal,
                })

                if (!res.ok) {
                    const errorText = await res.text().catch(() => '')
                    console.error('Failed to fetch view history:', {
                        status: res.status,
                        statusText: res.statusText,
                        error: errorText,
                        url: res.url,
                    })
                    setHistory([])
                    return
                }

                const data = await res.json()
                const items: ViewHistoryItem[] = Array.isArray(data?.history) ? data.history : []

                // Ensure sort: old -> new (latest at the end)
                const sorted = items.slice().sort((a, b) => {
                    const ta = new Date(a.snapshot_date).getTime()
                    const tb = new Date(b.snapshot_date).getTime()
                    return ta - tb
                })
                setHistory(sorted)
            } catch (e: any) {
                if (e?.name !== 'AbortError') console.error(e)
                setHistory([])
            } finally {
                setIsLoadingHistory(false)
            }
        }

        fetchViewHistory()
        return () => controller.abort()
    }, [video])

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // Prevent body scroll when modal open
    useEffect(() => {
        if (!video) return
        const originalStyle = window.getComputedStyle(document.body).overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalStyle
        }
    }, [video])

    const viewSeries: ChartPoint[] = useMemo(() => {
        return history.map((item) => ({
            time: new Date(item.snapshot_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            count: item.view_count ?? 0,
        }))
    }, [history])

    const likeSeries: ChartPoint[] = useMemo(() => {
        return history.map((item) => ({
            time: new Date(item.snapshot_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            count: item.like_count ?? 0,
        }))
    }, [history])

    if (!video) return null

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4' onClick={onClose}>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-[-1]' />

            <div
                className='relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
                >
                    <Icon icon='mdi:close' className='text-xl' />
                </button>

                <div className='relative aspect-video'>
                    <Image src={video.thumbnailUrl} alt={video.title} fill className='object-cover rounded-t-2xl' />
                    {video.trendingRank && video.trendingRank <= 10 && (
                        <div className='absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg'>
                            <Icon icon='mdi:fire' className='text-xl' />
                            <span className='font-bold'>급등 #{video.trendingRank}</span>
                        </div>
                    )}
                    {!!video.duration && (
                        <div className='absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm'>
                            {video.duration}
                        </div>
                    )}
                </div>

                <div className='p-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-3'>{video.title}</h2>

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

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <DeltaBarChart data={viewSeries} label='조회수' colorClass='bg-blue-500' isLoading={isLoadingHistory} />
                        <DeltaBarChart data={likeSeries} label='좋아요' colorClass='bg-pink-500' isLoading={isLoadingHistory} />
                    </div>

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


