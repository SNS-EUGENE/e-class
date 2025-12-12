'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30분
  const [examStarted, setExamStarted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [score, setScore] = useState(0)

  // 샘플 문제
  const questions: Question[] = [
    {
      id: '1',
      question: 'React에서 컴포넌트의 상태를 관리하기 위해 사용하는 Hook은?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswer: 1,
    },
    {
      id: '2',
      question: '다음 중 React의 Virtual DOM에 대한 설명으로 올바른 것은?',
      options: [
        '실제 DOM을 직접 조작한다',
        '메모리에 가상의 DOM을 유지하여 변경사항을 비교한다',
        'Virtual DOM은 브라우저에서만 동작한다',
        'Virtual DOM은 React에서만 사용할 수 있다',
      ],
      correctAnswer: 1,
    },
    {
      id: '3',
      question: 'useEffect Hook의 두 번째 인자로 빈 배열([])을 전달하면 어떻게 동작하나요?',
      options: [
        '매 렌더링마다 실행된다',
        '컴포넌트가 마운트될 때 한 번만 실행된다',
        '상태가 변경될 때마다 실행된다',
        '컴포넌트가 언마운트될 때만 실행된다',
      ],
      correctAnswer: 1,
    },
    {
      id: '4',
      question: 'React에서 리스트 렌더링 시 key prop이 필요한 이유는?',
      options: [
        '스타일링을 위해',
        '이벤트 핸들링을 위해',
        '효율적인 DOM 업데이트를 위해',
        'SEO 최적화를 위해',
      ],
      correctAnswer: 2,
    },
    {
      id: '5',
      question: 'Next.js의 App Router에서 서버 컴포넌트의 기본 동작은?',
      options: [
        '모든 컴포넌트가 클라이언트에서 렌더링된다',
        '모든 컴포넌트가 서버에서 렌더링된다',
        "'use client'를 명시해야 서버에서 렌더링된다",
        '기본적으로 서버에서 렌더링되며, 클라이언트 컴포넌트는 명시해야 한다',
      ],
      correctAnswer: 3,
    },
  ]

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null))
  }, [])

  useEffect(() => {
    if (!examStarted || examFinished) return

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
  }, [examStarted, examFinished])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++
      }
    })
    setScore(Math.round((correct / questions.length) * 100))
    setExamFinished(true)
  }

  const answeredCount = answers.filter((a) => a !== null).length

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
                <h1 className="text-2xl font-bold mb-2">자격증 시험</h1>
                <p className="text-white/50">React 실전 프로젝트 수료 시험</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/50">문항 수</span>
                  <span className="font-medium">{questions.length}문항</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/50">제한 시간</span>
                  <span className="font-medium">30분</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/50">합격 기준</span>
                  <span className="font-medium">80점 이상</span>
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

  if (examFinished) {
    const passed = score >= 80

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
                  ? '시험에 합격하셨습니다. 자격증이 발급되었습니다.'
                  : '합격 기준(80점)에 미달했습니다. 다시 도전해보세요!'}
              </p>

              <div className="text-6xl font-bold mb-8">
                <span className={passed ? 'text-green-400' : 'text-red-400'}>{score}</span>
                <span className="text-2xl text-white/30">점</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.02] rounded-xl p-4">
                  <p className="text-sm text-white/40 mb-1">총 문항</p>
                  <p className="text-xl font-semibold">{questions.length}</p>
                </div>
                <div className="bg-white/[0.02] rounded-xl p-4">
                  <p className="text-sm text-white/40 mb-1">정답</p>
                  <p className="text-xl font-semibold text-green-400">
                    {Math.round((score / 100) * questions.length)}
                  </p>
                </div>
                <div className="bg-white/[0.02] rounded-xl p-4">
                  <p className="text-sm text-white/40 mb-1">오답</p>
                  <p className="text-xl font-semibold text-red-400">
                    {questions.length - Math.round((score / 100) * questions.length)}
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
                    자격증 확인
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setExamStarted(false)
                      setExamFinished(false)
                      setCurrentQuestion(0)
                      setAnswers(new Array(questions.length).fill(null))
                      setTimeLeft(30 * 60)
                    }}
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

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Exam Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-white/5 z-50">
        <div className="max-w-screen-xl mx-auto h-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">자격증 시험</span>
            <span className="text-sm font-medium">
              {currentQuestion + 1} / {questions.length}
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
            <span className="text-orange-400 font-medium">{answeredCount}/{questions.length}</span>
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
              {answers[currentQuestion] !== null && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  답변 완료
                </span>
              )}
            </div>

            <h2 className="text-xl font-medium mb-8">{questions[currentQuestion].question}</h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    answers[currentQuestion] === index
                      ? 'bg-orange-500/10 border-orange-500 text-white'
                      : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        answers[currentQuestion] === index
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
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentQuestion === index
                      ? 'bg-orange-500 text-white'
                      : answers[index] !== null
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

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              제출하기
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
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
