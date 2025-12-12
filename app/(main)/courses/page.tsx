'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Header, Footer } from '@/components/layout'

interface Course {
  id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  thumbnail_url?: string
  instructor?: string
  price?: number
  sale_price?: number
}

interface Progress {
  course_id: string
  progress: number
  completed: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [progressData, setProgressData] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'dev', name: '개발' },
    { id: 'design', name: '디자인' },
    { id: 'marketing', name: '마케팅' },
    { id: 'business', name: '비즈니스' },
    { id: 'data', name: '데이터' },
  ]

  // 샘플 코스 (DB에 데이터가 없을 때 표시)
  const sampleCourses = [
    {
      id: 'sample-1',
      title: '현직 개발자와 함께하는 React 실전 프로젝트',
      description: 'React를 처음부터 끝까지 마스터하는 완벽한 강의',
      instructor: '김개발',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      price: 198000,
      sale_price: 89000,
      duration_minutes: 420,
      video_url: '',
    },
    {
      id: 'sample-2',
      title: '브랜딩부터 UX까지, 디자이너의 실무 노하우',
      description: 'UI/UX 디자인 실무를 배우는 종합 강의',
      instructor: '이디자인',
      thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      price: 178000,
      sale_price: 79000,
      duration_minutes: 360,
      video_url: '',
    },
    {
      id: 'sample-3',
      title: '데이터로 성과를 만드는 마케팅 전략 A to Z',
      description: '마케팅 전략 수립부터 실행까지',
      instructor: '박마케팅',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      price: 156000,
      sale_price: 69000,
      duration_minutes: 300,
      video_url: '',
    },
    {
      id: 'sample-4',
      title: 'Python으로 시작하는 데이터 분석 입문',
      description: '파이썬 기초부터 데이터 분석까지',
      instructor: '최데이터',
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      price: 128000,
      sale_price: 59000,
      duration_minutes: 480,
      video_url: '',
    },
    {
      id: 'sample-5',
      title: 'Node.js 백엔드 개발 마스터 클래스',
      description: 'Node.js로 서버 개발 마스터하기',
      instructor: '정백엔드',
      thumbnail_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
      price: 168000,
      sale_price: 75000,
      duration_minutes: 540,
      video_url: '',
    },
    {
      id: 'sample-6',
      title: 'Figma 완전정복: UI/UX 디자인 실무',
      description: 'Figma로 시작하는 디자인 실무',
      instructor: '한피그마',
      thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
      price: 145000,
      sale_price: 65000,
      duration_minutes: 320,
      video_url: '',
    },
  ]

  useEffect(() => {
    fetchCoursesAndProgress()
  }, [])

  const fetchCoursesAndProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // 강의 목록 가져오기
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true })

      setCourses(coursesData || [])

      // 로그인한 사용자면 진도 가져오기
      if (user) {
        const { data: progressData } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id)

        setProgressData(progressData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = (courseId: string) => {
    const progress = progressData.find(p => p.course_id === courseId)
    return progress ? Math.round(progress.progress * 100) : 0
  }

  const displayCourses = courses.length > 0 ? courses : sampleCourses

  const getDiscount = (original?: number, sale?: number) => {
    if (!original || !sale) return 0
    return Math.round((1 - sale / original) * 100)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="pt-24 pb-20 px-5">
        <div className="max-w-screen-xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold mb-2">전체 클래스</h1>
            <p className="text-white/50">원하는 분야의 클래스를 찾아보세요</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Course Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayCourses.map((course) => {
                  const progress = getProgress(course.id)
                  const discount = getDiscount(course.price, course.sale_price)

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="group block rounded-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-neutral-900 shadow-lg shadow-black/30 group-hover:shadow-xl group-hover:shadow-black/40 transition-shadow">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-neutral-900">
                            <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {/* Progress Bar */}
                        {progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                            <div
                              className="h-full bg-orange-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <p className="text-xs text-white/40 mb-1">{course.instructor || '강사 미정'}</p>
                        <h3 className="text-[15px] font-medium leading-snug mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-white/30 mb-3 line-clamp-1">{course.description}</p>
                        {course.sale_price ? (
                          <div className="flex items-baseline gap-2">
                            {discount > 0 && (
                              <span className="text-xs text-orange-400 font-medium">{discount}%</span>
                            )}
                            <span className="font-semibold">₩{course.sale_price.toLocaleString()}</span>
                            {course.price && course.price !== course.sale_price && (
                              <span className="text-xs text-white/30 line-through">₩{course.price.toLocaleString()}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-orange-400">무료</span>
                        )}
                        {progress > 0 && (
                          <div className="mt-2 text-xs text-orange-400">
                            {progress}% 수강 중
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Empty State */}
              {displayCourses.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/40">등록된 클래스가 없습니다.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
