import { Metadata } from 'next'
import VideoCompareClient from './VideoCompareClient'

export const metadata: Metadata = {
    title: '영상 비교 - Trendix',
    description: '두 YouTube 영상의 성과를 비교 분석합니다.',
}

export default function ComparePage() {
    return <VideoCompareClient />
}
