'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'

// 숫자 카운트업 훅
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
      const currentCount = Math.round(progress * end)
      setCount(currentCount)

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [hasStarted, end, duration])

  return { count, ref, suffix }
}

export default function Home() {
  const students = useCountUp(140, 2000, '만+')
  const classes = useCountUp(6000, 2000, '+')
  const satisfaction = useCountUp(98, 2000, '%')

  const featuredCourses = [
    {
      id: 1,
      title: '현직 개발자와 함께하는 React 실전 프로젝트',
      instructor: '김개발',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      originalPrice: 198000,
      salePrice: 89000,
      discount: 55,
      rating: 4.9,
      reviews: 234,
    },
    {
      id: 2,
      title: '브랜딩부터 UX까지, 디자이너의 실무 노하우',
      instructor: '이디자인',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      originalPrice: 178000,
      salePrice: 79000,
      discount: 56,
      rating: 4.8,
      reviews: 189,
    },
    {
      id: 3,
      title: '데이터로 성과를 만드는 마케팅 전략 A to Z',
      instructor: '박마케팅',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      originalPrice: 156000,
      salePrice: 69000,
      discount: 56,
      rating: 4.7,
      reviews: 156,
    },
  ]

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: '체계적인 커리큘럼',
      description: '전문가가 설계한 단계별 학습 과정으로 효율적으로 배웁니다',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: '공인 자격증 발급',
      description: '시험 합격 후 공식 인증 자격증을 즉시 발급받을 수 있습니다',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '실시간 진도 관리',
      description: '학습 진행률을 실시간으로 확인하고 목표를 달성하세요',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        {/* Background Glow */}
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
                <Link
                  href="/courses"
                  className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-all hover:shadow-lg hover:shadow-white/10"
                >
                  클래스 둘러보기
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  무료로 시작하기 →
                </Link>
              </div>
            </div>

            {/* Stats */}
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

      {/* Featured Courses */}
      <section className="px-5 py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-semibold mb-1">인기 클래스</h2>
              <p className="text-sm text-white/40">지금 가장 많이 찾는 클래스</p>
            </div>
            <Link href="/courses" className="text-sm text-white/50 hover:text-white transition-colors">
              전체보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group block rounded-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-neutral-900 shadow-lg shadow-black/30 group-hover:shadow-xl group-hover:shadow-black/40 transition-shadow">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-20 bg-neutral-900/50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold mb-2">왜 E-Class인가요?</h2>
            <p className="text-white/40">학습의 모든 단계를 지원합니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-5 py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-neutral-900 to-neutral-900" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <p className="text-sm text-orange-400 mb-2">신규 가입 혜택</p>
              <h3 className="text-2xl font-semibold mb-2">
                지금 시작하면 5,000 크레딧
              </h3>
              <p className="text-sm text-white/50">
                첫 클래스 결제에 바로 사용할 수 있어요
              </p>
            </div>
            <Link
              href="/register"
              className="relative z-10 px-8 py-3 bg-orange-500 hover:bg-orange-400 text-sm font-medium rounded-full transition-all whitespace-nowrap shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
