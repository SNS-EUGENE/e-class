'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { courses as coursesApi, enrollments as enrollmentsApi } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Header, Footer } from '@/components/layout'
import type { Course, Category, ChapterWithLessons, Lesson } from '@/types/database'

// 기본 그라데이션 스타일
const DEFAULT_GRADIENT_STYLE = {
  background: 'linear-gradient(to bottom right, #ea580c, #9a3412)'
}

type CourseWithDetails = Course & {
  category: Category | null
  chapters?: ChapterWithLessons[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [course, setCourse] = useState<CourseWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<'intro' | 'curriculum' | 'reviews'>('intro')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (params.id) {
      fetchCourse()
    }
  }, [params.id])

  useEffect(() => {
    if (user && params.id) {
      checkEnrollment()
    }
  }, [user, params.id])

  const fetchCourse = async () => {
    try {
      const { data, error } = await coursesApi.getWithChapters(params.id as string)
      if (error) throw error
      setCourse(data)

      // 첫 번째 챕터는 기본적으로 펼치기
      if (data?.chapters && data.chapters.length > 0) {
        setExpandedChapters(new Set([data.chapters[0].id]))
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const { enrolled } = await enrollmentsApi.check(user!.id, params.id as string)
      setIsEnrolled(enrolled)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (isEnrolled) {
      router.push(`/courses/${params.id}/learn`)
      return
    }

    // 유료 코스인 경우 크레딧 체크
    const coursePrice = course?.sale_price || course?.price || 0
    if (coursePrice > 0) {
      if (!profile || profile.credits < coursePrice) {
        alert('크레딧이 부족합니다. 크레딧을 충전해주세요.')
        router.push('/shop')
        return
      }
    }

    setEnrolling(true)
    try {
      const { error } = await enrollmentsApi.create(user.id, params.id as string)
      if (error) throw error

      setIsEnrolled(true)
      router.push(`/courses/${params.id}/learn`)
    } catch (error) {
      console.error('Error enrolling:', error)
      alert('수강 신청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setEnrolling(false)
    }
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatTotalDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
    }
    return `${mins}분`
  }

  const getDiscount = (original: number, sale?: number | null) => {
    if (!sale || sale >= original) return 0
    return Math.round((1 - sale / original) * 100)
  }

  const getTotalLessons = () => {
    if (!course?.chapters) return 0
    return course.chapters.reduce((acc, chapter) => acc + (chapter.lessons?.length || 0), 0)
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

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-white/60 mb-4">강의를 찾을 수 없습니다.</p>
          <Link href="/courses" className="text-orange-400 hover:text-orange-300">
            목록으로 돌아가기
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const discount = getDiscount(course.price, course.sale_price)
  const displayPrice = course.sale_price || course.price

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-neutral-900">
          <div className="absolute inset-0 overflow-hidden">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
            ) : (
              <div style={{...DEFAULT_GRADIENT_STYLE, opacity: 0.3}} className="w-full h-full" />
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

                {course.category && (
                  <span className="inline-block px-3 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full mb-4">
                    {course.category.name}
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {course.title}
                </h1>

                {course.instructor_name && (
                  <p className="text-white/60 mb-2">{course.instructor_name}</p>
                )}

                {course.description && (
                  <p className="text-white/50 mb-6 max-w-2xl">
                    {course.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    총 {formatTotalDuration(course.duration_minutes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {getTotalLessons()}개 강의
                  </span>
                  {course.chapters && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {course.chapters.length}개 챕터
                    </span>
                  )}
                </div>
              </div>

              {/* Price Card */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 sticky top-24">
                  {/* Thumbnail */}
                  <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-neutral-900">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div style={DEFAULT_GRADIENT_STYLE} className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-white/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white/60 text-sm font-medium">{course.category?.name || '온라인 클래스'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {displayPrice > 0 ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-1">
                          {discount > 0 && (
                            <span className="text-orange-400 font-bold">{discount}%</span>
                          )}
                          <span className="text-3xl font-bold">₩{displayPrice.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                          <span className="text-sm text-white/30 line-through">₩{course.price.toLocaleString()}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-orange-400">무료</span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white font-semibold rounded-xl transition-all mb-3"
                  >
                    {enrolling ? '처리 중...' : isEnrolled ? '이어서 학습하기' : '수강 신청하기'}
                  </button>

                  {!isEnrolled && (
                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10">
                      장바구니에 담기
                    </button>
                  )}

                  {displayPrice > 0 && (
                    <p className="text-xs text-white/30 text-center mt-4">
                      30일 이내 환불 가능
                    </p>
                  )}
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
                  onClick={() => setActiveTab(tab.id as 'intro' | 'curriculum' | 'reviews')}
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
                      <span>현업 전문가의 실무 노하우가 궁금한 분</span>
                    </li>
                  </ul>

                  <h2 className="text-xl font-semibold mb-4">클래스 소개</h2>
                  <p className="text-white/60 mb-4">
                    {course.description}
                  </p>
                  <p className="text-white/60">
                    이 강의에서는 기초 개념부터 시작하여 실제 프로젝트를 완성하는 과정까지 단계별로 학습합니다.
                    각 챕터마다 실습 과제가 포함되어 있어 직접 코드를 작성하며 배울 수 있습니다.
                  </p>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">커리큘럼</h2>
                    <span className="text-sm text-white/40">
                      {course.chapters?.length || 0}개 챕터 · {getTotalLessons()}개 강의
                    </span>
                  </div>

                  {course.chapters && course.chapters.length > 0 ? (
                    <div className="space-y-3">
                      {course.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.id} className="border border-white/5 rounded-xl overflow-hidden">
                          {/* Chapter Header */}
                          <button
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 text-sm font-medium">
                                {chapterIndex + 1}
                              </span>
                              <span className="font-medium">{chapter.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-white/40">{chapter.lessons?.length || 0}개 강의</span>
                              <svg
                                className={`w-5 h-5 text-white/40 transition-transform ${expandedChapters.has(chapter.id) ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>

                          {/* Lessons */}
                          {expandedChapters.has(chapter.id) && chapter.lessons && (
                            <div className="border-t border-white/5">
                              {chapter.lessons.map((lesson: Lesson, lessonIndex: number) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center text-xs text-white/30">
                                      {lessonIndex + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {lesson.is_preview ? (
                                        <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                      )}
                                      <span className="text-sm text-white/70">{lesson.title}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {lesson.is_preview && (
                                      <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded">
                                        미리보기
                                      </span>
                                    )}
                                    <span className="text-xs text-white/30">
                                      {formatDuration(lesson.duration_seconds)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-center py-8">커리큘럼이 준비 중입니다.</p>
                  )}
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
