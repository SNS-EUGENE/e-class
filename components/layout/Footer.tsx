import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="px-5 py-16 border-t border-white/5 bg-neutral-950">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <p className="text-xl font-semibold mb-4 text-white">eclass</p>
            <p className="text-sm text-white/40 mb-6 max-w-xs">
              누구나 자신만의 속도로 배울 수 있는 온라인 클래스 플랫폼
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-4 text-white">서비스</p>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link href="/courses" className="hover:text-white transition-colors">클래스</Link></li>
              <li><Link href="/instructors" className="hover:text-white transition-colors">크리에이터</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">기업교육</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-4 text-white">고객지원</p>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link href="#" className="hover:text-white transition-colors">공지사항</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">1:1 문의</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-4 text-white">회사</p>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link href="#" className="hover:text-white transition-colors">회사소개</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">채용</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">블로그</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-white/30">
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <Link href="/privacy" className="hover:text-white transition-colors font-medium text-white/50">개인정보처리방침</Link>
              <Link href="#" className="hover:text-white transition-colors">저작권 정책</Link>
            </div>
            <p>© 2024 eclass. All rights reserved.</p>
          </div>
          <p className="text-xs text-white/20 mt-4">
            (주)한국SNS인재개발원 | 대표: 홍길동 | 사업자등록번호: 000-00-00000 | 서울특별시 강남구 테헤란로 123
          </p>
        </div>
      </div>
    </footer>
  )
}
