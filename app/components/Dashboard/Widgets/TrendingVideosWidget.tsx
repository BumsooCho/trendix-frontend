'use client';

import VideoCard, { Video } from '@/app/components/Home/TrendingVideos/VideoCard';

const trendingVideosData: Video[] = [
    { id: 'g1', title: '[속보] 오늘 발표된 새로운 정책, 전문가들의 반응은?', channelName: '뉴스채널 A', channelId: 'ch1', thumbnailUrl: 'https://picsum.photos/seed/g1/400/225', viewCount: 1250000, viewCountChange: 450000, likeCount: 85000, likeCountChange: 12000, publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), duration: '12:34', categoryId: '25', isShort: false, trendingRank: 1, trendingReason: '3시간 만에 조회수 45만 급등' },
    { id: 'g2', title: '이 게임 실화냐? 출시 3일 만에 스팀 1위', channelName: '게임채널', channelId: 'ch2', thumbnailUrl: 'https://picsum.photos/seed/g2/400/225', viewCount: 890000, viewCountChange: 320000, likeCount: 67000, likeCountChange: 8500, publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), duration: '18:22', categoryId: '20', isShort: false, trendingRank: 2, trendingReason: '게임 카테고리 1위' },
    { id: 'g3', title: '단 15초 만에 100만뷰 달성한 비결 #shorts', channelName: '쇼츠마스터', channelId: 'ch3', thumbnailUrl: 'https://picsum.photos/seed/g3/400/225', viewCount: 2100000, viewCountChange: 1800000, likeCount: 180000, likeCountChange: 45000, publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), duration: '0:15', categoryId: '24', isShort: true, trendingRank: 3, trendingReason: 'Shorts 좋아요 급증' },
    { id: 'g4', title: '아이유 신곡 첫 공개 무대! 역대급 라이브', channelName: '음악의 신', channelId: 'ch4', thumbnailUrl: 'https://picsum.photos/seed/g4/400/225', viewCount: 3500000, viewCountChange: 890000, likeCount: 290000, likeCountChange: 67000, publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), duration: '4:32', categoryId: '10', isShort: false, trendingRank: 4, trendingReason: '음악 카테고리 최다 조회' },
    { id: 'g5', title: '프리미어리그 | 손흥민 결승골 폭발', channelName: '스포츠 투데이', channelId: 'ch5', thumbnailUrl: 'https://picsum.photos/seed/g5/400/225', viewCount: 780000, viewCountChange: 280000, likeCount: 52000, likeCountChange: 9800, publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), duration: '8:45', categoryId: '17', isShort: false, trendingRank: 5, trendingReason: '스포츠 카테고리 급상승' },
    { id: 'g6', title: '2024 헤어 트렌드 총정리', channelName: '스타일리스트K', channelId: 'ch6', thumbnailUrl: 'https://picsum.photos/seed/g6/400/225', viewCount: 567000, viewCountChange: 234000, likeCount: 41000, likeCountChange: 7800, publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), duration: '11:55', categoryId: '26', isShort: false, trendingRank: 6, trendingReason: '노하우 카테고리 좋아요 급증' },
    { id: 'g7', title: '최신 AI 기술로 만든 놀라운 결과물', channelName: '테크리뷰', channelId: 'ch7', thumbnailUrl: 'https://picsum.photos/seed/g7/400/225', viewCount: 456000, viewCountChange: 156000, likeCount: 34000, likeCountChange: 5600, publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), duration: '15:20', categoryId: '28', isShort: false, trendingRank: 7, trendingReason: '과학기술 카테고리 급등' },
    { id: 'g8', title: '오늘의 주요 뉴스 브리핑', channelName: '뉴스채널 B', channelId: 'ch8', thumbnailUrl: 'https://picsum.photos/seed/g8/400/225', viewCount: 340000, viewCountChange: 120000, likeCount: 28000, likeCountChange: 4200, publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), duration: '9:20', categoryId: '25', isShort: false, trendingRank: 8, trendingReason: '뉴스 카테고리 상승' },
    { id: 'g9', title: '10분 순삭! 초간단 집밥 레시피', channelName: '집밥의 여왕', channelId: 'ch9', thumbnailUrl: 'https://picsum.photos/seed/g9/400/225', viewCount: 620000, viewCountChange: 180000, likeCount: 45000, likeCountChange: 9000, publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), duration: '10:15', categoryId: '22', isShort: false, trendingRank: 9, trendingReason: '요리 카테고리 인기' },
    { id: 'g10', title: '반려견과 함께하는 여행 브이로그', channelName: '멍냥TV', channelId: 'ch10', thumbnailUrl: 'https://picsum.photos/seed/g10/400/225', viewCount: 410000, viewCountChange: 110000, likeCount: 32000, likeCountChange: 6500, publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), duration: '22:40', categoryId: '15', isShort: false, trendingRank: 10, trendingReason: '동물 카테고리 급상승' },
];

interface TrendingVideosWidgetProps {
    onVideoClick: (video: Video) => void;
}

const TrendingVideosWidget = ({ onVideoClick }: TrendingVideosWidgetProps) => {
    return (
        <div className="w-full h-full overflow-y-auto p-1">
            <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
            >
                {trendingVideosData.map(video => (
                    <VideoCard key={video.id} video={video} onVideoClick={onVideoClick} />
                ))}
            </div>
        </div>
    );
};

export default TrendingVideosWidget;
