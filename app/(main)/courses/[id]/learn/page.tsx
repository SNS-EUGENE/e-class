'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/layout'

// react-player는 클라이언트 사이드에서만 로드
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-neutral-900 animate-pulse flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
  completed: boolean
}

interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const playerRef = useRef<any>(null)

  // 샘플 커리큘럼
  const chapters: Chapter[] = [
    {
      id: '1',
      title: '시작하기',
      lessons: [
        { id: '1-1', title: '강의 소개 및 학습 목표', duration: '10:30', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: true },
        { id: '1-2', title: '개발 환경 설정', duration: '15:45', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: true },
      ],
    },
    {
      id: '2',
      title: '기초 개념',
      lessons: [
        { id: '2-1', title: '핵심 개념 이해하기', duration: '22:30', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: false },
        { id: '2-2', title: '기본 문법 살펴보기', duration: '28:15', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: false },
        { id: '2-3', title: '첫 번째 실습', duration: '35:00', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: false },
      ],
    },
    {
      id: '3',
      title: '실전 프로젝트',
      lessons: [
        { id: '3-1', title: '프로젝트 구조 설계', duration: '25:00', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: false },
        { id: '3-2', title: '핵심 기능 구현', duration: '45:30', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: false },
        { id: '3-3', title: '테스트 및 배포', duration: '30:00', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', completed: false },
      ],
    },
  ]

  useEffect(() => {
    // 첫 번째 미완료 레슨 또는 첫 번째 레슨 선택
    const allLessons = chapters.flatMap(ch => ch.lessons)
    const firstIncomplete = allLessons.find(l => !l.completed) || allLessons[0]
    setCurrentLesson(firstIncomplete)

    // 전체 진도 계산
    const completedCount = allLessons.filter(l => l.completed).length
    setProgress(Math.round((completedCount / allLessons.length) * 100))
  }, [])

  const handleLessonComplete = () => {
    if (!currentLesson) return

    // 현재 레슨 완료 처리 (실제로는 DB 업데이트)
    const allLessons = chapters.flatMap(ch => ch.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)

    // 다음 레슨으로 이동
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1])
    }
  }

  const getTotalDuration = () => {
    const allLessons = chapters.flatMap(ch => ch.lessons)
    let totalMinutes = 0
    allLessons.forEach(lesson => {
      const [mins, secs] = lesson.duration.split(':').map(Number)
      totalMinutes += mins + secs / 60
    })
    return Math.round(totalMinutes)
  }

  return (
    <div className="h-screen bg-neutral-950 text-white overflow-hidden">
      {/* 공통 헤더 - fixed 포지션 (h-16 = 64px) */}
      <Header />

      {/* 메인 컨텐츠 영역 - fixed 헤더 아래 전체 영역 */}
      <div className="fixed top-16 left-0 right-0 bottom-0 flex overflow-hidden">
        {/* 사이드바 */}
        <aside
          className={`flex-shrink-0 bg-neutral-900 border-r border-white/5 transition-all duration-300 flex flex-col ${
            sidebarOpen ? 'w-80' : 'w-0 lg:w-14'
          } overflow-hidden`}
        >
          {/* 사이드바가 열려있을 때 */}
          <div className={`flex flex-col h-full ${sidebarOpen ? 'w-80' : 'w-14'}`}>
            {/* 사이드바 헤더 */}
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
                      title="사이드바 접기"
                    >
                      <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm mb-2 line-clamp-2">React 실전 프로젝트</h2>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{chapters.length}개 챕터</span>
                      <span>총 {getTotalDuration()}분</span>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-full p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                  title="사이드바 펼치기"
                >
                  <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* 진도율 - 열려있을 때만 */}
            {sidebarOpen && (
              <div className="flex-shrink-0 p-4 border-b border-white/5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/50">진도율</span>
                  <span className="text-orange-400 font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 챕터 목록 - 스크롤 가능 영역 */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sidebarOpen ? (
                chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className="border-b border-white/5">
                    <div className="p-4 bg-white/[0.02]">
                      <span className="text-xs text-white/30">Chapter {chapterIndex + 1}</span>
                      <h3 className="font-medium text-sm">{chapter.title}</h3>
                    </div>
                    <div className="py-2">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                            currentLesson?.id === lesson.id
                              ? 'bg-orange-500/10 border-l-2 border-orange-500'
                              : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                              lesson.completed
                                ? 'bg-green-500 text-white'
                                : currentLesson?.id === lesson.id
                                ? 'bg-orange-500 text-white'
                                : 'bg-white/10 text-white/40'
                            }`}
                          >
                            {lesson.completed ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              lessonIndex + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm truncate ${
                                currentLesson?.id === lesson.id ? 'text-white' : 'text-white/70'
                              }`}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-xs text-white/30">{lesson.duration}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // 접혀있을 때 - 아이콘으로 표시
                <div className="py-2">
                  {chapters.flatMap(ch => ch.lessons).map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLesson(lesson)
                        setSidebarOpen(true)
                      }}
                      className={`w-full p-2 flex items-center justify-center transition-colors ${
                        currentLesson?.id === lesson.id
                          ? 'bg-orange-500/10'
                          : 'hover:bg-white/[0.02]'
                      }`}
                      title={lesson.title}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          lesson.completed
                            ? 'bg-green-500 text-white'
                            : currentLesson?.id === lesson.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {lesson.completed ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 시험 응시 버튼 - 열려있을 때만 */}
            {sidebarOpen && progress >= 100 && (
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

        {/* 메인 컨텐츠 */}
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          {/* 비디오 플레이어 헤더 */}
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
                  {chapters.flatMap(ch => ch.lessons).findIndex(l => l.id === currentLesson?.id) + 1}강
                </span>
                <h1 className="text-sm font-medium truncate max-w-md">{currentLesson?.title || '강의 선택'}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 재생 속도 */}
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
                title="클래스 소개로 돌아가기"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </header>

          {/* 비디오 플레이어 영역 */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="w-full max-w-5xl">
                <div className="aspect-video">
                  {currentLesson?.videoUrl ? (
                    <ReactPlayer
                      ref={playerRef}
                      url={currentLesson.videoUrl}
                      width="100%"
                      height="100%"
                      controls
                      playing={isPlaying}
                      playbackRate={playbackRate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={handleLessonComplete}
                      progressInterval={5000}
                      config={{
                        youtube: {
                          playerVars: {
                            showinfo: 1,
                            rel: 0,
                          },
                        },
                      }}
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

          {/* 하단 컨트롤 바 */}
          <div className="flex-shrink-0 h-14 bg-neutral-900 border-t border-white/5 flex items-center justify-between px-4">
            <button
              onClick={() => {
                const allLessons = chapters.flatMap(ch => ch.lessons)
                const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id)
                if (currentIndex > 0) {
                  setCurrentLesson(allLessons[currentIndex - 1])
                }
              }}
              disabled={chapters.flatMap(ch => ch.lessons).findIndex(l => l.id === currentLesson?.id) === 0}
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
                const allLessons = chapters.flatMap(ch => ch.lessons)
                const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id)
                if (currentIndex < allLessons.length - 1) {
                  setCurrentLesson(allLessons[currentIndex + 1])
                }
              }}
              disabled={chapters.flatMap(ch => ch.lessons).findIndex(l => l.id === currentLesson?.id) === chapters.flatMap(ch => ch.lessons).length - 1}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              다음
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </main>

        {/* 모바일 오버레이 */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20 top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
