'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Course, Category } from '@/types/database'

type CourseWithCategory = Course & { category: Category | null }

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseWithCategory | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    instructor_name: '',
    price: 0,
    sale_price: 0,
    thumbnail_url: '',
    is_published: true,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        supabase
          .from('courses')
          .select('*, category:categories(*)')
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ])

      if (coursesRes.data) setCourses(coursesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (course?: CourseWithCategory) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        title: course.title,
        description: course.description || '',
        category_id: course.category_id || '',
        instructor_name: course.instructor_name || '',
        price: course.price,
        sale_price: course.sale_price || 0,
        thumbnail_url: course.thumbnail_url || '',
        is_published: course.is_published,
      })
    } else {
      setEditingCourse(null)
      setFormData({
        title: '',
        description: '',
        category_id: '',
        instructor_name: '',
        price: 0,
        sale_price: 0,
        thumbnail_url: '',
        is_published: true,
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      category_id: formData.category_id || null,
      sale_price: formData.sale_price || null,
    }

    if (editingCourse) {
      const { error } = await supabase
        .from('courses')
        .update(data)
        .eq('id', editingCourse.id)

      if (error) {
        alert('수정 실패: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase.from('courses').insert([data])

      if (error) {
        alert('추가 실패: ' + error.message)
        return
      }
    }

    setShowModal(false)
    fetchData()
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까? 관련된 챕터, 레슨, 수강 기록도 함께 삭제됩니다.')) return

    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) {
      alert('삭제 실패: ' + error.message)
      return
    }

    fetchData()
  }

  const togglePublish = async (course: CourseWithCategory) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id)

    if (!error) {
      fetchData()
    }
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
          <h1 className="text-2xl font-bold">강좌 관리</h1>
          <p className="text-sm text-white/50 mt-1">총 {courses.length}개의 강좌</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          새 강좌 추가
        </button>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">강좌</th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">카테고리</th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">가격</th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">상태</th>
              <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-5 py-4">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">{course.instructor_name || '강사 미지정'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-white/70">{course.category?.name || '-'}</span>
                  </td>
                  <td className="px-5 py-4">
                    {course.price > 0 ? (
                      <div>
                        {course.sale_price && course.sale_price < course.price ? (
                          <>
                            <p className="font-medium">₩{course.sale_price.toLocaleString()}</p>
                            <p className="text-xs text-white/30 line-through">₩{course.price.toLocaleString()}</p>
                          </>
                        ) : (
                          <p className="font-medium">₩{course.price.toLocaleString()}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-orange-400 text-sm">무료</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => togglePublish(course)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        course.is_published
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${course.is_published ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      {course.is_published ? '게시됨' : '비공개'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="커리큘럼 관리"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => openModal(course)}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="수정"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-white/40">
                  등록된 강좌가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold">
                {editingCourse ? '강좌 수정' : '새 강좌 추가'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">강좌명 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">카테고리</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                  >
                    <option value="">선택 안함</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">강사명</label>
                  <input
                    type="text"
                    value={formData.instructor_name}
                    onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">정가 (원)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">할인가 (원)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">썸네일 URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="is_published" className="text-sm text-white/70">게시 (체크 해제 시 비공개)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  {editingCourse ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
