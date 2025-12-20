'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

export interface Video {
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

interface VideoCardProps {
    video: Video
    onVideoClick?: (video: Video) => void
}

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
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

export default function VideoCard({ video, onVideoClick }: VideoCardProps) {
    // 클릭 시 모달 열기 또는 스크롤 위치 저장 후 이동
    const handleClick = (e: React.MouseEvent) => {
        if (onVideoClick) {
            e.preventDefault()
            onVideoClick(video)
        } else {
            sessionStorage.setItem('trendingScrollY', window.scrollY.toString())
        }
    }

    return (
        <div
            className='group block cursor-pointer'
            onClick={handleClick}
        >
            <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'>
                {/* Thumbnail */}
                <div className='relative aspect-video overflow-hidden'>
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    {/* Duration badge */}
                    <div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded'>
                        {video.duration}
                    </div>
                    {/* Short badge */}
                    {video.isShort && (
                        <div className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1'>
                            <Icon icon='mdi:youtube-shorts' className='text-sm' />
                            Short
                        </div>
                    )}
                    {/* Trending badge */}
                    {video.trendingRank && video.trendingRank <= 10 && (
                        <div className='absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1'>
                            <Icon icon='mdi:fire' className='text-sm' />
                            #{video.trendingRank}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className='p-4'>
                    {/* Title - 1줄로 제한, 호버시 전체 표시 */}
                    <div className='relative group/title'>
                        <h3 className='font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors mb-2'>
                            {video.title}
                        </h3>
                        {/* Custom Tooltip */}
                        <div className='absolute z-[110] left-0 right-0 top-full hidden group-hover/title:block'>
                            <div className='bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg mt-1'>
                                {video.title}
                            </div>
                        </div>
                    </div>

                    {/* Channel */}
                    <p className='text-sm text-gray-500 mb-3'>{video.channelName}</p>

                    {/* Stats */}
                    <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-3'>
                            {/* View count */}
                            <div className='flex items-center gap-1 text-gray-600'>
                                <Icon icon='mdi:eye' className='text-base' />
                                <span>{formatNumber(video.viewCount)}</span>
                                <span className='text-green-500 text-xs'>
                                    {formatChange(video.viewCountChange)}
                                </span>
                            </div>
                            {/* Like count */}
                            <div className='flex items-center gap-1 text-gray-600'>
                                <Icon icon='mdi:thumb-up' className='text-base' />
                                <span>{formatNumber(video.likeCount)}</span>
                            </div>
                        </div>
                        {/* Time ago */}
                        <span className='text-gray-400 text-xs'>{timeAgo(video.publishedAt)}</span>
                    </div>

                    {/* Trending reason */}
                    {video.trendingReason && (
                        <div className='mt-3 p-2 bg-orange-50 rounded-lg'>
                            <p className='text-xs text-orange-700 flex items-start gap-1'>
                                <Icon icon='mdi:trending-up' className='text-sm mt-0.5 flex-shrink-0' />
                                <span>{video.trendingReason}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
