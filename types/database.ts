// Supabase Database Types for E-Class Platform
// 실제 스키마 기반으로 정의

export type UserRole = 'student' | 'instructor' | 'admin'
export type BannerType = 'banner' | 'popup'
export type TransactionType = 'charge' | 'purchase' | 'refund' | 'bonus'

// ========== 기본 테이블 타입 ==========

export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: UserRole
  credits: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  instructor_id: string | null
  instructor_name: string | null
  category_id: string | null
  price: number
  sale_price: number | null
  duration_minutes: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  course_id: string
  title: string
  order_index: number
  created_at: string
}

export interface Lesson {
  id: string
  chapter_id: string
  course_id: string
  title: string
  video_url: string | null
  duration_seconds: number
  order_index: number
  is_preview: boolean
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  watched_seconds: number
  completed: boolean
  completed_at: string | null
  updated_at: string
}

export interface Exam {
  id: string
  course_id: string
  title: string
  pass_score: number
  time_limit_minutes: number | null
  created_at: string
}

export interface ExamQuestion {
  id: string
  exam_id: string
  question: string
  options: string[]
  correct_answer: number
  order_index: number
}

export interface ExamResult {
  id: string
  user_id: string
  exam_id: string
  score: number
  passed: boolean
  answers: Record<string, number>
  taken_at: string
}

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  exam_result_id: string | null
  certificate_number: string
  issued_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  description: string | null
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: unknown
  updated_at: string
}

export interface Banner {
  id: string
  title: string
  image_url: string
  link_url: string | null
  type: BannerType
  is_active: boolean
  start_date: string | null
  end_date: string | null
  order_index: number
  created_at: string
}

// ========== 확장 타입 (관계 포함) ==========

export interface CourseWithCategory extends Course {
  category: Category | null
}

export interface CourseWithDetails extends Course {
  category: Category | null
  chapters: ChapterWithLessons[]
}

export interface ChapterWithLessons extends Chapter {
  lessons: Lesson[]
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course
}

export interface ExamWithQuestions extends Exam {
  questions: ExamQuestion[]
}

export interface ExamResultWithExam extends ExamResult {
  exam: Exam & { course: Course }
}

// ========== API 응답 타입 ==========

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// ========== 폼 입력 타입 ==========

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface ProfileUpdateInput {
  name?: string
  avatar_url?: string
}

export interface CourseFilterInput {
  category_id?: string
  min_price?: number
  max_price?: number
  search?: string
  sort_by?: 'newest' | 'popular' | 'price_low' | 'price_high'
}

export interface ExamSubmitInput {
  exam_id: string
  answers: Record<string, number>
}
