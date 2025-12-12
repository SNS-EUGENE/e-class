'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalCompletions: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 강의 수
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

      // 사용자 수
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // 완료된 강의 수
      const { count: completionCount } = await supabase
        .from('course_progress')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true)

      setStats({
        totalCourses: courseCount || 0,
        totalUsers: userCount || 0,
        totalCompletions: completionCount || 0
      })
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
          <div className="text-gray-600">총 강의 수</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.totalUsers}</div>
          <div className="text-gray-600">총 사용자 수</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.totalCompletions}</div>
          <div className="text-gray-600">강의 수료 횟수</div>
        </div>
      </div>
    </div>
  )
}