'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category, Course, Banner } from '@/types/database'

export default function TestConnectionPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    categories: Category[]
    courses: Course[]
    banners: Banner[]
    settings: { key: string; value: unknown }[]
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

        // 직접 supabase 클라이언트로 테스트
        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('*')

        console.log('Categories:', categoriesData, catError)
        if (catError) throw new Error(`카테고리 에러: ${catError.message}`)

        const { data: coursesData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .limit(5)

        console.log('Courses:', coursesData, courseError)
        if (courseError) throw new Error(`코스 에러: ${courseError.message}`)

        const { data: bannersData, error: bannerError } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)

        console.log('Banners:', bannersData, bannerError)
        if (bannerError) throw new Error(`배너 에러: ${bannerError.message}`)

        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')

        console.log('Settings:', settingsData, settingsError)
        if (settingsError) throw new Error(`설정 에러: ${settingsError.message}`)

        setData({
          categories: categoriesData || [],
          courses: coursesData || [],
          banners: bannersData || [],
          settings: settingsData || []
        })
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 에러')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Supabase 연결 테스트 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">연결 실패</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Supabase 연결 성공!</h1>
          <p className="text-white/60">모든 데이터가 정상적으로 불러와졌습니다.</p>
        </div>

        <div className="grid gap-6">
          {/* 카테고리 */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              카테고리 ({data?.categories.length}개)
            </h2>
            <div className="flex flex-wrap gap-2">
              {data?.categories.map((cat) => (
                <span key={cat.id} className="px-3 py-1 bg-white/5 rounded-full text-sm">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          {/* 코스 */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              코스 (최근 5개)
            </h2>
            <div className="space-y-3">
              {data?.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-white/50">
                      {course.instructor_name}
                    </p>
                  </div>
                  <div className="text-right">
                    {course.sale_price && course.sale_price < course.price ? (
                      <>
                        <p className="text-sm text-white/40 line-through">₩{course.price.toLocaleString()}</p>
                        <p className="font-semibold text-orange-400">₩{course.sale_price.toLocaleString()}</p>
                      </>
                    ) : (
                      <p className="font-semibold">₩{course.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 배너 */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              배너 ({data?.banners.length}개)
            </h2>
            <div className="space-y-2">
              {data?.banners.map((banner) => (
                <div key={banner.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span>{banner.title}</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                    {banner.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 사이트 설정 */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              사이트 설정
            </h2>
            <div className="space-y-2 font-mono text-sm">
              {data?.settings.map((setting) => (
                <div key={setting.key} className="flex gap-2 p-2 bg-white/5 rounded">
                  <span className="text-purple-400">{setting.key}:</span>
                  <span className="text-white/70">{JSON.stringify(setting.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 rounded-lg transition-colors">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
