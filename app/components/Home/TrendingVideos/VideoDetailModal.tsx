'use client'

import { useEffect } from 'react'
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

// 더미 시계열 데이터
const dummyViewHistory = [
    { time: '8시간 전', count: 50000 },
    { time: '7시간 전', count: 120000 },
    { time: '6시간 전', count: 280000 },
    { time: '5시간 전', count: 450000 },
    { time: '4시간 전', count: 680000 },
    { time: '3시간 전', count: 890000 },
    { time: '2시간 전', count: 1050000 },
    { time: '1시간 전', count: 1180000 },
    { time: '현재', count: 1250000 },
]

function SimpleChart({ data, label, color }: { data: { time: string; count: number }[], label: string, color: string }) {
    const maxCount = Math.max(...data.map(d => d.count))

    return (
        <div className='bg-gray-50 rounded-lg p-3'>
            <h4 className='font-medium text-gray-700 mb-3 text-sm'>{label} 추이</h4>
            <div className='flex items-end gap-1 h-20'>
                {data.map((item, i) => (
                    <div key={i} className='flex-1 flex flex-col items-center'>
                        <div
                            className={`w-full rounded-t ${color}`}
                            style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '2px' }}
                            title={`${formatNumber(item.count)}`}
                        />
                    </div>
                ))}
            </div>
            <div className='flex justify-between mt-2 text-xs text-gray-500'>
                <span>{formatNumber(data[0].count)}</span>
                <span className='text-green-600 font-medium'>
                    +{formatNumber(data[data.length - 1].count - data[0].count)}
                </span>
                <span>{formatNumber(data[data.length - 1].count)}</span>
            </div>
        </div>
    )
}

export default function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
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
                        <SimpleChart data={dummyViewHistory} label='조회수' color='bg-blue-500' />
                        <SimpleChart
                            data={dummyViewHistory.map(d => ({ ...d, count: Math.floor(d.count * 0.068) }))}
                            label='좋아요'
                            color='bg-pink-500'
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
