'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

interface Curriculum {
  id: string
  title: string
  duration: string
  isPreview?: boolean
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'intro' | 'curriculum' | 'reviews'>('intro')

  // 샘플 커리큘럼 (실제로는 DB에서 가져옴)
  const sampleCurriculum: Curriculum[] = [
    { id: '1', title: '강의 소개 및 개발환경 설정', duration: '15:30', isPreview: true },
    { id: '2', title: '기본 개념 이해하기', duration: '22:45' },
    { id: '3', title: '실전 프로젝트 시작', duration: '35:20' },
    { id: '4', title: '핵심 기능 구현하기', duration: '48:15' },
    { id: '5', title: '고급 테크닉 마스터', duration: '42:00' },
    { id: '6', title: '배포 및 운영', duration: '28:30' },
  ]

  // 샘플 코스 (DB에 데이터가 없을 때)
  const sampleCourse: Course = {
    id: 'sample-1',
    title: '현직 개발자와 함께하는 React 실전 프로젝트',
    description: 'React의 기초부터 고급 패턴까지, 실무에서 바로 활용할 수 있는 프로젝트 중심의 완벽한 강의입니다. 컴포넌트 설계, 상태 관리, 성능 최적화까지 현업 개발자의 노하우를 모두 담았습니다.',
    instructor: '김개발',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
    price: 198000,
    sale_price: 89000,
    duration_minutes: 420,
    video_url: '',
  }

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  const fetchCourse = async () => {
    try {
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

      setCourse(courseData || sampleCourse)
    } catch (error) {
      console.error('Error:', error)
      setCourse(sampleCourse)
    } finally {
      setLoading(false)
    }
  }

  const getDiscount = (original?: number, sale?: number) => {
    if (!original || !sale) return 0
    return Math.round((1 - sale / original) * 100)
  }

  const handleEnroll = async () => {
    // 실제로는 결제 프로세스 구현
    router.push(`/courses/${params.id}/learn`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  const displayCourse = course || sampleCourse
  const discount = getDiscount(displayCourse.price, displayCourse.sale_price)

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-neutral-900">
          <div className="absolute inset-0 overflow-hidden">
            {displayCourse.thumbnail_url && (
              <img
                src={displayCourse.thumbnail_url}
                alt={displayCourse.title}
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />
          </div>

          <div className="relative max-w-screen-xl mx-auto px-5 py-16">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  클래스 목록
                </Link>

                <p className="text-sm text-orange-400 mb-3">{displayCourse.instructor || '강사 미정'}</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {displayCourse.title}
                </h1>
                <p className="text-white/60 mb-6 max-w-2xl">
                  {displayCourse.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    총 {Math.floor((displayCourse.duration_minutes || 0) / 60)}시간 {(displayCourse.duration_minutes || 0) % 60}분
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {sampleCurriculum.length}개 강의
                  </span>
                  <span className="flex items-center gap-1 text-orange-400">
                    ★ 4.9 (234개 리뷰)
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 sticky top-24">
                  {/* Thumbnail */}
                  <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-neutral-900">
                    {displayCourse.thumbnail_url ? (
                      <img
                        src={displayCourse.thumbnail_url}
                        alt={displayCourse.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {displayCourse.sale_price ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-1">
                          {discount > 0 && (
                            <span className="text-orange-400 font-bold">{discount}%</span>
                          )}
                          <span className="text-3xl font-bold">₩{displayCourse.sale_price.toLocaleString()}</span>
                        </div>
                        {displayCourse.price && displayCourse.price !== displayCourse.sale_price && (
                          <span className="text-sm text-white/30 line-through">₩{displayCourse.price.toLocaleString()}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-orange-400">무료</span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <button
                    onClick={handleEnroll}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all mb-3"
                  >
                    수강 신청하기
                  </button>
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10">
                    장바구니에 담기
                  </button>

                  <p className="text-xs text-white/30 text-center mt-4">
                    30일 이내 환불 가능
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-b border-white/10 sticky top-16 bg-neutral-950 z-10">
          <div className="max-w-screen-xl mx-auto px-5">
            <div className="flex gap-8">
              {[
                { id: 'intro', label: '클래스 소개' },
                { id: 'curriculum', label: '커리큘럼' },
                { id: 'reviews', label: '수강평' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-white'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="max-w-screen-xl mx-auto px-5 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {activeTab === 'intro' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-semibold mb-4">이런 분들에게 추천해요</h2>
                  <ul className="space-y-2 text-white/60 mb-8">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>실무에서 바로 활용할 수 있는 기술을 배우고 싶은 분</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>체계적인 커리큘럼으로 기초부터 고급까지 배우고 싶은 분</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>현업 개발자의 실무 노하우가 궁금한 분</span>
                    </li>
                  </ul>

                  <h2 className="text-xl font-semibold mb-4">클래스 소개</h2>
                  <p className="text-white/60 mb-4">
                    {displayCourse.description}
                  </p>
                  <p className="text-white/60">
                    이 강의에서는 기초 개념부터 시작하여 실제 프로젝트를 완성하는 과정까지 단계별로 학습합니다.
                    각 챕터마다 실습 과제가 포함되어 있어 직접 코드를 작성하며 배울 수 있습니다.
                  </p>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">커리큘럼</h2>
                  <div className="space-y-3">
                    {sampleCurriculum.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-sm text-white/40">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-white/40">{item.duration}</p>
                          </div>
                        </div>
                        {item.isPreview && (
                          <span className="px-3 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                            미리보기
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">수강평</h2>
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="p-6 bg-white/[0.02] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-medium">
                            {['김', '이', '박'][review - 1]}
                          </div>
                          <div>
                            <p className="font-medium">{['김**', '이**', '박**'][review - 1]}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-orange-400 text-sm">★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-white/60 text-sm">
                          정말 유익한 강의였습니다. 실무에서 바로 적용할 수 있는 내용이 많아서 좋았어요.
                          강사님의 설명도 친절하고 이해하기 쉬웠습니다.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (for desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5 sticky top-32">
                <h3 className="font-semibold mb-4">이 클래스의 특징</h3>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    평생 무제한 수강
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    수료증 발급
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Q&A 게시판 이용
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    모바일 수강 가능
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
