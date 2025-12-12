'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface RecentEnrollment {
  id: string
  created_at: string
  user: { email: string; name: string | null }
  course: { title: string }
}

interface RecentCourse {
  id: string
  title: string
  created_at: string
  is_published: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
  })
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([])
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 통계 데이터
      const [coursesRes, usersRes, enrollmentsRes, certificatesRes] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        totalCourses: coursesRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalEnrollments: enrollmentsRes.count || 0,
        totalCertificates: certificatesRes.count || 0,
      })

      // 최근 수강신청
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          created_at,
          user:profiles!enrollments_user_id_fkey(email, name),
          course:courses!enrollments_course_id_fkey(title)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (enrollments) {
        setRecentEnrollments(enrollments as unknown as RecentEnrollment[])
      }

      // 최근 강좌
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, created_at, is_published')
        .order('created_at', { ascending: false })
        .limit(5)

      if (courses) {
        setRecentCourses(courses)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    {
      title: '총 강좌',
      value: stats.totalCourses,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      href: '/admin/courses',
    },
    {
      title: '총 수강생',
      value: stats.totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      href: '/admin/students',
    },
    {
      title: '수강신청',
      value: stats.totalEnrollments,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      href: '/admin/students',
    },
    {
      title: '수료증 발급',
      value: stats.totalCertificates,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      href: '/admin/students',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-neutral-900 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <svg className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-2xl font-bold mb-1">{card.value.toLocaleString()}</p>
            <p className="text-sm text-white/50">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-neutral-900 border border-white/5 rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="font-semibold">최근 수강신청</h2>
            <Link href="/admin/students" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
              전체보기 →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentEnrollments.length > 0 ? (
              recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{enrollment.user?.name || enrollment.user?.email || '알 수 없음'}</p>
                      <p className="text-xs text-white/40 mt-0.5">{enrollment.course?.title}</p>
                    </div>
                    <span className="text-xs text-white/30">{formatDate(enrollment.created_at)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-white/40 text-sm">
                수강신청 내역이 없습니다
              </div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-neutral-900 border border-white/5 rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="font-semibold">최근 등록 강좌</h2>
            <Link href="/admin/courses" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
              전체보기 →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div key={course.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${course.is_published ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <div>
                        <p className="text-sm font-medium">{course.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {course.is_published ? '게시됨' : '비공개'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-white/30">{formatDate(course.created_at)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-white/40 text-sm">
                등록된 강좌가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900 border border-white/5 rounded-xl p-5">
        <h2 className="font-semibold mb-4">빠른 작업</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">강좌 추가</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm font-medium">카테고리</span>
          </Link>
          <Link
            href="/admin/students"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-medium">수강생 관리</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium">사이트 보기</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
