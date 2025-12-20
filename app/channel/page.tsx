import { Metadata } from 'next'
import ChannelAnalysisClient from './ChannelAnalysisClient'

export const metadata: Metadata = {
    title: '내 채널 분석 - Trendix',
    description: '내 YouTube 채널의 트렌드 대비 성과를 분석합니다.',
}

export default function ChannelPage() {
    return <ChannelAnalysisClient />
}
