'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { exams as examsApi, certificates as certificatesApi, courses as coursesApi, enrollments as enrollmentsApi } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Header, Footer } from '@/components/layout'
import type { Exam, ExamQuestion, Course } from '@/types/database'

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [exam, setExam] = useState<(Exam & { questions: ExamQuestion[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && params.id) {
      checkEnrollmentAndFetchExam()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, params.id])

  const checkEnrollmentAndFetchExam = async () => {
    try {
      // 수강 확인
      const { enrolled } = await enrollmentsApi.check(user!.id, params.id as string)
      if (!enrolled) {
        router.push(`/courses/${params.id}`)
        return
      }

      // 코스 정보 가져오기
      const { data: courseData } = await coursesApi.getById(params.id as string)
      setCourse(courseData)

      // 시험 정보 가져오기
      const { data: examsData } = await examsApi.getByCourseId(params.id as string)
      if (examsData && examsData.length > 0) {
        const { data: examWithQuestions } = await examsApi.getById(examsData[0].id)
        if (examWithQuestions) {
          setExam(examWithQuestions)
          setTimeLeft((examWithQuestions.time_limit_minutes || 30) * 60)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 타이머
  useEffect(() => {
    if (!examStarted || examFinished || !exam) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, examFinished, exam])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (optionIndex: number) => {
    if (!exam) return
    setAnswers(prev => ({
      ...prev,
      [exam.questions[currentQuestion].id]: optionIndex
    }))
  }

  const handleSubmit = useCallback(async () => {
    if (!exam || !user || submitting) return

    setSubmitting(true)

    try {
      // 점수 계산
      let correct = 0
      exam.questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          correct++
        }
      })

      const calculatedScore = Math.round((correct / exam.questions.length) * 100)
      const hasPassed = calculatedScore >= exam.pass_score

      // 결과 저장
      const { data: result } = await examsApi.submitResult({
        user_id: user.id,
        exam_id: exam.id,
        score: calculatedScore,
        passed: hasPassed,
        answers: answers,
      })

      // 합격시 수료증 발급
      if (hasPassed && result) {
        await certificatesApi.create(user.id, params.id as string, result.id)
      }

      setScore(calculatedScore)
      setPassed(hasPassed)
      setExamFinished(true)
    } catch (error) {
      console.error('Error submitting exam:', error)
      alert('시험 제출 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }, [exam, user, answers, params.id, submitting])

  const answeredCount = exam ? Object.keys(answers).length : 0

  const resetExam = () => {
    setExamStarted(false)
    setExamFinished(false)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft((exam?.time_limit_minutes || 30) * 60)
    setScore(0)
    setPassed(false)
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-white/60 mb-4">시험을 찾을 수 없습니다.</p>
          <Link href={`/courses/${params.id}`} className="text-orange-400 hover:text-orange-300">
            강의로 돌아가기
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // 시험 시작 전 안내 화면
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Header />

        <main className="pt-24 pb-20 px-5">
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-900 rounded-2xl p-8 border border-white/5">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
                <p className="text-white/50">{course?.title}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/50">문항 수</span>
                  <span className="font-medium">{exam.questions.length}문항</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/50">제한 시간</span>
                  <span className="font-medium">{exam.time_limit_minutes || 30}분</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/50">합격 기준</span>
                  <span className="font-medium">{exam.pass_score}점 이상</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/50">응시 횟수</span>
                  <span className="font-medium">제한 없음</span>
                </div>
              </div>

              <div className="bg-orange-500/10 rounded-xl p-4 mb-8">
                <p className="text-sm text-orange-400">
                  <strong>주의사항:</strong> 시험이 시작되면 타이머가 작동합니다.
                  브라우저를 닫거나 새로고침하면 진행 상황이 초기화됩니다.
                </p>
              </div>

              <button
                onClick={() => setExamStarted(true)}
                className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all"
              >
                시험 시작하기
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // 시험 결과 화면
  if (examFinished) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Header />

        <main className="pt-24 pb-20 px-5">
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-900 rounded-2xl p-8 border border-white/5 text-center">
              <div
                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  passed ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}
              >
                {passed ? (
                  <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">
                {passed ? '축하합니다!' : '아쉽네요'}
              </h1>
              <p className="text-white/50 mb-8">
                {passed
                  ? '시험에 합격하셨습니다. 수료증이 발급되었습니다.'
                  : `합격 기준(${exam.pass_score}점)에 미달했습니다. 다시 도전해보세요!`}
              </p>

              <div className="text-6xl font-bold mb-8">
                <span className={passed ? 'text-green-400' : 'text-red-400'}>{score}</span>
                <span className="text-2xl text-white/30">점</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.02] rounded-xl p-4">
                  <p className="text-sm text-white/40 mb-1">총 문항</p>
                  <p className="text-xl font-semibold">{exam.questions.length}</p>
                </div>
                <div className="bg-white/[0.02] rounded-xl p-4">
                  <p className="text-sm text-white/40 mb-1">정답</p>
                  <p className="text-xl font-semibold text-green-400">
                    {Math.round((score / 100) * exam.questions.length)}
                  </p>
                </div>
                <div className="bg-white/[0.02] rounded-xl p-4">
                  <p className="text-sm text-white/40 mb-1">오답</p>
                  <p className="text-xl font-semibold text-red-400">
                    {exam.questions.length - Math.round((score / 100) * exam.questions.length)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/mypage"
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10"
                >
                  마이페이지
                </Link>
                {passed ? (
                  <Link
                    href="/mypage/certificates"
                    className="flex-1 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all"
                  >
                    수료증 확인
                  </Link>
                ) : (
                  <button
                    onClick={resetExam}
                    className="flex-1 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all"
                  >
                    다시 응시
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // 시험 진행 화면
  const currentQ = exam.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Exam Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-white/5 z-50">
        <div className="max-w-screen-xl mx-auto h-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{exam.title}</span>
            <span className="text-sm font-medium">
              {currentQuestion + 1} / {exam.questions.length}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-white/5'
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/50">답변완료</span>
            <span className="text-orange-400 font-medium">{answeredCount}/{exam.questions.length}</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-5">
        <div className="max-w-3xl mx-auto">
          {/* Question */}
          <div className="bg-neutral-900 rounded-2xl p-8 border border-white/5 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm font-medium rounded-full">
                Q{currentQuestion + 1}
              </span>
              {answers[currentQ.id] !== undefined && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  답변 완료
                </span>
              )}
            </div>

            <h2 className="text-xl font-medium mb-8">{currentQ.question}</h2>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    answers[currentQ.id] === index
                      ? 'bg-orange-500/10 border-orange-500 text-white'
                      : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        answers[currentQ.id] === index
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
            <p className="text-sm text-white/50 mb-4">문항 바로가기</p>
            <div className="flex flex-wrap gap-2">
              {exam.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentQuestion === index
                      ? 'bg-orange-500 text-white'
                      : answers[q.id] !== undefined
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto h-full px-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-sm font-medium text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            이전 문항
          </button>

          {currentQuestion === exam.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < exam.questions.length || submitting}
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '제출 중...' : '제출하기'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium rounded-xl transition-all"
            >
              다음 문항
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
