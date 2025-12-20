import { Metadata } from 'next'
import VideoDetailClient from './VideoDetailClient'

interface PageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    // TODO: 백엔드에서 영상 정보 가져오기
    return {
        title: `영상 분석 - Trendix`,
        description: `YouTube 영상 ${id}의 트렌드 분석 및 상세 정보`,
    }
}

export default async function VideoDetailPage({ params }: PageProps) {
    const { id } = await params
    return <VideoDetailClient videoId={id} />
}
