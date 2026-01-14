'use client';

import { useVideo } from '@/context/VideoContext';
import Link from 'next/link';


const formatViewCount = (count: number | undefined | null) => {
    if (!count) return '0';
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
                {/* Shorts 배지 */}
                {video.is_shorts && (
                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-bold shadow-md border border-red-400">
                        <svg className="w-2 h-2 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L8.88,18.81a1.44,1.44,0,0,1-2.23-1.19V6.42a1.44,1.44,0,0,1,2.23-1.19L17.5,10.81A1.42,1.42,0,0,1,17.5,13.19Z" />
                        </svg>
                        <span className="tracking-wider">Shorts</span>
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
