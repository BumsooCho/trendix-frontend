'use client'

import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Signin from '../../Auth/SignIn'

const Banner = () => {
  const { isLoggedIn } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const signInRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSignInOpen])

  return (
    <section id='Home' className='bg-cover bg-center bg-no-repeat pt-28 pb-20'>
      <div className='relative px-6 lg:px-8'>
        <div className='container'>
          <div className='flex flex-col gap-4 text-center'>
            <h1 className='leading-tight font-bold tracking-tight max-w-4xl mx-auto'>
              지금 뜨는 유튜브 영상,<br className='hidden sm:block' /> 왜 뜨는지 알려드립니다
            </h1>
            <p className='text-lg leading-8 text-gray-600 max-w-2xl mx-auto'>
              실시간 급등 영상 탐지와 데이터 기반 분석으로<br className='hidden sm:block' />
              크리에이터의 콘텐츠 기획을 돕습니다.
            </p>
            <div className='flex flex-wrap justify-center gap-4 mt-4'>
              <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm'>
                <span className='text-2xl'>📈</span>
                <span className='text-sm font-medium text-gray-700'>실시간 급등 탐지</span>
              </div>
              <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm'>
                <span className='text-2xl'>🎯</span>
                <span className='text-sm font-medium text-gray-700'>데이터 기반 근거</span>
              </div>
              <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm'>
                <span className='text-2xl'>🇰🇷</span>
                <span className='text-sm font-medium text-gray-700'>한국 트렌드 특화</span>
              </div>
            </div>
          </div>

          <div className='mx-auto max-w-4xl mt-12 p-6 lg:max-w-4xl lg:px-8 rounded-lg boxshadow'>
            <div className='flex justify-center'>

              {!isLoggedIn && (
                <div className='col-span-3 sm:col-span-2 mt-2'>
                  <button className='bg-primary w-full hover:bg-transparent hover:text-primary duration-300 border border-primary text-white font-bold py-4 px-3 rounded-sm hover:cursor-pointer'
                    onClick={() => setIsSignInOpen(true)}
                  >
                    트렌드 확인하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSignInOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
          <div
            ref={signInRef}
            className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-8 pb-8 text-center bg-dark_grey/90 backdrop-blur-md bg-white'>
            <button
              onClick={() => setIsSignInOpen(false)}
              className='absolute top-0 right-0 mr-8 mt-8 dark:invert'
              aria-label='Close Sign In Modal'>
              <Icon
                icon='material-symbols:close-rounded'
                width={24}
                height={24}
                className='text-black hover:text-primary inline-block hover:cursor-pointer'
              />
            </button>
            <Signin />
          </div>
        </div>
      )}
    </section>
  )
}

export default Banner
