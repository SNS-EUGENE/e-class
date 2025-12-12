import { createClient } from '@supabase/supabase-js'
import type {
  Profile,
  Course,
  Category,
  Chapter,
  Lesson,
  Enrollment,
  Progress,
  Exam,
  ExamQuestion,
  ExamResult,
  Certificate,
  CreditTransaction,
  Banner,
  ChapterWithLessons
} from '@/types/database'

// 환경변수 문제 해결을 위해 직접 지정
const supabaseUrl = 'https://tszzbhrbpskojauczhxm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenpiaHJicHNrb2phdWN6aHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODY3NTIsImV4cCI6MjA4MTA2Mjc1Mn0.07S83JGMLQ8aX0PRJIErNTKgRVv3f6JbsvhJV76tUsc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========== Auth 헬퍼 함수들 ==========
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}

// ========== 프로필 관련 함수 ==========
export const profiles = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data: data as Profile | null, error }
  },

  update: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data: data as Profile | null, error }
  }
}

// ========== 카테고리 관련 함수 ==========
export const categories = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    return { data: data as Category[] | null, error }
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()
    return { data: data as Category | null, error }
  }
}

// ========== 코스 관련 함수 ==========
export const courses = {
  getAll: async (options?: {
    categoryId?: string
    published?: boolean
    limit?: number
    offset?: number
  }) => {
    let query = supabase
      .from('courses')
      .select(`
        *,
        category:categories(*)
      `, { count: 'exact' })

    if (options?.published !== false) {
      query = query.eq('is_published', true)
    }
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options?.limit ?? 10) - 1)
    }

    const { data, error, count } = await query.order('created_at', { ascending: false })
    return { data: data as (Course & { category: Category })[] | null, error, count }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()
    return { data: data as (Course & { category: Category }) | null, error }
  },

  getWithChapters: async (id: string) => {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()

    if (courseError) return { data: null, error: courseError }

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select(`
        *,
        lessons(*)
      `)
      .eq('course_id', id)
      .order('order_index')

    if (chaptersError) return { data: null, error: chaptersError }

    // 각 챕터의 레슨을 order_index로 정렬
    const sortedChapters = chapters?.map(chapter => ({
      ...chapter,
      lessons: chapter.lessons?.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
    }))

    return {
      data: {
        ...course,
        chapters: sortedChapters as ChapterWithLessons[]
      },
      error: null
    }
  }
}

// ========== 챕터/레슨 관련 함수 ==========
export const chapters = {
  getByCourseId: async (courseId: string) => {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        lessons(*)
      `)
      .eq('course_id', courseId)
      .order('order_index')
    return { data: data as ChapterWithLessons[] | null, error }
  }
}

export const lessons = {
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        chapter:chapters(*)
      `)
      .eq('id', id)
      .single()
    return { data: data as (Lesson & { chapter: Chapter }) | null, error }
  },

  getByCourseId: async (courseId: string) => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index')
    return { data: data as Lesson[] | null, error }
  }
}

// ========== 수강 관련 함수 ==========
export const enrollments = {
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*, category:categories(*))
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })
    return { data: data as (Enrollment & { course: Course & { category: Category } })[] | null, error }
  },

  check: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()
    return { data: data as Enrollment | null, error, enrolled: !!data }
  },

  create: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single()
    return { data: data as Enrollment | null, error }
  }
}

// ========== 학습 진도 관련 함수 ==========
export const progress = {
  getByUserAndCourse: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
    return { data: data as Progress[] | null, error }
  },

  upsert: async (progressData: {
    user_id: string
    lesson_id: string
    course_id: string
    watched_seconds?: number
    completed?: boolean
  }) => {
    const { data, error } = await supabase
      .from('progress')
      .upsert({
        ...progressData,
        updated_at: new Date().toISOString(),
        ...(progressData.completed ? { completed_at: new Date().toISOString() } : {})
      })
      .select()
      .single()
    return { data: data as Progress | null, error }
  }
}

// ========== 시험 관련 함수 ==========
export const exams = {
  getByCourseId: async (courseId: string) => {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('course_id', courseId)
    return { data: data as Exam[] | null, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        questions:exam_questions(*)
      `)
      .eq('id', id)
      .single()

    // 문제를 order_index로 정렬
    if (data?.questions) {
      data.questions.sort((a: ExamQuestion, b: ExamQuestion) => a.order_index - b.order_index)
    }

    return { data: data as (Exam & { questions: ExamQuestion[] }) | null, error }
  },

  submitResult: async (result: Omit<ExamResult, 'id' | 'taken_at'>) => {
    const { data, error } = await supabase
      .from('exam_results')
      .insert(result)
      .select()
      .single()
    return { data: data as ExamResult | null, error }
  },

  getResults: async (userId: string, examId?: string) => {
    let query = supabase
      .from('exam_results')
      .select(`
        *,
        exam:exams(*, course:courses(*))
      `)
      .eq('user_id', userId)
      .order('taken_at', { ascending: false })

    if (examId) {
      query = query.eq('exam_id', examId)
    }

    const { data, error } = await query
    return { data: data as (ExamResult & { exam: Exam & { course: Course } })[] | null, error }
  }
}

// ========== 수료증 관련 함수 ==========
export const certificates = {
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })
    return { data: data as (Certificate & { course: Course })[] | null, error }
  },

  create: async (userId: string, courseId: string, examResultId?: string) => {
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        exam_result_id: examResultId,
        certificate_number: certificateNumber
      })
      .select()
      .single()
    return { data: data as Certificate | null, error }
  }
}

// ========== 크레딧 관련 함수 ==========
export const credits = {
  getHistory: async (userId: string, limit = 20) => {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data: data as CreditTransaction[] | null, error }
  },

  addTransaction: async (transaction: Omit<CreditTransaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('credit_transactions')
      .insert(transaction)
      .select()
      .single()
    return { data: data as CreditTransaction | null, error }
  }
}

// ========== 배너 관련 함수 ==========
export const banners = {
  getActive: async (type?: 'banner' | 'popup') => {
    let query = supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('order_index')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    return { data: data as Banner[] | null, error }
  }
}

// ========== 사이트 설정 관련 함수 ==========
export const siteSettings = {
  get: async (key: string) => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()
    return { data: data?.value, error }
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    // key-value 객체로 변환
    const settings: Record<string, unknown> = {}
    data?.forEach(item => {
      settings[item.key] = item.value
    })

    return { data: settings, error }
  }
}
