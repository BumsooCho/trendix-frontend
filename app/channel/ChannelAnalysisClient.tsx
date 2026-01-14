'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

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
    recentVideos: ChannelVideo[]
    overallPerformance: number // 트렌드 대비 성과 (%)
}

// 더미 데이터



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

export default function ChannelAnalysisClient() {
    const [channelUrl, setChannelUrl] = useState('')
    const [channelData, setChannelData] = useState<ChannelData | null>(null)
    const [loading, setLoading] = useState(false)
    const [analyzed, setAnalyzed] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!channelUrl.trim()) return

        setLoading(true)
        setError(null)
        setChannelData(null)
        // TODO: 백엔드 API 연동
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
            if (!apiBaseUrl) {
                throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.')
            }

            const response = await fetch(`${apiBaseUrl}/analysis/channel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform: 'youtube',
                    channel_url: channelUrl.trim(),
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                const detail = typeof payload?.detail === 'string' ? payload.detail : `요청에 실패했습니다. (status: ${response.status})`
                throw new Error(detail)
            }

            const data: ChannelData = await response.json()
            setChannelData(data)
            setAnalyzed(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
            setError(message)
            setAnalyzed(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='container mx-auto max-w-4xl px-4'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>내 채널 분석</h1>
                    <p className='text-gray-600'>YouTube 채널 URL을 입력하면 트렌드 대비 성과를 분석해 드립니다.</p>
                </div>

                {/* Input Section */}
                <div className='bg-white rounded-xl p-6 shadow-sm mb-8'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                채널 URL 또는 채널 ID
                            </label>
                            <input
                                type='text'
                                value={channelUrl}
                                onChange={(e) => setChannelUrl(e.target.value)}
                                placeholder='https://youtube.com/@mychannel 또는 UCxxxxxx'
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all'
                            />
                        </div>
                        <div className='flex items-end'>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !channelUrl.trim()}
                                className='w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2'
                            >
                                {loading ? (
                                    <>
                                        <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white' />
                                        분석 중...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon='mdi:magnify' />
                                        분석하기
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                            {error}
                        </div>
                    )}
                </div>

                {/* Results */}
                {analyzed && channelData && (
                    <div className='space-y-6'>
                        {/* Channel Overview */}
                        <div className='bg-white rounded-xl p-6 shadow-sm'>
                            <div className='flex items-center gap-4 mb-6'>
                                <Image
                                    src={channelData.channelThumbnail}
                                    alt={channelData.channelName}
                                    width={64}
                                    height={64}
                                    className='rounded-full'
                                />
                                <div>
                                    <h2 className='text-xl font-bold text-gray-900'>{channelData.channelName}</h2>
                                    <p className='text-gray-500'>구독자 {formatNumber(channelData.subscriberCount)}명 · 영상 {channelData.totalVideos}개</p>
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div className='bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center'>
                                    <div className='text-4xl font-bold text-primary mb-1'>{channelData.overallPerformance}%</div>
                                    <div className='text-sm text-gray-600'>트렌드 대비 종합 성과</div>
                                </div>
                                <div className='bg-green-50 rounded-xl p-4 text-center'>
                                    <div className='text-4xl font-bold text-green-600 mb-1'>
                                        {channelData.recentVideos.filter(v => v.performance === 'above').length}
                                    </div>
                                    <div className='text-sm text-gray-600'>트렌드 상회 영상</div>
                                </div>
                                <div className='bg-red-50 rounded-xl p-4 text-center'>
                                    <div className='text-4xl font-bold text-red-600 mb-1'>
                                        {channelData.recentVideos.filter(v => v.performance === 'below').length}
                                    </div>
                                    <div className='text-sm text-gray-600'>개선 필요 영상</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Videos Analysis */}
                        <div className='bg-white rounded-xl p-6 shadow-sm'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>최근 영상 분석</h3>
                            <div className='space-y-4'>
                                {channelData.recentVideos.map((video) => (
                                    <div key={video.id} className='flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors'>
                                        <div className='relative w-full sm:w-40 aspect-video flex-shrink-0'>
                                            <Image
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                fill
                                                className='object-cover rounded-lg'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <h4 className='font-medium text-gray-900 line-clamp-2 mb-2'>{video.title}</h4>
                                            <div className='flex flex-wrap items-center gap-3 text-sm'>
                                                <span className='text-gray-600'>
                                                    조회수 {formatNumber(video.viewCount)}
                                                </span>
                                                <span className='text-gray-400'>vs</span>
                                                <span className='text-gray-500'>
                                                    트렌드 평균 {formatNumber(video.trendAvgViewCount)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(video.performance)}`}>
                                                    {getPerformanceLabel(video.performance)}
                                                </span>
                                            </div>
                                            {/* Performance bar */}
                                            <div className='mt-3'>
                                                <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                                                    <div
                                                        className={`h-full rounded-full ${video.performance === 'above' ? 'bg-green-500' :
                                                                video.performance === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min((video.viewCount / video.trendAvgViewCount) * 50, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/video/${video.id}`}
                                            className='flex items-center gap-1 text-primary hover:underline text-sm whitespace-nowrap'
                                        >
                                            상세 분석
                                            <Icon icon='mdi:arrow-right' />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className='bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white text-center'>
                            <h3 className='text-xl font-bold mb-2'>트렌드 영상과 비교해보세요</h3>
                            <p className='text-white/80 mb-4'>현재 뜨고 있는 영상들과 내 영상을 비교하여 인사이트를 얻어보세요.</p>
                            <Link
                                href='/'
                                className='inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors'
                            >
                                <Icon icon='mdi:fire' />
                                급등 영상 보러가기
                            </Link>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!analyzed && (
                    <div className='text-center py-12'>
                        <div className='text-6xl mb-4'>📊</div>
                        <h3 className='text-xl font-semibold text-gray-700 mb-2'>채널 URL을 입력해주세요</h3>
                        <p className='text-gray-500'>분석을 시작하면 트렌드 대비 채널 성과를 확인할 수 있습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
