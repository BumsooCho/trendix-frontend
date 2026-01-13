'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

interface VideoCore {
    id: string
    title: string
    channel_name: string
    thumbnail_url: string
    duration_sec: number
    format_label: string
    published_ago: string
}

interface HookProfile {
    opening_line: string
    visual_cue: string
    caption_style: string
    pacing: string
    hook_score: number
}

interface FormatProfile {
    duration_sec: number
    aspect_ratio: string
    cut_count: number
    text_density: string
    audio_style: string
}

interface ReactionMetrics {
    views: number
    likes: number
    comments: number
    like_rate: number
    completion_rate: number
    retention_3s: number
    share_rate: number
}

interface CompareAnalysis {
    my_video: VideoCore
    trend_video: VideoCore
    hook_comparison: {
        my: HookProfile
        trend: HookProfile
        takeaways: string[]
    }
    format_comparison: {
        my: FormatProfile
        trend: FormatProfile
        differences: string[]
    }
    reaction_comparison: {
        my: ReactionMetrics
        trend: ReactionMetrics
        insights: string[]
    }
    ai_summary: {
        headline: string
        action_items: string[]
        next_experiment: string
    }
    trust_signals: string[]
}

// 화면 표기 일관성을 위해 숫자/퍼센트/길이 포맷을 분리했습니다.
function formatCompactNumber(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value.toLocaleString()
}

function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`
}

function formatDuration(seconds: number): string {
    if (!seconds) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${minutes}:${remaining.toString().padStart(2, '0')}`
}

function getWinner(a: number, b: number): 'A' | 'B' | 'tie' {
    if (a > b) return 'A'
    if (b > a) return 'B'
    return 'tie'
}

interface ComparisonRowProps {
    label: string
    valueA: string
    valueB: string
    winner?: 'A' | 'B' | 'tie'
}

function ComparisonRow({ label, valueA, valueB, winner }: ComparisonRowProps) {
    return (
        <div className='grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0'>
            <div className={`text-right font-semibold ${winner === 'A' ? 'text-green-600' : 'text-gray-700'}`}>
                {valueA}
                {winner === 'A' && <Icon icon='mdi:crown' className='inline ml-1 text-yellow-500' />}
            </div>
            <div className='text-center text-sm text-gray-500'>{label}</div>
            <div className={`text-left font-semibold ${winner === 'B' ? 'text-green-600' : 'text-gray-700'}`}>
                {winner === 'B' && <Icon icon='mdi:crown' className='inline mr-1 text-yellow-500' />}
                {valueB}
            </div>
        </div>
    )
}

export default function VideoCompareClient() {
    const [myUrl, setMyUrl] = useState('')
    const [trendUrl, setTrendUrl] = useState('')
    const [analysis, setAnalysis] = useState<CompareAnalysis | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const canAnalyze = myUrl.trim().length > 0 && trendUrl.trim().length > 0

    // 백엔드 분석 결과를 기준으로 화면을 갱신하기 위해 비동기 호출을 사용합니다.
    const handleAnalyze = async () => {
        if (!canAnalyze || loading) return
        setLoading(true)
        setError(null)
        setAnalysis(null)

        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
            if (!apiBaseUrl) {
                throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.')
            }

            const response = await fetch(`${apiBaseUrl}/analysis/shorts/compare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform: 'youtube',
                    my_short_url: myUrl.trim(),
                    trend_short_url: trendUrl.trim(),
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                const detail = typeof payload?.detail === 'string' ? payload.detail : `요청에 실패했습니다. (status: ${response.status})`
                throw new Error(detail)
            }

            const data: CompareAnalysis = await response.json()
            setAnalysis(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='container mx-auto max-w-6xl px-4'>
                <div className='text-center mb-10'>
                    {/*<div className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm text-primary font-semibold mb-3'>*/}
                    {/*    KR5 유료 전환의 중심*/}
                    {/*</div>*/}
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>콘텐츠 비교 분석 (내 쇼츠 vs 급등 쇼츠)</h1>
                    <p className='text-gray-600'>훅 구조, 길이/포맷, 반응 지표를 기준으로 AI 개선안을 정리합니다.</p>
                </div>

                <div className='bg-white rounded-2xl shadow-sm p-6 mb-10'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>내 쇼츠 URL</label>
                            <input
                                type='text'
                                value={myUrl}
                                onChange={(e) => setMyUrl(e.target.value)}
                                placeholder='YouTube Shorts URL 또는 video_id'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>급등 쇼츠 URL</label>
                            <input
                                type='text'
                                value={trendUrl}
                                onChange={(e) => setTrendUrl(e.target.value)}
                                placeholder='YouTube Shorts URL 또는 video_id'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none'
                            />
                        </div>
                    </div>
                    <div className='mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                        <p className='text-sm text-gray-500'>백엔드 분석 결과를 호출해 화면을 구성합니다.</p>
                        <button
                            onClick={handleAnalyze}
                            disabled={!canAnalyze || loading}
                            className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                        >
                            {loading ? '분석 중...' : '비교 분석 실행'}
                        </button>
                    </div>
                    {error && (
                        <div className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                            {error}
                        </div>
                    )}
                </div>

                {analysis && (
                    <div className='space-y-8'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {[analysis.my_video, analysis.trend_video].map((video, index) => (
                                <div key={video.id} className='bg-white rounded-2xl shadow-sm p-5'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3 className='text-lg font-semibold text-gray-900'>
                                            {index === 0 ? '내 쇼츠' : '급등 쇼츠'}
                                        </h3>
                                        <span className='text-xs text-gray-500'>{video.published_ago}</span>
                                    </div>
                                    <div className='relative aspect-video rounded-xl overflow-hidden mb-4'>
                                        <Image src={video.thumbnail_url} alt={video.title} fill className='object-cover' />
                                        <div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded'>
                                            {formatDuration(video.duration_sec)}
                                        </div>
                                    </div>
                                    <h4 className='font-medium text-gray-900 line-clamp-2 mb-1'>{video.title}</h4>
                                    <p className='text-sm text-gray-500'>{video.channel_name}</p>
                                    <div className='mt-3 text-xs text-gray-400'>{video.format_label}</div>
                                </div>
                            ))}
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            <div className='bg-white rounded-2xl shadow-sm p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>훅 구조 비교</h3>
                                <ComparisonRow
                                    label='오프닝 문구'
                                    valueA={analysis.hook_comparison.my.opening_line}
                                    valueB={analysis.hook_comparison.trend.opening_line}
                                />
                                <ComparisonRow
                                    label='비주얼 큐'
                                    valueA={analysis.hook_comparison.my.visual_cue}
                                    valueB={analysis.hook_comparison.trend.visual_cue}
                                />
                                <ComparisonRow
                                    label='자막 스타일'
                                    valueA={analysis.hook_comparison.my.caption_style}
                                    valueB={analysis.hook_comparison.trend.caption_style}
                                />
                                <ComparisonRow
                                    label='템포'
                                    valueA={analysis.hook_comparison.my.pacing}
                                    valueB={analysis.hook_comparison.trend.pacing}
                                />
                                <ComparisonRow
                                    label='훅 점수'
                                    valueA={`${analysis.hook_comparison.my.hook_score}점`}
                                    valueB={`${analysis.hook_comparison.trend.hook_score}점`}
                                    winner={getWinner(
                                        analysis.hook_comparison.my.hook_score,
                                        analysis.hook_comparison.trend.hook_score
                                    )}
                                />
                                <div className='mt-4 rounded-xl bg-gray-50 p-4'>
                                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>핵심 개선 포인트</h4>
                                    <ul className='text-sm text-gray-600 space-y-1'>
                                        {analysis.hook_comparison.takeaways.map((item, index) => (
                                            <li key={index}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className='bg-white rounded-2xl shadow-sm p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>길이/포맷 비교</h3>
                                <ComparisonRow
                                    label='길이'
                                    valueA={formatDuration(analysis.format_comparison.my.duration_sec)}
                                    valueB={formatDuration(analysis.format_comparison.trend.duration_sec)}
                                    winner={getWinner(
                                        analysis.format_comparison.my.duration_sec,
                                        analysis.format_comparison.trend.duration_sec
                                    )}
                                />
                                <ComparisonRow
                                    label='화면 비율'
                                    valueA={analysis.format_comparison.my.aspect_ratio}
                                    valueB={analysis.format_comparison.trend.aspect_ratio}
                                />
                                <ComparisonRow
                                    label='컷 수'
                                    valueA={`${analysis.format_comparison.my.cut_count}컷`}
                                    valueB={`${analysis.format_comparison.trend.cut_count}컷`}
                                    winner={getWinner(
                                        analysis.format_comparison.my.cut_count,
                                        analysis.format_comparison.trend.cut_count
                                    )}
                                />
                                <ComparisonRow
                                    label='텍스트 밀도'
                                    valueA={analysis.format_comparison.my.text_density}
                                    valueB={analysis.format_comparison.trend.text_density}
                                />
                                <ComparisonRow
                                    label='오디오 스타일'
                                    valueA={analysis.format_comparison.my.audio_style}
                                    valueB={analysis.format_comparison.trend.audio_style}
                                />
                                <div className='mt-4 rounded-xl bg-gray-50 p-4'>
                                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>포맷 차이 요약</h4>
                                    <ul className='text-sm text-gray-600 space-y-1'>
                                        {analysis.format_comparison.differences.map((item, index) => (
                                            <li key={index}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl shadow-sm p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>반응 지표 비교</h3>
                            <ComparisonRow
                                label='조회수'
                                valueA={formatCompactNumber(analysis.reaction_comparison.my.views)}
                                valueB={formatCompactNumber(analysis.reaction_comparison.trend.views)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.views,
                                    analysis.reaction_comparison.trend.views
                                )}
                            />
                            <ComparisonRow
                                label='좋아요'
                                valueA={formatCompactNumber(analysis.reaction_comparison.my.likes)}
                                valueB={formatCompactNumber(analysis.reaction_comparison.trend.likes)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.likes,
                                    analysis.reaction_comparison.trend.likes
                                )}
                            />
                            <ComparisonRow
                                label='댓글'
                                valueA={formatCompactNumber(analysis.reaction_comparison.my.comments)}
                                valueB={formatCompactNumber(analysis.reaction_comparison.trend.comments)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.comments,
                                    analysis.reaction_comparison.trend.comments
                                )}
                            />
                            <ComparisonRow
                                label='좋아요율'
                                valueA={formatPercent(analysis.reaction_comparison.my.like_rate)}
                                valueB={formatPercent(analysis.reaction_comparison.trend.like_rate)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.like_rate,
                                    analysis.reaction_comparison.trend.like_rate
                                )}
                            />
                            <ComparisonRow
                                label='완주율'
                                valueA={formatPercent(analysis.reaction_comparison.my.completion_rate)}
                                valueB={formatPercent(analysis.reaction_comparison.trend.completion_rate)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.completion_rate,
                                    analysis.reaction_comparison.trend.completion_rate
                                )}
                            />
                            <ComparisonRow
                                label='3초 유지율'
                                valueA={formatPercent(analysis.reaction_comparison.my.retention_3s)}
                                valueB={formatPercent(analysis.reaction_comparison.trend.retention_3s)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.retention_3s,
                                    analysis.reaction_comparison.trend.retention_3s
                                )}
                            />
                            <ComparisonRow
                                label='공유율'
                                valueA={formatPercent(analysis.reaction_comparison.my.share_rate)}
                                valueB={formatPercent(analysis.reaction_comparison.trend.share_rate)}
                                winner={getWinner(
                                    analysis.reaction_comparison.my.share_rate,
                                    analysis.reaction_comparison.trend.share_rate
                                )}
                            />
                            <div className='mt-4 rounded-xl bg-gray-50 p-4'>
                                <h4 className='text-sm font-semibold text-gray-700 mb-2'>지표 인사이트</h4>
                                <ul className='text-sm text-gray-600 space-y-1'>
                                    {analysis.reaction_comparison.insights.map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            <div className='bg-white rounded-2xl shadow-sm p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>AI 개선 제안 요약</h3>
                                <div className='rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-4 mb-4'>
                                    <div className='flex items-start gap-3'>
                                        <Icon icon='mdi:lightbulb' className='text-2xl text-yellow-500 flex-shrink-0' />
                                        <div>
                                            <h4 className='font-semibold text-gray-800 mb-1'>핵심 제안</h4>
                                            <p className='text-sm text-gray-700'>{analysis.ai_summary.headline}</p>
                                        </div>
                                    </div>
                                </div>
                                <h4 className='text-sm font-semibold text-gray-700 mb-2'>실행 액션</h4>
                                <ul className='text-sm text-gray-600 space-y-1 mb-4'>
                                    {analysis.ai_summary.action_items.map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                                <div className='text-sm text-gray-600'>
                                    <span className='font-semibold text-gray-700'>다음 실험:</span> {analysis.ai_summary.next_experiment}
                                </div>
                            </div>

                            <div className='bg-white rounded-2xl shadow-sm p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>AI 추천의 신뢰 강화 장치</h3>
                                <ul className='text-sm text-gray-600 space-y-2'>
                                    {analysis.trust_signals.map((item, index) => (
                                        <li key={index} className='flex items-start gap-2'>
                                            <Icon icon='mdi:shield-check' className='text-green-500 mt-0.5' />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {!analysis && (
                    <div className='text-center py-16 bg-white rounded-2xl shadow-sm'>
                        <div className='text-5xl mb-4'>🎯</div>
                        <h3 className='text-xl font-semibold text-gray-700 mb-2'>두 영상의 URL을 입력해 비교 분석을 시작하세요.</h3>
                        <p className='text-gray-500'>입력 후 분석을 실행하면 훅·포맷·반응 지표와 AI 개선안을 확인할 수 있습니다.</p>
                    </div>
                )}

                <div className='text-center mt-10'>
                    <Link href='/' className='inline-flex items-center gap-2 text-primary hover:underline'>
                        <Icon icon='mdi:arrow-left' />
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    )
}
