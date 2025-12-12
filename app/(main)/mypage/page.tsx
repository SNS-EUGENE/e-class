'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'

interface Course {
  id: string
  title: string
  instructor: string
  thumbnail: string
  progress: number
  completed: boolean
}

interface Certificate {
  id: string
  title: string
  issuedDate: string
  courseId: string
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'learning' | 'completed' | 'certificates' | 'settings'>('learning')

  // 샘플 데이터
  const learningCourses: Course[] = [
    {
      id: '1',
      title: '현직 개발자와 함께하는 React 실전 프로젝트',
      instructor: '김개발',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      progress: 65,
      completed: false,
    },
    {
      id: '2',
      title: '브랜딩부터 UX까지, 디자이너의 실무 노하우',
      instructor: '이디자인',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop',
      progress: 30,
      completed: false,
    },
  ]

  const completedCourses: Course[] = [
    {
      id: '3',
      title: 'JavaScript 완벽 가이드',
      instructor: '박자바스크립트',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
      progress: 100,
      completed: true,
    },
  ]

  const certificates: Certificate[] = [
    {
      id: '1',
      title: 'JavaScript 완벽 가이드 수료증',
      issuedDate: '2024-12-01',
      courseId: '3',
    },
  ]

  const user = {
    name: '홍길동',
    email: 'user@example.com',
    avatar: null,
    credits: 15000,
    joinDate: '2024-01-15',
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="pt-24 pb-20 px-5">
        <div className="max-w-screen-xl mx-auto">
          {/* Profile Section */}
          <div className="bg-neutral-900 rounded-2xl p-8 border border-white/5 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0)}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-white/50 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white/50">크레딧</span>
                    <span className="text-orange-400 font-semibold">₩{user.credits.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/50">가입일</span>
                    <span>{user.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-sm font-medium rounded-xl transition-colors"
                >
                  크레딧 충전
                </Link>
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-sm font-medium rounded-xl transition-colors border border-white/10">
                  프로필 수정
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-900 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-white/40 mb-1">수강 중</p>
              <p className="text-2xl font-bold">{learningCourses.length}</p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-white/40 mb-1">수료 완료</p>
              <p className="text-2xl font-bold text-green-400">{completedCourses.length}</p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-white/40 mb-1">자격증</p>
              <p className="text-2xl font-bold text-orange-400">{certificates.length}</p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-white/40 mb-1">총 학습 시간</p>
              <p className="text-2xl font-bold">42h</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 mb-8">
            <div className="flex gap-8">
              {[
                { id: 'learning', label: '학습 중', count: learningCourses.length },
                { id: 'completed', label: '수료 완료', count: completedCourses.length },
                { id: 'certificates', label: '자격증', count: certificates.length },
                { id: 'settings', label: '설정', count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-white'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'learning' && (
            <div className="space-y-4">
              {learningCourses.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-white/40 mb-4">아직 수강 중인 클래스가 없습니다</p>
                  <Link
                    href="/courses"
                    className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-400 text-sm font-medium rounded-xl transition-colors"
                  >
                    클래스 둘러보기
                  </Link>
                </div>
              ) : (
                learningCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}/learn`}
                    className="flex gap-6 p-4 bg-neutral-900 rounded-xl border border-white/5 hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="w-40 h-24 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 mb-1">{course.instructor}</p>
                      <h3 className="font-medium mb-2 group-hover:text-orange-400 transition-colors truncate">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-orange-400 font-medium">{course.progress}%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-2 bg-orange-500/10 text-orange-400 text-sm font-medium rounded-lg">
                        이어서 학습
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedCourses.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-white/40">수료한 클래스가 없습니다</p>
                </div>
              ) : (
                completedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex gap-6 p-4 bg-neutral-900 rounded-xl border border-white/5"
                  >
                    <div className="w-40 h-24 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 mb-1">{course.instructor}</p>
                      <h3 className="font-medium mb-2 truncate">{course.title}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        수료 완료
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-sm rounded-lg transition-colors"
                      >
                        다시 보기
                      </Link>
                      <Link
                        href={`/exam/${course.id}`}
                        className="px-4 py-2 bg-orange-500/10 text-orange-400 text-sm rounded-lg hover:bg-orange-500/20 transition-colors"
                      >
                        시험 응시
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.length === 0 ? (
                <div className="col-span-2 text-center py-20">
                  <p className="text-white/40">획득한 자격증이 없습니다</p>
                </div>
              ) : (
                certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gradient-to-br from-orange-500/10 to-neutral-900 rounded-2xl p-6 border border-orange-500/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <span className="text-xs text-white/40">{cert.issuedDate}</span>
                    </div>
                    <h3 className="font-semibold mb-4">{cert.title}</h3>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-sm rounded-lg transition-colors">
                        보기
                      </button>
                      <button className="flex-1 py-2 bg-orange-500 hover:bg-orange-400 text-sm rounded-lg transition-colors">
                        다운로드
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold mb-4">프로필 설정</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/50 mb-2">이름</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-2">이메일</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold mb-4">알림 설정</h3>
                  <div className="space-y-4">
                    {[
                      { label: '이메일 알림', description: '새 강의, 이벤트 소식을 이메일로 받습니다' },
                      { label: '마케팅 수신 동의', description: '할인 및 프로모션 정보를 받습니다' },
                    ].map((setting, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{setting.label}</p>
                          <p className="text-sm text-white/40">{setting.description}</p>
                        </div>
                        <button className="w-12 h-6 bg-orange-500 rounded-full relative">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold mb-4">계정</h3>
                  <div className="space-y-3">
                    <button className="w-full py-3 text-left text-white/70 hover:text-white transition-colors">
                      비밀번호 변경
                    </button>
                    <button className="w-full py-3 text-left text-red-400 hover:text-red-300 transition-colors">
                      로그아웃
                    </button>
                    <button className="w-full py-3 text-left text-white/30 hover:text-red-400 transition-colors">
                      회원 탈퇴
                    </button>
                  </div>
                </div>

                <button className="w-full py-4 bg-orange-500 hover:bg-orange-400 font-semibold rounded-xl transition-colors">
                  변경사항 저장
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
