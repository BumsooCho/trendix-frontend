import Hero from '@/app/components/Home/Hero'
import TrendingVideos from '@/app/components/Home/TrendingVideos'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trendix - YouTube Trend Intelligence',
}

export default function Home() {
  return (
    <main>
      <Hero />
      <TrendingVideos />
    </main>
  )
}
