'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/supabase'

export default function TestDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    const user = await auth.getUser()
    setIsLoggedIn(!!user)
    setUserEmail(user?.email || '로그인 안 됨')
  }

  const pages = [
    { 
      category: '🔐 인증 페이지',
      items: [
        { name: '메인 페이지', path: '/', needsAuth: false },
        { name: '로그인', path: '/login', needsAuth: false },
        { name: '회원가입', path: '/register', needsAuth: false },
      ]
    },
    {
      category: '📚 메인 페이지 (로그인 필요)',
      items: [
        { name: '강의 목록', path: '/courses', needsAuth: true },
        { name: '마이페이지', path: '/mypage', needsAuth: true },
        { name: '시험 (예시)', path: '/exam/test-id', needsAuth: true },
        { name: '수료증 (예시)', path: '/certificate/test-id', needsAuth: true },
      ]
    },
    {
      category: '🧪 테스트 페이지',
      items: [
        { name: 'Supabase 연결 테스트', path: '/test-connection', needsAuth: false },
        { name: '이 대시보드', path: '/test-dashboard', needsAuth: false },
      ]
    }
  ]

  const handleTestLogin = async () => {
    // 테스트용 자동 로그인 (실제 이메일/비밀번호 사용)
    const { error } = await auth.signIn('test@example.com', 'test123')
    if (error) {
      alert('테스트 계정으로 로그인 실패: ' + error.message)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">🎯 E-Class 페이지 점검 대시보드</h1>
          
          {/* 현재 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isLoggedIn ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} border`}>
              <p className="font-semibold">로그인 상태</p>
              <p className="text-sm">{isLoggedIn ? '✅ 로그인됨' : '❌ 로그아웃됨'}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
              <p className="font-semibold">현재 사용자</p>
              <p className="text-sm truncate">{userEmail}</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
              <p className="font-semibold">환경</p>
              <p className="text-sm">개발 모드 (localhost:3000)</p>
            </div>
          </div>

          {/* 빠른 작업 */}
          <div className="flex gap-2 mb-6">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  로그인 페이지로
                </Link>
                <button onClick={handleTestLogin} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                  테스트 계정 로그인
                </button>
              </>
            ) : (
              <button 
                onClick={() => auth.signOut().then(() => window.location.reload())}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>

        {/* 페이지 목록 */}
        {pages.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((page) => (
                <div
                  key={page.path}
                  className={`border rounded-lg p-4 ${
                    page.needsAuth && !isLoggedIn 
                      ? 'bg-gray-50 border-gray-300' 
                      : 'hover:bg-blue-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{page.name}</h3>
                      <p className="text-xs text-gray-500 font-mono">{page.path}</p>
                      {page.needsAuth && (
                        <span className="text-xs text-orange-600">🔒 로그인 필요</span>
                      )}
                    </div>
                    <Link
                      href={page.path}
                      target="_blank"
                      className={`px-3 py-1 rounded text-sm ${
                        page.needsAuth && !isLoggedIn
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      onClick={(e) => {
                        if (page.needsAuth && !isLoggedIn) {
                          e.preventDefault()
                          alert('이 페이지는 로그인이 필요합니다!')
                        }
                      }}
                    >
                      열기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 체크리스트 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">✅ 기능 체크리스트</h2>
          <div className="space-y-2">
            {[
              '회원가입 작동 확인',
              '로그인/로그아웃 작동 확인',
              '네비게이션 바 표시 확인',
              '페이지 이동 확인',
              '모바일 반응형 확인',
              'Supabase 연결 확인'
            ].map((item, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}