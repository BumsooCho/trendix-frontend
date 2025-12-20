'use client'

import { Icon } from '@iconify/react/dist/iconify.js'

// YouTube 공식 카테고리 ID 기반
export interface Category {
    id: string
    name: string
    icon: string
}

// MVP에서 사용할 YouTube 카테고리
export const youtubeCategories: Category[] = [
    { id: 'all', name: '전체', icon: 'mdi:fire' },
    { id: '10', name: '음악', icon: 'mdi:music' },
    { id: '20', name: '게임', icon: 'mdi:gamepad-variant' },
    { id: '24', name: '엔터테인먼트', icon: 'mdi:television-play' },
    { id: '17', name: '스포츠', icon: 'mdi:soccer' },
    { id: '25', name: '뉴스', icon: 'mdi:newspaper' },
    { id: '22', name: '브이로그', icon: 'mdi:account-voice' },
    { id: '26', name: '노하우/스타일', icon: 'mdi:lightbulb' },
    { id: '28', name: '과학기술', icon: 'mdi:atom' },
]

interface CategoryTabsProps {
    categories: Category[]
    selectedCategory: string
    onCategoryChange: (categoryId: string) => void
}

export default function CategoryTabs({ categories, selectedCategory, onCategoryChange }: CategoryTabsProps) {
    return (
        <div className='flex gap-2 overflow-x-auto pb-3 scrollbar-hide'>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap
            ${selectedCategory === category.id
                            ? 'bg-primary/10 text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:bg-gray-100'
                        }
          `}
                >
                    <Icon icon={category.icon} className='text-lg' />
                    <span>{category.name}</span>
                </button>
            ))}
        </div>
    )
}
