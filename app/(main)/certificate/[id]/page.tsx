export default function CertificatePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">수료증</h1>
          
          <div className="border-4 border-gray-300 rounded-lg p-12 my-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-serif">Certificate of Completion</h2>
              <p className="text-gray-600">This is to certify that</p>
              <p className="text-2xl font-bold">사용자 이름</p>
              <p className="text-gray-600">has successfully completed</p>
              <p className="text-xl font-semibold">강의 제목</p>
              <p className="text-gray-500 mt-8">수료 ID: {params.id}</p>
              <p className="text-gray-500">발급일: 2024-01-01</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              PDF 다운로드
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg">
              인쇄하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}