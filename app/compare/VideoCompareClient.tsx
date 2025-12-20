'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

interface CompareVideo {
    id: string
    title: string
    channelName: string
    thumbnailUrl: string
    viewCount: number
    likeCount: number
    commentCount: number
    publishedAt: string
    duration: string
    viewGrowthRate: number // 조회수 증가율 (%)
    likeRatio: number // 좋아요 비율 (%)
    tags: string[]
}

// 더미 데이터
const getDummyVideo = (id: string, isFirst: boolean): CompareVideo => ({
    id,
    title: isFirst
        ? '[속보] 오늘 발표된 새로운 정책, 전문가들의 반응은?'
        : '정책 분석 | 이번 발표가 우리에게 미칠 영향',
    channelName: isFirst ? '뉴스채널 A' : '경제분석TV',
    thumbnailUrl: `https://picsum.photos/seed/${id}/640/360`,
    viewCount: isFirst ? 1250000 : 890000,
    likeCount: isFirst ? 85000 : 62000,
    commentCount: isFirst ? 3200 : 2100,
    publishedAt: new Date(Date.now() - (isFirst ? 3 : 5) * 60 * 60 * 1000).toISOString(),
    duration: isFirst ? '12:34' : '18:22',
    viewGrowthRate: isFirst ? 450 : 280,
    likeRatio: isFirst ? 6.8 : 7.0,
    tags: isFirst
        ? ['뉴스', '속보', '정책']
        : ['경제', '분석', '정책'],
})

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`
    return `${Math.floor(seconds / 86400)}일 전`
}

interface VideoInputProps {
    label: string
    videoUrl: string
    onUrlChange: (url: string) => void
    onAnalyze: () => void
    loading: boolean
    video: CompareVideo | null
}

function VideoInput({ label, videoUrl, onUrlChange, onAnalyze, loading, video }: VideoInputProps) {
    return (
        <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
            <div className='flex gap-2 mb-4'>
                <input
                    type='text'
                    value={videoUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder='YouTube 영상 URL 또는 ID'
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none'
                />
                <button
                    onClick={onAnalyze}
                    disabled={loading || !videoUrl.trim()}
                    className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                >
                    {loading ? '...' : '분석'}
                </button>
            </div>

            {video && (
                <div className='bg-white rounded-xl p-4 shadow-sm'>
                    <div className='relative aspect-video rounded-lg overflow-hidden mb-3'>
                        <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className='object-cover'
                        />
                        <div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded'>
                            {video.duration}
                        </div>
                    </div>
                    <h4 className='font-medium text-gray-900 line-clamp-2 mb-1'>{video.title}</h4>
                    <p className='text-sm text-gray-500'>{video.channelName}</p>
                </div>
            )}
        </div>
    )
}

interface CompareRowProps {
    label: string
    icon: string
    valueA: string | number
    valueB: string | number
    winner?: 'A' | 'B' | 'tie'
    unit?: string
}

function CompareRow({ label, icon, valueA, valueB, winner, unit = '' }: CompareRowProps) {
    return (
        <div className='grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0'>
            <div className={`text-right font-semibold ${winner === 'A' ? 'text-green-600' : 'text-gray-700'}`}>
                {valueA}{unit}
                {winner === 'A' && <Icon icon='mdi:crown' className='inline ml-1 text-yellow-500' />}
            </div>
            <div className='text-center'>
                <div className='flex items-center justify-center gap-2 text-gray-500'>
                    <Icon icon={icon} className='text-lg' />
                    <span className='text-sm'>{label}</span>
                </div>
            </div>
            <div className={`text-left font-semibold ${winner === 'B' ? 'text-green-600' : 'text-gray-700'}`}>
                {winner === 'B' && <Icon icon='mdi:crown' className='inline mr-1 text-yellow-500' />}
                {valueB}{unit}
            </div>
        </div>
    )
}

export default function VideoCompareClient() {
    const [videoUrlA, setVideoUrlA] = useState('')
    const [videoUrlB, setVideoUrlB] = useState('')
    const [videoA, setVideoA] = useState<CompareVideo | null>(null)
    const [videoB, setVideoB] = useState<CompareVideo | null>(null)
    const [loadingA, setLoadingA] = useState(false)
    const [loadingB, setLoadingB] = useState(false)

    const analyzeVideoA = () => {
        setLoadingA(true)
        setTimeout(() => {
            setVideoA(getDummyVideo(videoUrlA || 'videoA', true))
            setLoadingA(false)
        }, 800)
    }

    const analyzeVideoB = () => {
        setLoadingB(true)
        setTimeout(() => {
            setVideoB(getDummyVideo(videoUrlB || 'videoB', false))
            setLoadingB(false)
        }, 800)
    }

    const getWinner = (a: number, b: number): 'A' | 'B' | 'tie' => {
        if (a > b) return 'A'
        if (b > a) return 'B'
        return 'tie'
    }

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='container mx-auto max-w-5xl px-4'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>영상 비교</h1>
                    <p className='text-gray-600'>두 영상의 성과를 나란히 비교해보세요.</p>
                </div>

                {/* Video Inputs */}
                <div className='flex flex-col md:flex-row gap-6 mb-8'>
                    <VideoInput
                        label='영상 A'
                        videoUrl={videoUrlA}
                        onUrlChange={setVideoUrlA}
                        onAnalyze={analyzeVideoA}
                        loading={loadingA}
                        video={videoA}
                    />

                    <div className='hidden md:flex items-center justify-center'>
                        <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                            <Icon icon='mdi:compare' className='text-2xl text-primary' />
                        </div>
                    </div>

                    <VideoInput
                        label='영상 B'
                        videoUrl={videoUrlB}
                        onUrlChange={setVideoUrlB}
                        onAnalyze={analyzeVideoB}
                        loading={loadingB}
                        video={videoB}
                    />
                </div>

                {/* Comparison Results */}
                {videoA && videoB && (
                    <div className='bg-white rounded-xl p-6 shadow-sm'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-6 text-center'>비교 결과</h3>

                        {/* Header */}
                        <div className='grid grid-cols-3 gap-4 mb-4 pb-4 border-b-2 border-gray-200'>
                            <div className='text-right font-bold text-primary'>영상 A</div>
                            <div className='text-center text-gray-400'>VS</div>
                            <div className='text-left font-bold text-primary'>영상 B</div>
                        </div>

                        {/* Metrics */}
                        <div className='space-y-1'>
                            <CompareRow
                                label='조회수'
                                icon='mdi:eye'
                                valueA={formatNumber(videoA.viewCount)}
                                valueB={formatNumber(videoB.viewCount)}
                                winner={getWinner(videoA.viewCount, videoB.viewCount)}
                            />
                            <CompareRow
                                label='좋아요'
                                icon='mdi:thumb-up'
                                valueA={formatNumber(videoA.likeCount)}
                                valueB={formatNumber(videoB.likeCount)}
                                winner={getWinner(videoA.likeCount, videoB.likeCount)}
                            />
                            <CompareRow
                                label='댓글'
                                icon='mdi:comment'
                                valueA={formatNumber(videoA.commentCount)}
                                valueB={formatNumber(videoB.commentCount)}
                                winner={getWinner(videoA.commentCount, videoB.commentCount)}
                            />
                            <CompareRow
                                label=' 증가율'
                                icon='mdi:trending-up'
                                valueA={videoA.viewGrowthRate}
                                valueB={videoB.viewGrowthRate}
                                winner={getWinner(videoA.viewGrowthRate, videoB.viewGrowthRate)}
                                unit='%'
                            />
                            <CompareRow
                                label='좋아요 비율'
                                icon='mdi:heart'
                                valueA={videoA.likeRatio.toFixed(1)}
                                valueB={videoB.likeRatio.toFixed(1)}
                                winner={getWinner(videoA.likeRatio, videoB.likeRatio)}
                                unit='%'
                            />
                            <CompareRow
                                label='길이'
                                icon='mdi:clock'
                                valueA={videoA.duration}
                                valueB={videoB.duration}
                            />
                            <CompareRow
                                label='업로드'
                                icon='mdi:calendar'
                                valueA={timeAgo(videoA.publishedAt)}
                                valueB={timeAgo(videoB.publishedAt)}
                            />
                        </div>

                        {/* Tags comparison */}
                        <div className='mt-6 pt-6 border-t border-gray-200'>
                            <h4 className='text-sm font-medium text-gray-500 mb-3 text-center'>태그 비교</h4>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-wrap justify-end gap-2'>
                                    {videoA.tags.map((tag, i) => (
                                        <span key={i} className='bg-primary/10 text-primary text-xs px-2 py-1 rounded-full'>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {videoB.tags.map((tag, i) => (
                                        <span key={i} className='bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full'>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className='mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl'>
                            <div className='flex items-start gap-3'>
                                <Icon icon='mdi:lightbulb' className='text-2xl text-yellow-500 flex-shrink-0' />
                                <div>
                                    <h4 className='font-semibold text-gray-800 mb-1'>분석 인사이트</h4>
                                    <p className='text-sm text-gray-600'>
                                        {videoA.viewCount > videoB.viewCount
                                            ? '영상 A가 조회수에서 앞서고 있습니다. '
                                            : '영상 B가 조회수에서 앞서고 있습니다. '}
                                        {videoA.likeRatio < videoB.likeRatio
                                            ? '하지만 영상 B의 좋아요 비율이 더 높아 시청자 반응이 더 좋습니다.'
                                            : '영상 A의 좋아요 비율도 높아 전반적인 성과가 우수합니다.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {(!videoA || !videoB) && (
                    <div className='text-center py-12 bg-white rounded-xl shadow-sm'>
                        <div className='text-6xl mb-4'>⚖️</div>
                        <h3 className='text-xl font-semibold text-gray-700 mb-2'>두 영상을 입력해주세요</h3>
                        <p className='text-gray-500'>영상 URL을 입력하고 분석 버튼을 눌러주세요.</p>
                    </div>
                )}

                {/* Back link */}
                <div className='text-center mt-8'>
                    <Link href='/' className='inline-flex items-center gap-2 text-primary hover:underline'>
                        <Icon icon='mdi:arrow-left' />
                        트렌드 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    )
}
