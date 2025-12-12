'use client'
import { useState } from 'react'
import Link from 'next/link'

// 프로페셔널 스타일 (패스트캠퍼스 레퍼런스)
export default function StyleCPage() {
  const [activeTab, setActiveTab] = useState('all')

  const courses = [
    {
      id: 1,
      badge: 'BEST',
      badgeColor: 'bg-violet-600',
      title: '한 번에 끝내는 프론트엔드 개발 초격차 패키지',
      description: 'React, TypeScript, Next.js를 한 번에! 현업 개발자 10인의 실전 노하우',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop',
      instructor: '김개발 외 9명',
      originalPrice: 449000,
      salePrice: 199000,
      discount: 56,
      tags: ['React', 'TypeScript', 'Next.js'],
      duration: '115시간',
      lectures: 234,
    },
    {
      id: 2,
      badge: 'NEW',
      badgeColor: 'bg-cyan-500',
      title: 'AI 시대, 데이터 분석 완전 정복',
      description: 'Python, SQL부터 머신러닝까지 데이터 분석의 모든 것',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop',
      instructor: '이데이터',
      originalPrice: 398000,
      salePrice: 178000,
      discount: 55,
      tags: ['Python', 'SQL', 'ML'],
      duration: '89시간',
      lectures: 156,
    },
    {
      id: 3,
      badge: 'HOT',
      badgeColor: 'bg-rose-500',
      title: 'AWS 클라우드 아키텍처 마스터',
      description: '현직 AWS 솔루션 아키텍트가 알려주는 실전 클라우드',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop',
      instructor: '박클라우드',
      originalPrice: 378000,
      salePrice: 168000,
      discount: 56,
      tags: ['AWS', 'DevOps', 'Docker'],
      duration: '72시간',
      lectures: 128,
    },
  ]

  const stats = [
    { value: '50만+', label: '누적 수강생' },
    { value: '2,000+', label: '강의 콘텐츠' },
    { value: '98%', label: '완강률' },
    { value: '92%', label: '취업/이직 성공' },
  ]

  const features = [
    {
      icon: '🎯',
      title: '실무 프로젝트',
      description: '포트폴리오로 활용 가능한 실전 프로젝트',
    },
    {
      icon: '👨‍💻',
      title: '현직자 멘토링',
      description: '현업 전문가의 1:1 코드 리뷰',
    },
    {
      icon: '📜',
      title: '수료증 발급',
      description: '공인된 수료증으로 커리어 증명',
    },
    {
      icon: '♾️',
      title: '평생 소장',
      description: '한 번 결제로 평생 무제한 수강',
    },
  ]

  const testimonials = [
    {
      content: '비전공자였지만 이 강의 덕분에 3개월 만에 개발자로 이직했습니다. 체계적인 커리큘럼이 정말 좋았어요.',
      author: '김OO',
      role: '프론트엔드 개발자',
      company: '카카오',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      content: '현업에서 바로 쓸 수 있는 스킬을 배웠습니다. 특히 AWS 강의는 실무에 큰 도움이 됐어요.',
      author: '이OO',
      role: '백엔드 개발자',
      company: '네이버',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
      content: '데이터 분석 강의 수강 후 연봉 30% 인상된 회사로 이직 성공! 감사합니다.',
      author: '박OO',
      role: '데이터 분석가',
      company: '쿠팡',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/designex/style-c" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-lg" />
                <div className="absolute inset-0.5 bg-slate-950 rounded-md flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-cyan-400 font-bold">E</span>
                </div>
              </div>
              <span className="text-xl font-bold">E-Class</span>
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-slate-300 hover:text-white font-medium transition-colors">온라인</a>
              <a href="#" className="text-slate-300 hover:text-white font-medium transition-colors">캠프</a>
              <a href="#" className="text-slate-300 hover:text-white font-medium transition-colors">기업교육</a>
              <a href="#" className="text-slate-300 hover:text-white font-medium transition-colors">채용연계</a>
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-slate-400">검색</span>
              </button>

              <button className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
                로그인
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-lg font-medium transition-all">
                무료 체험
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-950 to-cyan-900/20" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-full mb-8">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 font-medium">지금 가입하면 전 강의 55% 할인</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8">
              커리어 성장을 위한<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                실무 교육 아카데미
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              현직 전문가들이 직접 설계한 커리큘럼으로<br />
              실무에서 바로 통하는 진짜 실력을 키우세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105">
                전체 강의 보기
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-lg transition-colors">
                무료 강의 체험
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-3xl border border-slate-700">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COURSES ========== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                초격차 패키지
              </h2>
              <p className="text-slate-400">
                한 번에 끝내는 올인원 커리큘럼으로 실력을 완성하세요
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
              {['all', 'dev', 'data', 'business'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'all' ? '전체' : tab === 'dev' ? '개발' : tab === 'data' ? '데이터' : '비즈니스'}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <a
                key={course.id}
                href="#"
                className="group bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-violet-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 ${course.badgeColor} text-white text-xs font-bold rounded-md`}>
                    {course.badge}
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {course.lectures}개
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-md border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <p className="text-sm text-slate-500 mb-4">{course.instructor}</p>

                  {/* Price */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-sm font-bold rounded">
                      {course.discount}%
                    </span>
                    <span className="text-2xl font-bold">
                      ₩{course.salePrice.toLocaleString()}
                    </span>
                    <span className="text-slate-500 line-through text-sm">
                      ₩{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 border border-slate-700 hover:border-violet-500 text-slate-300 hover:text-white rounded-xl font-semibold transition-all hover:bg-slate-800">
              전체 강의 보기 →
            </button>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              수강생 후기
            </h2>
            <p className="text-slate-400">
              실제 수강생들의 생생한 취업/이직 성공 스토리
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">
                      {testimonial.role} @ {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-10" />

            <div className="relative px-8 py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                지금 시작하면 55% 할인!
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                첫 구매 고객 한정 특별 할인 혜택을 놓치지 마세요.
                지금 바로 커리어 성장을 시작하세요.
              </p>
              <button className="px-10 py-4 bg-white text-violet-600 hover:bg-slate-100 rounded-xl font-bold text-lg transition-colors shadow-xl">
                할인 혜택 받기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-lg" />
                  <div className="absolute inset-0.5 bg-slate-950 rounded-md flex items-center justify-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-cyan-400 font-bold">E</span>
                  </div>
                </div>
                <span className="text-xl font-bold">E-Class</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                커리어 성장을 위한 실무 교육 아카데미
              </p>
              <div className="flex gap-3">
                {['📘', '📷', '🐦', '💼'].map((emoji, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                    {emoji}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: '교육', links: ['온라인 강의', '캠프', '기업교육', '채용연계'] },
              { title: '고객센터', links: ['공지사항', 'FAQ', '1:1 문의', '환불 정책'] },
              { title: '회사', links: ['회사 소개', '채용', '블로그', '제휴 문의'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800 text-sm text-slate-500">
            <div className="flex flex-wrap gap-4 mb-4">
              <a href="#" className="hover:text-slate-300">이용약관</a>
              <a href="#" className="hover:text-slate-300 font-semibold">개인정보처리방침</a>
              <a href="#" className="hover:text-slate-300">저작권 정책</a>
            </div>
            <p>(주)한국SNS인재개발원 | 대표: 홍길동 | 사업자등록번호: 000-00-00000</p>
            <p className="mt-1">서울특별시 강남구 테헤란로 123 | 통신판매업신고: 제2024-서울강남-0000호</p>
            <p className="mt-4">© 2024 E-Class. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Design List */}
      <Link
        href="/designex"
        className="fixed bottom-6 right-6 px-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        디자인 목록
      </Link>
    </div>
  )
}
