'use client'

import { Icon } from '@iconify/react/dist/iconify.js'

export type Platform = 'youtube' | 'instagram' | 'tiktok'

interface PlatformConfig {
    id: Platform
    name: string
    icon: string
    enabled: boolean
    comingSoon?: boolean
}

const platforms: PlatformConfig[] = [
    { id: 'youtube', name: 'YouTube', icon: 'mdi:youtube', enabled: true },
    { id: 'instagram', name: 'Instagram', icon: 'mdi:instagram', enabled: false, comingSoon: true },
    { id: 'tiktok', name: 'TikTok', icon: 'ic:baseline-tiktok', enabled: false, comingSoon: true },
]

interface PlatformTabsProps {
    selectedPlatform: Platform
    onPlatformChange: (platform: Platform) => void
}

export default function PlatformTabs({ selectedPlatform, onPlatformChange }: PlatformTabsProps) {
    return (
        <div className='flex gap-2 mb-4 overflow-x-auto pb-2'>
            {platforms.map((platform) => (
                <button
                    key={platform.id}
                    onClick={() => platform.enabled && onPlatformChange(platform.id)}
                    disabled={!platform.enabled}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
            ${selectedPlatform === platform.id
                            ? 'bg-primary text-white shadow-md'
                            : platform.enabled
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }
          `}
                >
                    <Icon icon={platform.icon} className='text-xl' />
                    <span className='whitespace-nowrap'>{platform.name}</span>
                    {platform.comingSoon && (
                        <span className='text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full'>
                            Coming Soon
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
