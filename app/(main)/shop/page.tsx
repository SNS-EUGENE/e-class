'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'

interface CreditPackage {
  id: string
  credits: number
  price: number
  bonus?: number
  popular?: boolean
}

export default function ShopPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')

  const creditPackages: CreditPackage[] = [
    { id: '1', credits: 5000, price: 5000 },
    { id: '2', credits: 10000, price: 10000, bonus: 500 },
    { id: '3', credits: 30000, price: 30000, bonus: 3000, popular: true },
    { id: '4', credits: 50000, price: 50000, bonus: 7500 },
    { id: '5', credits: 100000, price: 100000, bonus: 20000 },
  ]

  const currentCredits = 15000

  const handlePurchase = () => {
    if (!selectedPackage) return
    // 실제로는 결제 프로세스 구현
    alert('결제 기능은 준비 중입니다.')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="pt-24 pb-20 px-5">
        <div className="max-w-screen-xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3">크레딧 충전</h1>
            <p className="text-white/50">크레딧으로 원하는 클래스를 수강하세요</p>
          </div>

          {/* Current Balance */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-gradient-to-r from-orange-500/20 to-neutral-900 rounded-2xl p-6 border border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50 mb-1">내 크레딧</p>
                  <p className="text-3xl font-bold">₩{currentCredits.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Credit Packages */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">충전 금액 선택</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {creditPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative p-6 rounded-2xl text-left transition-all border ${
                      selectedPackage === pkg.id
                        ? 'bg-orange-500/10 border-orange-500'
                        : 'bg-neutral-900 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-4 px-3 py-1 bg-orange-500 text-xs font-medium rounded-full">
                        인기
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold">₩{pkg.credits.toLocaleString()}</p>
                        {pkg.bonus && (
                          <p className="text-sm text-orange-400">+₩{pkg.bonus.toLocaleString()} 보너스</p>
                        )}
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPackage === pkg.id
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-white/30'
                        }`}
                      >
                        {selectedPackage === pkg.id && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/40">
                      <span>결제 금액</span>
                      <span>₩{pkg.price.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Amount (Optional) */}
              <div className="mt-6 p-6 bg-neutral-900 rounded-2xl border border-white/5">
                <h3 className="font-medium mb-4">직접 입력</h3>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₩</span>
                    <input
                      type="number"
                      placeholder="금액 입력"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      onChange={() => setSelectedPackage(null)}
                    />
                  </div>
                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
                    적용
                  </button>
                </div>
                <p className="text-xs text-white/30 mt-2">최소 1,000원부터 충전 가능합니다</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 sticky top-24">
                <h2 className="text-lg font-semibold mb-6">결제 정보</h2>

                {selectedPackage ? (
                  <>
                    {(() => {
                      const pkg = creditPackages.find((p) => p.id === selectedPackage)
                      if (!pkg) return null
                      return (
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between">
                            <span className="text-white/50">충전 크레딧</span>
                            <span>₩{pkg.credits.toLocaleString()}</span>
                          </div>
                          {pkg.bonus && (
                            <div className="flex justify-between">
                              <span className="text-white/50">보너스</span>
                              <span className="text-orange-400">+₩{pkg.bonus.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="border-t border-white/5 pt-4">
                            <div className="flex justify-between">
                              <span className="text-white/50">총 획득 크레딧</span>
                              <span className="font-semibold text-orange-400">
                                ₩{(pkg.credits + (pkg.bonus || 0)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-lg font-semibold">
                            <span>결제 금액</span>
                            <span>₩{pkg.price.toLocaleString()}</span>
                          </div>
                        </div>
                      )
                    })()}
                  </>
                ) : (
                  <div className="text-center py-8 text-white/40">
                    <p>충전할 금액을 선택해주세요</p>
                  </div>
                )}

                {/* Payment Methods */}
                <div className="mb-6">
                  <p className="text-sm text-white/50 mb-3">결제 수단</p>
                  <div className="space-y-2">
                    {[
                      { id: 'card', label: '신용/체크카드', icon: '💳' },
                      { id: 'kakao', label: '카카오페이', icon: '🟡' },
                      { id: 'naver', label: '네이버페이', icon: '🟢' },
                      { id: 'phone', label: '휴대폰 결제', icon: '📱' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                          paymentMethod === method.id
                            ? 'bg-white/5 border-orange-500'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-sm">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={!selectedPackage}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  결제하기
                </button>

                <p className="text-xs text-white/30 text-center mt-4">
                  결제 시 이용약관에 동의하는 것으로 간주됩니다
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <section className="mt-20">
            <h2 className="text-xl font-semibold text-center mb-8">크레딧 사용 안내</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: '유효기간 없음',
                  description: '충전한 크레딧은 유효기간 없이 언제든 사용 가능합니다',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                  title: '모든 클래스 이용',
                  description: '플랫폼 내 모든 유료 클래스를 크레딧으로 결제할 수 있습니다',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: '추가 보너스',
                  description: '많이 충전할수록 더 많은 보너스 크레딧을 드립니다',
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="text-center p-6 bg-neutral-900 rounded-2xl border border-white/5"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/50">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-20">
            <h2 className="text-xl font-semibold text-center mb-8">자주 묻는 질문</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  q: '크레딧 환불이 가능한가요?',
                  a: '미사용 크레딧은 구매 후 7일 이내에 전액 환불이 가능합니다. 부분 사용 시에는 사용분을 제외한 금액만 환불됩니다.',
                },
                {
                  q: '크레딧으로 구매한 클래스는 환불되나요?',
                  a: '클래스 시작 전 또는 진도율 10% 미만일 경우 크레딧으로 환불 가능합니다.',
                },
                {
                  q: '보너스 크레딧도 동일하게 사용할 수 있나요?',
                  a: '네, 보너스 크레딧은 일반 크레딧과 동일하게 모든 서비스에 사용 가능합니다.',
                },
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-neutral-900 rounded-xl border border-white/5">
                  <h4 className="font-medium mb-2">{faq.q}</h4>
                  <p className="text-sm text-white/50">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
