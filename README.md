# E-CLASS

민간자격증 발급 플랫폼 - 강의 수강부터 자격증 발급까지

## 개요

강의 수강 → 문제 풀이 → 합격 시 수료증 발급 → 자격증 배송까지 연결되는 풀스택 서비스

## 기능

### 구현 완료
- **사용자 인증** - Supabase Auth 기반 로그인/회원가입
- **강의 시스템** - 카테고리별 강의 목록, 영상 플레이어 (react-player)
- **문제은행** - Supabase 기반 문제 관리
- **수료증 발급** - PDF 자동 생성 (pdf-lib)
- **관리자 페이지** - 강의/문제 관리

### 개발 예정
- 결제 시스템 연동
- 자격증 배송 연동
- 학습 진도 관리

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, React 19 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | TailwindCSS 4 |
| Video | react-player |
| PDF | pdf-lib |

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 설정

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
eclass/
├── app/
│   ├── (auth)/        # 인증 관련 페이지
│   ├── (main)/        # 메인 서비스 페이지
│   ├── admin/         # 관리자 페이지
│   └── api/           # API 라우트
├── components/
│   ├── layout/        # Header, Footer
│   └── ui/            # UI 컴포넌트
├── contexts/          # React Context
├── lib/               # Supabase 클라이언트, 유틸리티
├── types/             # TypeScript 타입 정의
└── public/            # 정적 파일
```

## 스크린샷

(추가 예정)

## 라이선스

Private
