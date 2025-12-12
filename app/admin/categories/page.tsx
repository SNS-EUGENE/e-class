'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'

interface CategoryWithCount extends Category {
  course_count: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // 카테고리와 강좌 수 가져오기
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (catError) throw catError

      // 각 카테고리별 강좌 수 계산
      const categoriesWithCount: CategoryWithCount[] = []
      for (const cat of categoriesData || []) {
        const { count } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)

        categoriesWithCount.push({
          ...cat,
          course_count: count || 0,
        })
      }

      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', editingCategory.id)

      if (error) {
        alert('수정 실패: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase.from('categories').insert([formData])

      if (error) {
        alert('추가 실패: ' + error.message)
        return
      }
    }

    setShowModal(false)
    fetchCategories()
  }

  const deleteCategory = async (id: string, courseCount: number) => {
    if (courseCount > 0) {
      alert('이 카테고리에 속한 강좌가 있어 삭제할 수 없습니다. 먼저 강좌를 다른 카테고리로 이동하거나 삭제해주세요.')
      return
    }

    if (!confirm('정말 삭제하시겠습니까?')) return

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      alert('삭제 실패: ' + error.message)
      return
    }

    fetchCategories()
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
          <h1 className="text-2xl font-bold">카테고리 관리</h1>
          <p className="text-sm text-white/50 mt-1">총 {categories.length}개의 카테고리</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          새 카테고리 추가
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-neutral-900 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(category)}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id, category.course_count)}
                    className={`p-1.5 rounded transition-colors ${
                      category.course_count > 0
                        ? 'text-white/20 cursor-not-allowed'
                        : 'text-white/40 hover:text-red-400 hover:bg-red-500/10'
                    }`}
                    disabled={category.course_count > 0}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-white/40 mb-3 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-white/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {category.course_count}개 강좌
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-neutral-900 border border-white/5 rounded-xl p-12 text-center">
            <p className="text-white/40">등록된 카테고리가 없습니다</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              첫 카테고리 추가하기 →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold">
                {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
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
                <label className="block text-sm font-medium text-white/70 mb-2">카테고리명 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 프로그래밍"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="카테고리에 대한 간단한 설명"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
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
                  {editingCategory ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
