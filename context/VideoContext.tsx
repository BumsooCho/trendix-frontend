'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface VideoContextType {
    selectedVideo: Video | null;
    setSelectedVideo: (video: Video | null) => void;
    isLoading: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
    const [selectedVideo, _setSelectedVideo] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('selectedVideo');
        if (stored) {
            try {
                _setSelectedVideo(JSON.parse(stored));
            } catch (error) {
                console.error("Failed to parse stored video", error);
                localStorage.removeItem('selectedVideo');
            }
        }
        setIsLoading(false);
    }, []);

    const setSelectedVideo = (video: Video | null) => {
        _setSelectedVideo(video);
        if (video) {
            localStorage.setItem('selectedVideo', JSON.stringify(video));
        } else {
            localStorage.removeItem('selectedVideo');
        }
    };

    return (
        <VideoContext.Provider value={{ selectedVideo, setSelectedVideo, isLoading }}>
            {children}
        </VideoContext.Provider>
    );
}

export function useVideo() {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
}
