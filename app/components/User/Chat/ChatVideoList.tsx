'use client';

import ChatVideoCard from './ChatVideoCard';
import { useRef, useMemo } from 'react';

export default function ChatVideoList({ videos }: { videos: Video[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 중복 제거 (video_id 기준)
    const uniqueVideos = useMemo(() => {
        const seen = new Set();
        return videos.filter(video => {
            const duplicate = seen.has(video.video_id);
            seen.add(video.video_id);
            return !duplicate;
        });
    }, [videos]);

    if (!uniqueVideos.length) return null;

    return (
        <div className="mb-4 -mx-4 px-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex gap-4 w-max">
                {uniqueVideos.map((video) => (
                    <ChatVideoCard key={`${video.video_id}-${video.source}`} video={video} />
                ))}
            </div>
        </div>
    );
}
