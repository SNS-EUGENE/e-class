'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { courses as coursesApi, categories as categoriesApi } from '@/lib/supabase'
import { Header, Footer } from '@/components/layout'
import type { Course, Category } from '@/types/database'

// 카테고리별 그라데이션 색상 (인라인 스타일용)
const CATEGORY_COLORS = [
  { from: '#2563eb', to: '#1e40af' }, // blue
  { from: '#9333ea', to: '#6b21a8' }, // purple
  { from: '#16a34a', to: '#166534' }, // green
  { from: '#ea580c', to: '#9a3412' }, // orange
  { from: '#db2777', to: '#9d174d' }, // pink
  { from: '#0891b2', to: '#155e75' }, // cyan
  { from: '#4f46e5', to: '#3730a3' }, // indigo
  { from: '#0d9488', to: '#115e59' }, // teal
]

const getGradientStyle = (index: number) => {
  const colors = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  return {
    background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})`
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<(Course & { category: Category | null })[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [activeCategory])

  const fetchData = async () => {
    try {
      // 카테고리 목록 가져오기
      const { data: categoriesData } = await categoriesApi.getAll()
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const options: { published?: boolean; categoryId?: string } = { published: true }

      if (activeCategory !== 'all') {
        options.categoryId = activeCategory
      }

      const { data: coursesData } = await coursesApi.getAll(options)
      setCourses(coursesData || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDiscount = (original: number, sale?: number | null) => {
    if (!sale || sale >= original) return 0
    return Math.round((1 - sale / original) * 100)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
    }
    return `${mins}분`
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

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              전체
            </button>
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
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {courses.map((course, index) => {
                    const discount = getDiscount(course.price, course.sale_price)
                    const displayPrice = course.sale_price || course.price

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
                            <div
                              style={getGradientStyle(index)}
                              className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-all duration-500"
                            >
                              <div className="text-center">
                                <svg className="w-12 h-12 text-white/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-white/60 text-xs font-medium">{course.category?.name || '온라인 클래스'}</span>
                              </div>
                            </div>
                          )}
                          {/* Duration Badge */}
                          {course.duration_minutes > 0 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white/80">
                              {formatDuration(course.duration_minutes)}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div>
                          {/* Category & Instructor */}
                          <div className="flex items-center gap-2 mb-1">
                            {course.category && (
                              <span className="text-xs text-orange-400">{course.category.name}</span>
                            )}
                            {course.category && course.instructor_name && (
                              <span className="text-white/20">·</span>
                            )}
                            {course.instructor_name && (
                              <span className="text-xs text-white/40">{course.instructor_name}</span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-[15px] font-medium leading-snug mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                            {course.title}
                          </h3>

                          {/* Description */}
                          {course.description && (
                            <p className="text-xs text-white/30 mb-3 line-clamp-1">{course.description}</p>
                          )}

                          {/* Price */}
                          {displayPrice > 0 ? (
                            <div className="flex items-baseline gap-2">
                              {discount > 0 && (
                                <span className="text-xs text-orange-400 font-medium">{discount}%</span>
                              )}
                              <span className="font-semibold">₩{displayPrice.toLocaleString()}</span>
                              {discount > 0 && (
                                <span className="text-xs text-white/30 line-through">₩{course.price.toLocaleString()}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-orange-400 font-medium">무료</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
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
