'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-screen-xl mx-auto px-5">
        <div className="flex items-center justify-between h-16 relative">
          <Link href="/" className="text-xl font-semibold tracking-tight text-white">
            eclass
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-base font-semibold text-white/70 hover:text-white transition-colors">
              클래스
            </Link>
            <Link href="/instructors" className="text-base font-semibold text-white/70 hover:text-white transition-colors">
              크리에이터
            </Link>
            <Link href="#" className="text-base font-semibold text-white/70 hover:text-white transition-colors">
              커뮤니티
            </Link>
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

            <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
              로그인
            </Link>
            <Link href="/register" className="text-sm px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors">
              시작하기
            </Link>
          </div>

          {/* 확장 검색바 */}
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
  )
}
