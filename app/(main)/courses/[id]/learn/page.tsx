'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { courses as coursesApi, progress as progressApi, enrollments as enrollmentsApi, exams as examsApi } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/layout'
import type { Course, Category, ChapterWithLessons, Lesson, Progress } from '@/types/database'

const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-neutral-900 animate-pulse flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

type CourseWithDetails = Course & {
  category: Category | null
  chapters?: ChapterWithLessons[]
}

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [course, setCourse] = useState<CourseWithDetails | null>(null)
  const [progressData, setProgressData] = useState<Progress[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [watchedSeconds, setWatchedSeconds] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hasExam, setHasExam] = useState(false)
  const playerRef = useRef<HTMLVideoElement>(null)
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && params.id) {
      checkEnrollmentAndFetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, params.id])

  const checkEnrollmentAndFetch = async () => {
    try {
      const { enrolled } = await enrollmentsApi.check(user!.id, params.id as string)
      if (!enrolled) {
        router.push(`/courses/${params.id}`)
        return
      }

      await fetchCourseAndProgress()
      await checkExam()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseAndProgress = async () => {
    try {
      const [courseResult, progressResult] = await Promise.all([
        coursesApi.getWithChapters(params.id as string),
        progressApi.getByUserAndCourse(user!.id, params.id as string)
      ])

      if (courseResult.data) {
        setCourse(courseResult.data)

        if (progressResult.data) {
          setProgressData(progressResult.data)
        }

        // 첫 번째 미완료 레슨 선택
        const allLessons = courseResult.data.chapters?.flatMap(ch => ch.lessons) || []
        const completedLessonIds = new Set(progressResult.data?.filter(p => p.completed).map(p => p.lesson_id) || [])
        const firstIncomplete = allLessons.find(l => !completedLessonIds.has(l.id)) || allLessons[0]

        if (firstIncomplete) {
          setCurrentLesson(firstIncomplete)
          // 이전에 시청한 시간 복원
          const lessonProgress = progressResult.data?.find(p => p.lesson_id === firstIncomplete.id)
          if (lessonProgress) {
            setWatchedSeconds(lessonProgress.watched_seconds)
          }
        }

        // 전체 진도 계산
        calculateOverallProgress(allLessons, progressResult.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const checkExam = async () => {
    try {
      const { data } = await examsApi.getByCourseId(params.id as string)
      setHasExam(data && data.length > 0)
    } catch (error) {
      console.error('Error checking exam:', error)
    }
  }

  const calculateOverallProgress = (lessons: Lesson[], progress: Progress[]) => {
    if (lessons.length === 0) {
      setOverallProgress(0)
      return
    }
    const completedCount = progress.filter(p => p.completed).length
    setOverallProgress(Math.round((completedCount / lessons.length) * 100))
  }

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progressData.some(p => p.lesson_id === lessonId && p.completed)
  }, [progressData])

  const saveProgress = useCallback(async (completed = false) => {
    if (!user || !currentLesson || !course) return

    try {
      const { data } = await progressApi.upsert({
        user_id: user.id,
        lesson_id: currentLesson.id,
        course_id: course.id,
        watched_seconds: watchedSeconds,
        completed,
      })

      if (data) {
        setProgressData(prev => {
          const existing = prev.findIndex(p => p.lesson_id === currentLesson.id)
          if (existing >= 0) {
            const newData = [...prev]
            newData[existing] = data
            return newData
          }
          return [...prev, data]
        })

        if (completed) {
          const allLessons = course.chapters?.flatMap(ch => ch.lessons) || []
          const newProgressData = progressData.map(p =>
            p.lesson_id === currentLesson.id ? { ...p, completed: true } : p
          )
          if (!progressData.some(p => p.lesson_id === currentLesson.id)) {
            newProgressData.push(data)
          }
          calculateOverallProgress(allLessons, newProgressData)
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }, [user, currentLesson, course, watchedSeconds, progressData])

  // 주기적으로 진도 저장 (30초마다)
  useEffect(() => {
    if (isPlaying && currentLesson) {
      saveIntervalRef.current = setInterval(() => {
        saveProgress(false)
      }, 30000)
    }

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
    }
  }, [isPlaying, currentLesson, saveProgress])

  // 페이지 떠날 때 진도 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress(false)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      saveProgress(false)
    }
  }, [saveProgress])

  const handleLessonComplete = async () => {
    if (!currentLesson || !course) return

    await saveProgress(true)

    // 다음 레슨으로 이동
    const allLessons = course.chapters?.flatMap(ch => ch.lessons) || []
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)

    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1]
      setCurrentLesson(nextLesson)
      setWatchedSeconds(0)
      const lessonProgress = progressData.find(p => p.lesson_id === nextLesson.id)
      if (lessonProgress) {
        setWatchedSeconds(lessonProgress.watched_seconds)
      }
    }
  }

  const handleLessonSelect = (lesson: Lesson) => {
    if (currentLesson && currentLesson.id !== lesson.id) {
      saveProgress(false)
    }
    setCurrentLesson(lesson)
    setWatchedSeconds(0)
    const lessonProgress = progressData.find(p => p.lesson_id === lesson.id)
    if (lessonProgress) {
      setWatchedSeconds(lessonProgress.watched_seconds)
    }
  }

  const handleProgress = (state: { playedSeconds: number }) => {
    setWatchedSeconds(Math.floor(state.playedSeconds))
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    if (!course?.chapters) return 0
    let totalSeconds = 0
    course.chapters.forEach(chapter => {
      chapter.lessons?.forEach(lesson => {
        totalSeconds += lesson.duration_seconds
      })
    })
    return Math.round(totalSeconds / 60)
  }

  const getAllLessons = () => {
    return course?.chapters?.flatMap(ch => ch.lessons || []) || []
  }

  if (loading || authLoading) {
    return (
      <div className="h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="h-screen bg-neutral-950 text-white flex flex-col items-center justify-center">
        <p className="text-white/60 mb-4">강의를 찾을 수 없습니다.</p>
        <Link href="/courses" className="text-orange-400 hover:text-orange-300">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const allLessons = getAllLessons()
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id)

  return (
    <div className="h-screen bg-neutral-950 text-white overflow-hidden">
      <Header />

      <div className="fixed top-16 left-0 right-0 bottom-0 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-neutral-900 border-r border-white/5 transition-all duration-300 flex flex-col ${
            sidebarOpen ? 'w-80' : 'w-0 lg:w-14'
          } overflow-hidden z-30 lg:z-auto ${sidebarOpen ? 'absolute lg:relative inset-y-0 left-0' : ''}`}
        >
          <div className={`flex flex-col h-full ${sidebarOpen ? 'w-80' : 'w-14'}`}>
            {/* Sidebar Header */}
            <div className={`flex-shrink-0 border-b border-white/5 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
              {sidebarOpen ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href={`/courses/${params.id}`}
                      className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      클래스 소개
                    </Link>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm mb-2 line-clamp-2">{course.title}</h2>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{course.chapters?.length || 0}개 챕터</span>
                      <span>총 {getTotalDuration()}분</span>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-full p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {sidebarOpen && (
              <div className="flex-shrink-0 p-4 border-b border-white/5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/50">진도율</span>
                  <span className="text-orange-400 font-medium">{overallProgress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sidebarOpen ? (
                course.chapters?.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className="border-b border-white/5">
                    <div className="p-4 bg-white/[0.02]">
                      <span className="text-xs text-white/30">Chapter {chapterIndex + 1}</span>
                      <h3 className="font-medium text-sm">{chapter.title}</h3>
                    </div>
                    <div className="py-2">
                      {chapter.lessons?.map((lesson, lessonIndex) => {
                        const completed = isLessonCompleted(lesson.id)
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                              currentLesson?.id === lesson.id
                                ? 'bg-orange-500/10 border-l-2 border-orange-500'
                                : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                completed
                                  ? 'bg-green-500 text-white'
                                  : currentLesson?.id === lesson.id
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {completed ? (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                lessonIndex + 1
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${currentLesson?.id === lesson.id ? 'text-white' : 'text-white/70'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-white/30">{formatDuration(lesson.duration_seconds)}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-2">
                  {allLessons.map((lesson, index) => {
                    const completed = isLessonCompleted(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          handleLessonSelect(lesson)
                          setSidebarOpen(true)
                        }}
                        className={`w-full p-2 flex items-center justify-center transition-colors ${
                          currentLesson?.id === lesson.id ? 'bg-orange-500/10' : 'hover:bg-white/[0.02]'
                        }`}
                        title={lesson.title}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            completed
                              ? 'bg-green-500 text-white'
                              : currentLesson?.id === lesson.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {completed ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Exam Button */}
            {sidebarOpen && hasExam && overallProgress >= 80 && (
              <div className="flex-shrink-0 p-4 border-t border-white/5">
                <Link
                  href={`/exam/${params.id}`}
                  className="block w-full py-3 bg-green-500 hover:bg-green-400 text-white text-center text-sm font-medium rounded-xl transition-colors"
                >
                  시험 응시하기
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video Header */}
          <header className="flex-shrink-0 h-12 bg-neutral-900/80 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                  {currentLessonIndex + 1}강
                </span>
                <h1 className="text-sm font-medium truncate max-w-md">{currentLesson?.title || '강의 선택'}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Link
                href={`/courses/${params.id}`}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </header>

          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="w-full max-w-5xl">
                <div className="aspect-video">
                  {currentLesson?.video_url ? (
                    <ReactPlayer
                      ref={playerRef}
                      url={currentLesson.video_url}
                      width="100%"
                      height="100%"
                      controls
                      playing={isPlaying}
                      playbackRate={playbackRate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={handleLessonComplete}
                      onProgress={handleProgress}
                      progressInterval={5000}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center rounded-xl">
                      <p className="text-white/40">강의를 선택해주세요</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex-shrink-0 h-14 bg-neutral-900 border-t border-white/5 flex items-center justify-between px-4">
            <button
              onClick={() => {
                if (currentLessonIndex > 0) {
                  handleLessonSelect(allLessons[currentLessonIndex - 1])
                }
              }}
              disabled={currentLessonIndex === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </button>

            <button
              onClick={handleLessonComplete}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-sm font-medium rounded-lg transition-colors"
            >
              완료하고 다음으로
            </button>

            <button
              onClick={() => {
                if (currentLessonIndex < allLessons.length - 1) {
                  handleLessonSelect(allLessons[currentLessonIndex + 1])
                }
              }}
              disabled={currentLessonIndex === allLessons.length - 1}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              다음
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </main>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
