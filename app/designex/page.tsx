import Link from 'next/link'

export default function DesignExIndex() {
  const designs = [
    {
      id: 'style-a',
      name: 'Style A - 모던 & 미니멀',
      description: '인프런/Coursera 스타일. 깔끔하고 정보 중심적인 디자인',
      colors: ['#3B82F6', '#10B981', '#1F2937'],
      preview: 'bg-gradient-to-r from-blue-500 to-emerald-500',
    },
    {
      id: 'style-b',
      name: 'Style B - 따뜻한 감성',
      description: '클래스101 스타일. 감성적이고 친근한 디자인',
      colors: ['#F97316', '#EC4899', '#292524'],
      preview: 'bg-gradient-to-r from-orange-500 to-pink-500',
    },
    {
      id: 'style-c',
      name: 'Style C - 프로페셔널',
      description: '패스트캠퍼스 스타일. 신뢰감 있고 전문적인 디자인',
      colors: ['#7C3AED', '#06B6D4', '#0F172A'],
      preview: 'bg-gradient-to-r from-violet-600 to-cyan-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">E-Class Design System</h1>
          <p className="text-gray-400 text-sm mt-1">디자인 레퍼런스 & 프로토타입</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">디자인 스타일 선택</h2>
          <p className="text-gray-400 max-w-2xl">
            실제 서비스 수준의 UI/UX 디자인 예시입니다.
            각 스타일을 클릭하여 전체 페이지를 확인하세요.
          </p>
        </div>

        {/* Design Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {designs.map((design) => (
            <Link
              key={design.id}
              href={`/designex/${design.id}`}
              className="group block"
            >
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all hover:scale-[1.02] hover:shadow-2xl">
                {/* Preview */}
                <div className={`h-48 ${design.preview} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
                      <div className="flex gap-2">
                        {design.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {design.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {design.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-blue-400">
                    <span>미리보기</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Reference Links */}
        <div className="mt-16 p-8 bg-gray-900 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4">참고 플랫폼</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: '클래스101', url: 'https://class101.net' },
              { name: '인프런', url: 'https://inflearn.com' },
              { name: '패스트캠퍼스', url: 'https://fastcampus.co.kr' },
              { name: 'Coursera', url: 'https://coursera.org' },
              { name: 'Udemy', url: 'https://udemy.com' },
              { name: 'Skillshare', url: 'https://skillshare.com' },
            ].map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gray-800 rounded-lg text-center text-sm hover:bg-gray-700 transition-colors"
              >
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
