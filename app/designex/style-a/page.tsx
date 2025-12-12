'use client'
import { useState } from 'react'
import Link from 'next/link'

// 모던 & 미니멀 스타일 (인프런/Coursera 레퍼런스)
export default function StyleAPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const courses = [
    {
      id: 1,
      title: '실무에 바로 적용하는 React 완벽 가이드',
      instructor: '김개발',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
      rating: 4.9,
      students: 12453,
      price: 154000,
      originalPrice: 198000,
      tags: ['React', 'Frontend'],
      isNew: true,
    },
    {
      id: 2,
      title: '파이썬으로 시작하는 데이터 사이언스',
      instructor: '이데이터',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      rating: 4.8,
      students: 8921,
      price: 129000,
      originalPrice: null,
      tags: ['Python', 'Data Science'],
      isNew: false,
    },
    {
      id: 3,
      title: 'AWS로 구축하는 클라우드 인프라',
      instructor: '박클라우드',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
      rating: 4.7,
      students: 5632,
      price: 178000,
      originalPrice: 220000,
      tags: ['AWS', 'DevOps'],
      isNew: false,
    },
    {
      id: 4,
      title: 'UI/UX 디자인 마스터클래스',
      instructor: '최디자인',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
      rating: 4.9,
      students: 7845,
      price: 143000,
      originalPrice: null,
      tags: ['Figma', 'Design'],
      isNew: true,
    },
  ]

  const categories = [
    { name: '개발 · 프로그래밍', count: 1243, icon: '💻' },
    { name: '데이터 사이언스', count: 456, icon: '📊' },
    { name: '인공지능', count: 328, icon: '🤖' },
    { name: '보안 · 네트워크', count: 187, icon: '🔒' },
    { name: '디자인', count: 534, icon: '🎨' },
    { name: '비즈니스', count: 421, icon: '💼' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white py-2 px-4 text-sm hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p>지금 가입하면 <span className="text-emerald-400 font-semibold">5,000 크레딧</span> 즉시 지급!</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300">기업교육</a>
              <a href="#" className="hover:text-gray-300">고객센터</a>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/designex/style-a" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">E-Class</span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-6">
                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
                    카테고리
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">강의</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">로드맵</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">멘토링</a>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">이벤트</a>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="배우고 싶은 기술을 검색해보세요"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Credits */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">C</span>
                </div>
                <span className="text-emerald-700 font-semibold text-sm">5,000</span>
              </div>

              <button className="hidden md:block text-gray-700 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="hidden md:flex items-center gap-2">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
                  로그인
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  회원가입
                </button>
              </div>

              {/* Mobile Menu */}
              <button
                className="lg:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                신규 강의 매주 업데이트
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                성장하는 개발자를 위한<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  실무 중심 학습
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                현직 개발자들이 직접 만든 실무 프로젝트 기반 강의로
                진짜 실력을 키워보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30">
                  무료로 시작하기
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-colors backdrop-blur">
                  강의 둘러보기
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-white">140만+</div>
                  <div className="text-gray-400">수강생</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">4,000+</div>
                  <div className="text-gray-400">강의</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-gray-400">만족도</div>
                </div>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl" />
              <div className="relative bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                      💻
                    </div>
                    <div>
                      <div className="text-white font-semibold">React 마스터</div>
                      <div className="text-gray-400 text-sm">진도율 78%</div>
                    </div>
                    <div className="ml-auto text-emerald-400 font-semibold">진행중</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <div>
                      <div className="text-white font-semibold">TypeScript 입문</div>
                      <div className="text-gray-400 text-sm">완료!</div>
                    </div>
                    <div className="ml-auto text-blue-400 font-semibold">수료증 발급</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl opacity-60">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
                      ☁️
                    </div>
                    <div>
                      <div className="text-white font-semibold">AWS 실전</div>
                      <div className="text-gray-400 text-sm">12개 강의</div>
                    </div>
                    <div className="ml-auto text-gray-400 font-semibold">시작하기</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">카테고리</h2>
              <p className="text-gray-500 mt-2">관심 분야를 선택하세요</p>
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              전체보기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <a
                key={i}
                href="#"
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">{cat.count}개 강의</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POPULAR COURSES ========== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">인기 강의</h2>
              <p className="text-gray-500 mt-2">수강생들이 가장 많이 선택한 강의</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">전체</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium">개발</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium">디자인</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium">비즈니스</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <a
                key={course.id}
                href="#"
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.isNew && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      NEW
                    </div>
                  )}
                  <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3">
                    {course.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{course.rating}</span>
                    </div>
                    <span className="text-gray-400">·</span>
                    <span className="text-sm text-gray-500">수강생 {course.students.toLocaleString()}명</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₩{course.price.toLocaleString()}
                    </span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₩{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors">
              더 많은 강의 보기
            </button>
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                지금 시작하면 5,000 크레딧 지급!
              </h2>
              <p className="text-white/80 text-lg">
                첫 강의를 무료로 수강하고 실력을 키워보세요.
              </p>
            </div>
            <button className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold text-lg transition-colors whitespace-nowrap shadow-lg">
              무료로 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold text-white">E-Class</span>
              </div>
              <p className="text-sm mb-4">
                성장하는 개발자를 위한<br />실무 중심 학습 플랫폼
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <span>📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <span>📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <span>🐦</span>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">강의</a></li>
                <li><a href="#" className="hover:text-white transition-colors">로드맵</a></li>
                <li><a href="#" className="hover:text-white transition-colors">멘토링</a></li>
                <li><a href="#" className="hover:text-white transition-colors">커뮤니티</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">고객지원</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-white transition-colors">1:1 문의</a></li>
                <li><a href="#" className="hover:text-white transition-colors">환불 정책</a></li>
                <li><a href="#" className="hover:text-white transition-colors">이용가이드</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">회사</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">회사 소개</a></li>
                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="#" className="hover:text-white transition-colors">블로그</a></li>
                <li><a href="#" className="hover:text-white transition-colors">제휴 문의</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">약관</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white transition-colors">저작권 정책</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div>
                <p>(주)한국SNS인재개발원 | 대표: 홍길동 | 사업자등록번호: 000-00-00000</p>
                <p className="mt-1">서울특별시 강남구 테헤란로 123 | 통신판매업신고: 제2024-서울강남-0000호</p>
              </div>
              <p>© 2024 E-Class. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Design List */}
      <Link
        href="/designex"
        className="fixed bottom-6 right-6 px-4 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        디자인 목록
      </Link>
    </div>
  )
}
