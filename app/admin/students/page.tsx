'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Student {
  id: string
  email: string
  name: string | null
  created_at: string
  enrollments: {
    id: string
    course: { id: string; title: string }
    created_at: string
    completed_at: string | null
  }[]
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          name,
          created_at,
          enrollments(
            id,
            created_at,
            completed_at,
            course:courses(id, title)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setStudents(data as unknown as Student[])
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">수강생 관리</h1>
          <p className="text-sm text-white/50 mt-1">총 {students.length}명의 수강생</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="이름 또는 이메일 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors text-sm"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">수강생</th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">가입일</th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">수강 중</th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">수료</th>
              <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const inProgress = student.enrollments?.filter((e) => !e.completed_at).length || 0
                const completed = student.enrollments?.filter((e) => e.completed_at).length || 0

                return (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-medium">
                          {(student.name?.[0] || student.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{student.name || '이름 없음'}</p>
                          <p className="text-xs text-white/40">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-white/70">{formatDate(student.created_at)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        {inProgress}개
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                        {completed}개
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="상세 보기"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-white/40">
                  {searchTerm ? '검색 결과가 없습니다' : '등록된 수강생이 없습니다'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold">수강생 상세</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xl font-medium">
                  {(selectedStudent.name?.[0] || selectedStudent.email[0]).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name || '이름 없음'}</h3>
                  <p className="text-sm text-white/50">{selectedStudent.email}</p>
                  <p className="text-xs text-white/30 mt-1">가입일: {formatDate(selectedStudent.created_at)}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-400">
                    {selectedStudent.enrollments?.filter((e) => !e.completed_at).length || 0}
                  </p>
                  <p className="text-xs text-white/50 mt-1">수강 중</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-400">
                    {selectedStudent.enrollments?.filter((e) => e.completed_at).length || 0}
                  </p>
                  <p className="text-xs text-white/50 mt-1">수료 완료</p>
                </div>
              </div>

              {/* Enrollments */}
              <h4 className="text-sm font-medium text-white/70 mb-3">수강 내역</h4>
              <div className="space-y-2">
                {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 ? (
                  selectedStudent.enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{enrollment.course?.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          수강 시작: {formatDate(enrollment.created_at)}
                        </p>
                      </div>
                      {enrollment.completed_at ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          수료
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                          수강 중
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/40 text-center py-4">수강 내역이 없습니다</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
