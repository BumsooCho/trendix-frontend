'use client';

import { useVideo } from '@/context/VideoContext';
import Link from 'next/link';


const formatViewCount = (count: number) => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
};

export default function ChatVideoCard({ video }: { video: Video }) {
    const { setSelectedVideo } = useVideo();
    console.log(video)
    return (
        <Link
            href={`/user/main/${video.video_id}`}
            target="_blank"
            onClick={() => setSelectedVideo(video)}
            title={video.title}
            className="block min-w-[280px] w-[280px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
        >
            <div className="relative aspect-video bg-gray-200">
                <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                {video.similarity && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                        {(video.similarity * 100).toFixed(0)}% 일치
                    </div>
                )}
            </div>
            <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-2">
                    {video.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>조회수 {formatViewCount(video.view_count)}</span>
                    {video.category && (
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">
                            {video.category}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
