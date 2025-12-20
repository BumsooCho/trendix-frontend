'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

// 임시 타입 정의
interface VideoDetail {
    id: string
    title: string
    description: string
    channelName: string
    channelId: string
    channelThumbnail: string
    thumbnailUrl: string
    viewCount: number
    likeCount: number
    commentCount: number
    publishedAt: string
    duration: string
    categoryId: string
    categoryName: string
    tags: string[]
    isShort: boolean
    trendingRank?: number
    trendingReason?: string
    // 시계열 데이터
    viewHistory: { time: string; count: number }[]
    likeHistory: { time: string; count: number }[]
}

// 더미 데이터
const getDummyVideo = (id: string): VideoDetail => ({
    id,
    title: '[속보] 오늘 발표된 새로운 정책, 전문가들의 반응은?',
    description: `오늘 발표된 새로운 정책에 대해 각계각층 전문가들의 다양한 의견을 들어봤습니다.

이번 정책의 핵심 내용과 시민들에게 미칠 영향, 그리고 향후 전망까지 상세하게 분석해 드립니다.

#뉴스 #속보 #정책 #전문가분석`,
    channelName: '뉴스채널 A',
    channelId: 'ch1',
    channelThumbnail: 'https://picsum.photos/seed/ch1/100/100',
    thumbnailUrl: 'https://picsum.photos/seed/v1/1280/720',
    viewCount: 1250000,
    likeCount: 85000,
    commentCount: 3200,
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    duration: '12:34',
    categoryId: '25',
    categoryName: '뉴스',
    tags: ['뉴스', '속보', '정책', '전문가', '분석', '시사'],
    isShort: false,
    trendingRank: 1,
    trendingReason: '3시간 만에 조회수 45만 급등, 동일 카테고리 평균 대비 12배 빠른 성장',
    viewHistory: [
        { time: '8시간 전', count: 50000 },
        { time: '7시간 전', count: 120000 },
        { time: '6시간 전', count: 280000 },
        { time: '5시간 전', count: 450000 },
        { time: '4시간 전', count: 680000 },
        { time: '3시간 전', count: 890000 },
        { time: '2시간 전', count: 1050000 },
        { time: '1시간 전', count: 1180000 },
        { time: '현재', count: 1250000 },
    ],
    likeHistory: [
        { time: '8시간 전', count: 3000 },
        { time: '7시간 전', count: 12000 },
        { time: '6시간 전', count: 28000 },
        { time: '5시간 전', count: 42000 },
        { time: '4시간 전', count: 58000 },
        { time: '3시간 전', count: 68000 },
        { time: '2시간 전', count: 78000 },
        { time: '1시간 전', count: 82000 },
        { time: '현재', count: 85000 },
    ],
})

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// 간단한 차트 컴포넌트 (라이브러리 없이)
function SimpleChart({ data, label, color }: { data: { time: string; count: number }[], label: string, color: string }) {
    const maxCount = Math.max(...data.map(d => d.count))

    return (
        <div className='bg-white rounded-xl p-4 shadow-sm'>
            <h4 className='font-semibold text-gray-700 mb-4'>{label} 추이</h4>
            <div className='flex items-end gap-2 h-32'>
                {data.map((item, i) => (
                    <div key={i} className='flex-1 flex flex-col items-center gap-1'>
                        <div
                            className={`w-full rounded-t ${color} transition-all duration-300`}
                            style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '4px' }}
                            title={`${formatNumber(item.count)}`}
                        />
                        <span className='text-[10px] text-gray-400 -rotate-45 origin-top-left whitespace-nowrap'>
                            {item.time}
                        </span>
                    </div>
                ))}
            </div>
            <div className='flex justify-between mt-6 text-xs text-gray-500'>
                <span>시작: {formatNumber(data[0].count)}</span>
                <span className='font-semibold text-green-600'>
                    +{formatNumber(data[data.length - 1].count - data[0].count)} ({Math.round(((data[data.length - 1].count - data[0].count) / data[0].count) * 100)}%)
                </span>
                <span>현재: {formatNumber(data[data.length - 1].count)}</span>
            </div>
        </div>
    )
}

interface VideoDetailClientProps {
    videoId: string
}

export default function VideoDetailClient({ videoId }: VideoDetailClientProps) {
    const router = useRouter()
    const [video, setVideo] = useState<VideoDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: 백엔드 API 연동
        setTimeout(() => {
            setVideo(getDummyVideo(videoId))
            setLoading(false)
        }, 500)
    }, [videoId])

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
            </div>
        )
    }

    if (!video) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500'>영상을 찾을 수 없습니다.</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50 pt-24 pb-8'>
            <div className='container mx-auto max-w-6xl px-4'>
                {/* Back button - 네이티브 히스토리 사용으로 스크롤 위치 유지 */}
                <button
                    onClick={() => window.history.back()}
                    className='inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 cursor-pointer'
                >
                    <Icon icon='mdi:arrow-left' />
                    <span>목록으로 돌아가기</span>
                </button>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Main content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Video thumbnail */}
                        <div className='relative aspect-video rounded-xl overflow-hidden shadow-lg'>
                            <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className='object-cover'
                            />
                            {video.trendingRank && video.trendingRank <= 10 && (
                                <div className='absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg'>
                                    <Icon icon='mdi:fire' className='text-xl' />
                                    <span className='font-bold'>급등 #{video.trendingRank}</span>
                                </div>
                            )}
                            <div className='absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm'>
                                {video.duration}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className='text-2xl font-bold text-gray-900'>{video.title}</h1>

                        {/* Stats */}
                        <div className='flex flex-wrap items-center gap-4 text-gray-600'>
                            <div className='flex items-center gap-1'>
                                <Icon icon='mdi:eye' />
                                <span>{formatNumber(video.viewCount)} 조회</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Icon icon='mdi:thumb-up' />
                                <span>{formatNumber(video.likeCount)}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Icon icon='mdi:comment' />
                                <span>{formatNumber(video.commentCount)}</span>
                            </div>
                            <span className='text-gray-400'>|</span>
                            <span>{formatDate(video.publishedAt)}</span>
                        </div>

                        {/* Trending reason */}
                        {video.trendingReason && (
                            <div className='bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4'>
                                <div className='flex items-start gap-3'>
                                    <div className='p-2 bg-orange-100 rounded-lg'>
                                        <Icon icon='mdi:trending-up' className='text-2xl text-orange-600' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-orange-800 mb-1'>급등 분석</h3>
                                        <p className='text-orange-700'>{video.trendingReason}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Charts */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <SimpleChart data={video.viewHistory} label='조회수' color='bg-blue-500' />
                            <SimpleChart data={video.likeHistory} label='좋아요' color='bg-pink-500' />
                        </div>

                        {/* Description */}
                        <div className='bg-white rounded-xl p-4 shadow-sm'>
                            <h3 className='font-semibold text-gray-700 mb-3'>영상 설명</h3>
                            <p className='text-gray-600 whitespace-pre-line'>{video.description}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Channel info */}
                        <div className='bg-white rounded-xl p-4 shadow-sm'>
                            <h3 className='font-semibold text-gray-700 mb-3'>채널 정보</h3>
                            <div className='flex items-center gap-3'>
                                <Image
                                    src={video.channelThumbnail}
                                    alt={video.channelName}
                                    width={48}
                                    height={48}
                                    className='rounded-full'
                                />
                                <div>
                                    <p className='font-medium text-gray-900'>{video.channelName}</p>
                                    <p className='text-sm text-gray-500'>채널 ID: {video.channelId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Meta info */}
                        <div className='bg-white rounded-xl p-4 shadow-sm'>
                            <h3 className='font-semibold text-gray-700 mb-3'>메타 정보</h3>
                            <div className='space-y-3 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>카테고리</span>
                                    <span className='font-medium'>{video.categoryName}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>영상 ID</span>
                                    <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded'>{video.id}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>길이</span>
                                    <span>{video.duration}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>타입</span>
                                    <span>{video.isShort ? 'Short' : '일반 영상'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className='bg-white rounded-xl p-4 shadow-sm'>
                            <h3 className='font-semibold text-gray-700 mb-3'>태그</h3>
                            <div className='flex flex-wrap gap-2'>
                                {video.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm'
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='space-y-3'>
                            <Link
                                href={`/compare?videos=${video.id}`}
                                className='w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors'
                            >
                                <Icon icon='mdi:compare' />
                                다른 영상과 비교하기
                            </Link>
                            <a
                                href={`https://youtube.com/watch?v=${video.id}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors'
                            >
                                <Icon icon='mdi:youtube' />
                                YouTube에서 보기
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
