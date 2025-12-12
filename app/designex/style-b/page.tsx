'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// 숫자 카운트업 훅 - 일정한 속도로 올라감 (linear)
function useCountUp(end: number, duration: number = 2000, suffix: string = '') {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let rafId: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Linear interpolation - 일정 속도
      const currentCount = Math.round(progress * end)
      setCount(currentCount)

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        setCount(end) // 정확히 목표값으로 마무리
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [hasStarted, end, duration])

  return { count, ref, suffix }
}

// Style B - 다크 테마 + 세련된 효과
export default function StyleBPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 숫자 카운트업
  const students = useCountUp(140, 2000, '만+')
  const classes = useCountUp(6000, 2000, '+')
  const satisfaction = useCountUp(98, 2000, '%')

  // 검색창 열릴 때 포커스
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const courses = [
    {
      id: 1,
      title: '현직 개발자와 함께하는 React 실전 프로젝트',
      instructor: '김개발',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      category: '개발',
      originalPrice: 198000,
      salePrice: 89000,
      discount: 55,
      rating: 4.9,
      reviews: 234,
      badge: null,
    },
    {
      id: 2,
      title: '브랜딩부터 UX까지, 디자이너의 실무 노하우',
      instructor: '이디자인',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      category: '디자인',
      originalPrice: 178000,
      salePrice: 79000,
      discount: 56,
      rating: 4.8,
      reviews: 189,
      badge: 'BEST',
    },
    {
      id: 3,
      title: '데이터로 성과를 만드는 마케팅 전략 A to Z',
      instructor: '박마케팅',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      category: '마케팅',
      originalPrice: 156000,
      salePrice: 69000,
      discount: 56,
      rating: 4.7,
      reviews: 156,
      badge: null,
    },
    {
      id: 4,
      title: '나만의 감성 담은 수제 가죽공예',
      instructor: '최공예',
      thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
      category: '공예',
      originalPrice: 128000,
      salePrice: 59000,
      discount: 54,
      rating: 4.9,
      reviews: 312,
      badge: 'NEW',
    },
    {
      id: 5,
      title: '영상 편집의 정석, 프리미어 프로 마스터',
      instructor: '정영상',
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
      category: '영상',
      originalPrice: 168000,
      salePrice: 75000,
      discount: 55,
      rating: 4.6,
      reviews: 98,
      badge: null,
    },
    {
      id: 6,
      title: '일러스트레이터로 그리는 감성 일러스트',
      instructor: '한일러',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
      category: '디자인',
      originalPrice: 145000,
      salePrice: 65000,
      discount: 55,
      rating: 4.8,
      reviews: 203,
      badge: null,
    },
  ]

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'dev', name: '개발' },
    { id: 'design', name: '디자인' },
    { id: 'marketing', name: '마케팅' },
    { id: 'video', name: '영상' },
    { id: 'craft', name: '공예' },
  ]

  const creators = [
    {
      name: '김개발',
      field: '프론트엔드 개발',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      courses: 12,
    },
    {
      name: '이디자인',
      field: 'UI/UX 디자인',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      courses: 8,
    },
    {
      name: '박마케팅',
      field: '그로스 마케팅',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      courses: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden font-[Pretendard,system-ui,sans-serif]">
      {/* ========== HEADER ========== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-screen-xl mx-auto px-5">
          <div className="flex items-center justify-between h-16 relative">
            <Link href="/designex/style-b" className="text-xl font-semibold tracking-tight">
              eclass
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-base font-semibold text-white/70 hover:text-white transition-colors">클래스</a>
              <a href="#" className="text-base font-semibold text-white/70 hover:text-white transition-colors">크리에이터</a>
              <a href="#" className="text-base font-semibold text-white/70 hover:text-white transition-colors">커뮤니티</a>
            </nav>

            <div className="flex items-center gap-3">
              {/* 검색 아이콘 */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex w-9 h-9 items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button className="text-sm text-white/60 hover:text-white transition-colors">
                로그인
              </button>
              <button className="text-sm px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors">
                시작하기
              </button>
            </div>

            {/* 확장 검색바 - 로그인/시작하기 왼쪽에 위치 */}
            <div
              className={`absolute right-[180px] top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ease-out origin-right ${
                isSearchOpen
                  ? 'opacity-100 scale-x-100 pointer-events-auto'
                  : 'opacity-0 scale-x-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center bg-neutral-900/95 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/60">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-56 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative pt-32 pb-20 px-5 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-20 right-[10%] w-96 h-96 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(251,146,60,0.4) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 left-[5%] w-64 h-64 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="max-w-screen-xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <p className="text-sm text-orange-400 mb-4">첫 구매 55% 할인 중</p>
              <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                배움에는<br />
                정해진 순서가 없다
              </h1>
              <p className="text-lg text-white/50 mb-10 max-w-md">
                6,000개 이상의 클래스에서 당신만의 속도로,
                당신만의 방식으로 배워보세요.
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-all hover:shadow-lg hover:shadow-white/10">
                  클래스 둘러보기
                </button>
                <button className="px-6 py-3 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  크리에이터 지원 →
                </button>
              </div>
            </div>

            {/* Right - Stats with Count Up */}
            <div className="hidden lg:flex items-center justify-end">
              <div className="flex gap-12">
                <div ref={students.ref} className="text-center">
                  <p className="text-4xl font-bold text-white mb-1 tabular-nums">
                    {students.count}{students.suffix}
                  </p>
                  <p className="text-sm text-white/40">수강생</p>
                </div>
                <div ref={classes.ref} className="text-center">
                  <p className="text-4xl font-bold text-white mb-1 tabular-nums">
                    {classes.count.toLocaleString()}{classes.suffix}
                  </p>
                  <p className="text-sm text-white/40">클래스</p>
                </div>
                <div ref={satisfaction.ref} className="text-center">
                  <p className="text-4xl font-bold text-white mb-1 tabular-nums">
                    {satisfaction.count}{satisfaction.suffix}
                  </p>
                  <p className="text-sm text-white/40">만족도</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED IMAGE ========== */}
      <section className="px-5 pb-20">
        <div className="max-w-screen-xl mx-auto">
          <a href="#" className="group block relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 hover:shadow-black/70 transition-shadow duration-300">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=600&fit=crop"
              alt="Featured"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 max-w-md">
              <span className="inline-block px-3 py-1 bg-orange-500 text-xs font-medium rounded mb-3">
                PICK
              </span>
              <h3 className="text-2xl font-semibold mb-2">
                이번 주 에디터's 픽
              </h3>
              <p className="text-sm text-white/70">
                실무에서 바로 쓰는 협업 스킬부터 사이드 프로젝트까지
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="px-5 pb-6 border-b border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all ${
                  activeTab === cat.id
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COURSE GRID ========== */}
      <section className="px-5 py-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-1">인기 클래스</h2>
              <p className="text-sm text-white/40">지금 가장 많이 찾는 클래스</p>
            </div>
            <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">
              전체보기 →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
            {courses.map((course) => (
              <a
                key={course.id}
                href="#"
                className="group block rounded-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-neutral-900 shadow-lg shadow-black/30 group-hover:shadow-xl group-hover:shadow-black/40 transition-shadow duration-300">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  {course.badge && (
                    <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold rounded ${
                      course.badge === 'NEW' ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}>
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="text-xs text-white/40 mb-1">{course.instructor}</p>
                  <h3 className="text-[15px] font-medium leading-snug mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <span className="text-orange-400">★ {course.rating}</span>
                    <span>·</span>
                    <span>후기 {course.reviews}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-orange-400 font-medium">{course.discount}%</span>
                    <span className="font-semibold">₩{course.salePrice.toLocaleString()}</span>
                    <span className="text-xs text-white/30 line-through">₩{course.originalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CREATORS ========== */}
      <section className="px-5 py-20 bg-neutral-900/50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-semibold mb-1">인기 크리에이터</h2>
              <p className="text-sm text-white/40">분야별 전문가를 만나보세요</p>
            </div>
            <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">
              전체보기 →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map((creator, i) => (
              <a
                key={i}
                href="#"
                className="group flex items-center gap-5 p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
              >
                <div className="relative">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{creator.name}</h3>
                  <p className="text-sm text-white/40">{creator.field}</p>
                  <p className="text-xs text-white/30 mt-1">{creator.courses}개 클래스</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="px-5 py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Background with depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-neutral-900 to-neutral-900" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative z-10">
              <p className="text-sm text-orange-400 mb-2">신규 가입 혜택</p>
              <h3 className="text-2xl font-semibold mb-2">
                지금 시작하면 5,000 크레딧
              </h3>
              <p className="text-sm text-white/50">
                첫 클래스 결제에 바로 사용할 수 있어요
              </p>
            </div>
            <button className="relative z-10 px-8 py-3 bg-orange-500 hover:bg-orange-400 text-sm font-medium rounded-full transition-all whitespace-nowrap shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105">
              무료로 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="px-5 py-16 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <p className="text-xl font-semibold mb-4">eclass</p>
              <p className="text-sm text-white/40 mb-6 max-w-xs">
                누구나 자신만의 속도로 배울 수 있는 온라인 클래스 플랫폼
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/30 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-white/30 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-white/30 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-4">서비스</p>
              <ul className="space-y-3 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">클래스</a></li>
                <li><a href="#" className="hover:text-white transition-colors">크리에이터</a></li>
                <li><a href="#" className="hover:text-white transition-colors">기업교육</a></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium mb-4">고객지원</p>
              <ul className="space-y-3 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">공지사항</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">1:1 문의</a></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium mb-4">회사</p>
              <ul className="space-y-3 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">회사소개</a></li>
                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="#" className="hover:text-white transition-colors">블로그</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-white/30">
              <div className="flex flex-wrap gap-4">
                <a href="#" className="hover:text-white transition-colors">이용약관</a>
                <a href="#" className="hover:text-white transition-colors font-medium text-white/50">개인정보처리방침</a>
                <a href="#" className="hover:text-white transition-colors">저작권 정책</a>
              </div>
              <p>© 2024 eclass. All rights reserved.</p>
            </div>
            <p className="text-xs text-white/20 mt-4">
              (주)한국SNS인재개발원 | 대표: 홍길동 | 사업자등록번호: 000-00-00000 | 서울특별시 강남구 테헤란로 123
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Design List */}
      <Link
        href="/designex"
        className="fixed bottom-6 right-6 px-4 py-2.5 bg-white/10 backdrop-blur-md text-white text-sm rounded-full border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        목록
      </Link>
    </div>
  )
}
