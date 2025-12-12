'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'
import {
  enrollments as enrollmentsApi,
  progress as progressApi,
  certificates as certificatesApi,
  profiles as profilesApi,
  courses as coursesApi
} from '@/lib/supabase'
import type { Enrollment, Course, Category, Certificate, ChapterWithLessons } from '@/types/database'

interface EnrollmentWithProgress extends Enrollment {
  course: Course & { category: Category }
  progressPercent: number
  completedLessons: number
  totalLessons: number
}

interface CertificateWithCourse extends Certificate {
  course: Course
}

export default function MyPage() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading, signOut, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<'learning' | 'completed' | 'certificates' | 'settings'>('learning')

  const [enrollmentData, setEnrollmentData] = useState<EnrollmentWithProgress[]>([])
  const [certificateData, setCertificateData] = useState<CertificateWithCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Settings form state
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const loadData = useCallback(async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 수강 목록 가져오기
      const { data: enrollments } = await enrollmentsApi.getByUserId(user.id)

      if (enrollments && enrollments.length > 0) {
        // 각 수강의 진도율 계산
        const enrollmentsWithProgress: EnrollmentWithProgress[] = await Promise.all(
          enrollments.map(async (enrollment) => {
            // 코스의 챕터/레슨 가져오기
            const { data: courseData } = await coursesApi.getWithChapters(enrollment.course_id)
            const chapters = (courseData?.chapters || []) as ChapterWithLessons[]
            const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)

            // 진도 데이터 가져오기
            const { data: progressData } = await progressApi.getByUserAndCourse(user.id, enrollment.course_id)
            const completedLessons = progressData?.filter(p => p.completed).length || 0
            const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

            return {
              ...enrollment,
              progressPercent,
              completedLessons,
              totalLessons
            }
          })
        )
        setEnrollmentData(enrollmentsWithProgress)
      } else {
        setEnrollmentData([])
      }

      // 수료증 가져오기
      const { data: certs } = await certificatesApi.getByUserId(user.id)
      setCertificateData(certs || [])
    } catch (error) {
      console.error('Error loading mypage data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      loadData()
      setEditName(profile?.name || '')
    }
  }, [user, authLoading, router, loadData, profile])

  const learningCourses = enrollmentData.filter(e => e.progressPercent < 100)
  const completedCourses = enrollmentData.filter(e => e.progressPercent >= 100)

  // 총 학습 시간 계산 (예시 - 실제로는 progress 테이블의 watched_seconds 합산)
  const totalWatchedHours = Math.round(
    enrollmentData.reduce((sum, e) => sum + (e.completedLessons * 15), 0) / 60
  ) // 레슨당 평균 15분으로 가정

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) return
    setSaving(true)
    setSaveMessage('')

    try {
      const { error } = await profilesApi.update(user.id, { name: editName.trim() })
      if (error) throw error
      await refreshProfile()
      setSaveMessage('프로필이 저장되었습니다.')
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveMessage('저장에 실패했습니다.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
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
                {profile.name?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{profile.name || '이름 없음'}</h1>
                <p className="text-white/50 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white/50">크레딧</span>
                    <span className="text-orange-400 font-semibold">₩{(profile.credits || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/50">가입일</span>
                    <span>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('ko-KR') : '-'}</span>
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
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-sm font-medium rounded-xl transition-colors border border-white/10"
                >
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
              <p className="text-sm text-white/40 mb-1">수료증</p>
              <p className="text-2xl font-bold text-orange-400">{certificateData.length}</p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-white/40 mb-1">총 학습 시간</p>
              <p className="text-2xl font-bold">{totalWatchedHours}h</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 mb-8">
            <div className="flex gap-8">
              {[
                { id: 'learning', label: '학습 중', count: learningCourses.length },
                { id: 'completed', label: '수료 완료', count: completedCourses.length },
                { id: 'certificates', label: '수료증', count: certificateData.length },
                { id: 'settings', label: '설정', count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
                learningCourses.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${enrollment.course_id}/learn`}
                    className="flex gap-6 p-4 bg-neutral-900 rounded-xl border border-white/5 hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="w-40 h-24 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      <img
                        src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 mb-1">{enrollment.course.category?.name || '온라인 클래스'}</p>
                      <h3 className="font-medium mb-2 group-hover:text-orange-400 transition-colors truncate">
                        {enrollment.course.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${enrollment.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-sm text-orange-400 font-medium">{enrollment.progressPercent}%</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        {enrollment.completedLessons}/{enrollment.totalLessons} 레슨 완료
                      </p>
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
                completedCourses.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex gap-6 p-4 bg-neutral-900 rounded-xl border border-white/5"
                  >
                    <div className="w-40 h-24 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 relative">
                      <img
                        src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 mb-1">{enrollment.course.category?.name || '온라인 클래스'}</p>
                      <h3 className="font-medium mb-2 truncate">{enrollment.course.title}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        수료 완료
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${enrollment.course_id}`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-sm rounded-lg transition-colors"
                      >
                        다시 보기
                      </Link>
                      <Link
                        href={`/exam/${enrollment.course_id}`}
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
              {certificateData.length === 0 ? (
                <div className="col-span-2 text-center py-20">
                  <p className="text-white/40 mb-2">획득한 수료증이 없습니다</p>
                  <p className="text-white/30 text-sm">코스를 수료하고 시험에 통과하면 수료증이 발급됩니다</p>
                </div>
              ) : (
                certificateData.map((cert) => (
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
                      <span className="text-xs text-white/40">
                        {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('ko-KR') : '-'}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{cert.course?.title} 수료증</h3>
                    <p className="text-xs text-white/40 mb-4">No. {cert.certificate_number}</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/certificate/${cert.id}`}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-sm rounded-lg transition-colors text-center"
                      >
                        보기
                      </Link>
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
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-2">이메일</label>
                      <input
                        type="email"
                        value={user.email || ''}
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
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 text-left text-red-400 hover:text-red-300 transition-colors"
                    >
                      로그아웃
                    </button>
                    <button className="w-full py-3 text-left text-white/30 hover:text-red-400 transition-colors">
                      회원 탈퇴
                    </button>
                  </div>
                </div>

                {saveMessage && (
                  <div className={`p-4 rounded-xl text-center ${
                    saveMessage.includes('실패') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {saveMessage}
                  </div>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 font-semibold rounded-xl transition-colors"
                >
                  {saving ? '저장 중...' : '변경사항 저장'}
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
