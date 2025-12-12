# E-Class 온라인 학습 플랫폼 - 프로젝트 기획서

> **최종 수정일**: 2025-12-11
> **버전**: 1.0.0
> **상태**: 기획 단계

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [핵심 워크플로우](#2-핵심-워크플로우)
3. [사이트맵](#3-사이트맵)
4. [페이지별 상세 명세](#4-페이지별-상세-명세)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [API 명세](#6-api-명세)
7. [개발 진행 현황](#7-개발-진행-현황)
8. [기술 스택](#8-기술-스택)
9. [변경 이력](#9-변경-이력)

---

## 1. 프로젝트 개요

### 1.1 서비스 소개

**E-Class**는 한국SNS인재개발원에서 운영하는 온라인 학습 플랫폼입니다.
사용자는 강의를 수강하고, 시험을 통과한 후 자격증을 발급받을 수 있습니다.

### 1.2 핵심 기능

| 기능 | 설명 |
|------|------|
| 회원 관리 | 회원가입, 로그인, 프로필 관리 |
| 강의 수강 | 코스 신청, 동영상 시청, 진도 관리 |
| 시험 응시 | 문제은행 기반 랜덤 출제, 자동 채점 |
| 자격증 발급 | 시험 합격 후 PDF 자격증 발급 |
| 크레딧 시스템 | 가상 화폐로 코스/자격증 결제 (테스트용) |
| 관리자 기능 | 코스, 강의, 문제, 사용자 관리 |

### 1.3 사용자 유형

| 유형 | 권한 |
|------|------|
| 비회원 | 코스 목록 조회, 미리보기 시청 |
| 일반 회원 | 코스 수강, 시험 응시, 자격증 발급 |
| 강사 | 본인 코스 관리 (추후 확장) |
| 관리자 | 전체 시스템 관리 |

---

## 2. 핵심 워크플로우

### 2.1 학습 플로우

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           사용자 학습 플로우                               │
└─────────────────────────────────────────────────────────────────────────┘

[1. 회원가입/로그인]
        │
        ▼
[2. 코스 탐색] ──────────────────┐
        │                        │
        │ 코스 선택              │ 찜하기
        ▼                        ▼
[3. 코스 상세 확인]          [찜 목록 저장]
        │
        │ 수강 신청 (크레딧 차감)
        ▼
[4. 학습 페이지 진입]
        │
        │ 강의 시청 (진도 자동 저장)
        │ ↓ 반복
        ▼
[5. 모든 강의 완료] ─────────────┐
        │                        │
        │                        │ 아직 미완료
        ▼                        ▼
[6. 시험 응시 가능]          [학습 계속]
        │
        │ 시험 시작
        ▼
[7. 시험 응시]
   - 랜덤 문제 출제
   - 시간 제한
   - 답안 자동 저장
        │
        │ 제출
        ▼
[8. 결과 확인] ──────────────────┐
        │                        │
        │ 합격                   │ 불합격
        ▼                        ▼
[9. 자격증 발급 결제]        [재응시 안내]
   (크레딧 차감)
        │
        ▼
[10. 자격증 발급 완료]
   - PDF 다운로드
   - 인쇄
   - 마이페이지에서 조회
```

### 2.2 크레딧 플로우

```
[상점 방문] → [패키지 선택] → [결제(테스트)] → [크레딧 충전]
                                                    │
                    ┌───────────────────────────────┘
                    │
                    ▼
            [크레딧 사용처]
            ├── 코스 수강 신청
            └── 자격증 발급 결제
```

### 2.3 결제 타이밍 옵션

자격증 발급비 결제는 다음 두 시점에 가능:

1. **시험 응시 전**: 미리 결제 후 시험 응시
2. **시험 합격 후**: 합격 확인 후 결제 (권장)

> **참고**: 크레딧 부족 시 상점으로 이동하여 충전 후 돌아올 수 있음.
> 모든 단계에서 중간 저장이 필수.

---

## 3. 사이트맵

### 3.1 전체 구조

```
📁 E-Class
│
├── 🏠 / (랜딩 페이지)
│
├── 🔐 인증
│   ├── /login                     # 로그인
│   ├── /register                  # 회원가입
│   └── /forgot-password           # 비밀번호 찾기
│
├── 📚 코스
│   ├── /courses                   # 코스 목록
│   ├── /courses/[id]              # 코스 상세
│   ├── /courses/[id]/learn        # 학습 페이지
│   └── /courses/[id]/complete     # 수료 완료
│
├── 👨‍🏫 강사
│   ├── /instructors               # 강사 목록
│   └── /instructors/[id]          # 강사 상세
│
├── 📝 시험
│   ├── /exam/[courseId]                    # 시험 안내
│   ├── /exam/[courseId]/take/[sessionId]   # 시험 응시
│   └── /exam/[courseId]/result/[sessionId] # 시험 결과
│
├── 🏆 자격증
│   ├── /certificate/[courseId]/payment     # 발급 결제
│   ├── /certificate/[id]                   # 자격증 조회
│   └── /certificate/verify/[number]        # 진위 확인 (공개)
│
├── 🛒 상점
│   ├── /shop                      # 크레딧 패키지
│   ├── /shop/checkout/[packageId] # 결제
│   └── /shop/success              # 결제 완료
│
├── 👤 마이페이지
│   ├── /mypage                    # 대시보드
│   ├── /mypage/profile            # 프로필 편집
│   ├── /mypage/enrollments        # 수강 내역
│   ├── /mypage/favorites          # 찜 목록
│   ├── /mypage/exams              # 시험 이력
│   ├── /mypage/certificates       # 자격증 목록
│   └── /mypage/credits            # 크레딧/결제 내역
│
├── ⚙️ 관리자
│   ├── /admin                     # 대시보드
│   ├── /admin/users               # 사용자 관리
│   ├── /admin/instructors         # 강사 관리
│   ├── /admin/courses             # 코스 관리
│   ├── /admin/courses/[id]/lectures   # 강의 관리
│   ├── /admin/courses/[id]/questions  # 문제은행 관리
│   ├── /admin/credit-packages     # 크레딧 상품 관리
│   ├── /admin/payments            # 결제 내역
│   ├── /admin/certificates        # 자격증 발급 내역
│   │
│   ├── /admin/site                # 📌 사이트 관리 (NEW)
│   │   ├── /admin/site/main       # 메인 페이지 편집
│   │   │   ├── 히어로 섹션 (제목, 부제, 버튼 텍스트, 배경 이미지)
│   │   │   ├── 추천 코스 섹션 (표시 코스 선택)
│   │   │   ├── 배너 관리 (CTA 배너 문구, 이미지)
│   │   │   └── 통계 숫자 (수강생 수, 클래스 수 등)
│   │   │
│   │   ├── /admin/site/popup      # 팝업 관리
│   │   │   ├── 팝업 생성/수정/삭제
│   │   │   ├── 표시 기간 설정
│   │   │   ├── 표시 조건 (로그인 여부, 첫 방문 등)
│   │   │   └── 이미지/HTML 콘텐츠
│   │   │
│   │   └── /admin/site/banners    # 광고 배너 관리
│   │       ├── 슬라이드 배너 순서 관리
│   │       ├── 클릭 URL 설정
│   │       └── 배너 이미지 업로드
│
└── 📄 기타
    ├── /search                    # 통합 검색
    ├── /terms                     # 이용약관
    ├── /privacy                   # 개인정보처리방침
    ├── /faq                       # 자주 묻는 질문
    └── /contact                   # 문의하기
```

---

## 4. 페이지별 상세 명세

### 4.1 랜딩 페이지 (`/`)

**목적**: 서비스 소개 및 신규 사용자 유입

**구성 요소**:
- [ ] 히어로 섹션 (서비스 소개, CTA 버튼)
- [ ] 인기 코스 캐러셀
- [ ] 강사 하이라이트
- [ ] 플랫폼 통계 (총 강의, 수강생, 자격증 발급 수)
- [ ] 이용 후기
- [ ] 푸터 (링크, 연락처, SNS)

**상태별 표시**:
| 상태 | CTA 버튼 |
|------|----------|
| 비로그인 | "시작하기" → /register |
| 로그인 | "내 강의 보기" → /mypage |

---

### 4.2 로그인 페이지 (`/login`)

**목적**: 사용자 인증

**구성 요소**:
- [ ] 이메일 입력
- [ ] 비밀번호 입력
- [ ] "로그인" 버튼
- [ ] "비밀번호 찾기" 링크
- [ ] "회원가입" 링크
- [ ] 소셜 로그인 버튼 (Google, Kakao) - 추후

**파라미터**:
```
Query: ?redirect=/courses/xxx  (로그인 후 리다이렉트)
```

**유효성 검사**:
- 이메일 형식 확인
- 빈 값 체크

**에러 처리**:
- 이메일/비밀번호 불일치
- 계정 없음
- 네트워크 오류

---

### 4.3 회원가입 페이지 (`/register`)

**목적**: 신규 회원 등록

**구성 요소**:
- [ ] 이름 입력
- [ ] 이메일 입력 (중복 확인)
- [ ] 비밀번호 입력 (강도 표시)
- [ ] 비밀번호 확인
- [ ] 휴대폰 번호 (선택)
- [ ] 이용약관 동의 체크박스
- [ ] 개인정보처리방침 동의 체크박스
- [ ] "회원가입" 버튼

**파라미터**:
```
Query: ?redirect=/courses/xxx  (가입 후 리다이렉트)
```

**유효성 검사**:
- 이메일 형식 및 중복
- 비밀번호 최소 6자
- 비밀번호 확인 일치
- 필수 동의 항목 체크

---

### 4.4 코스 목록 페이지 (`/courses`)

**목적**: 코스 탐색 및 검색

**구성 요소**:
- [ ] 검색바
- [ ] 필터 사이드바
  - 카테고리
  - 난이도 (입문/중급/고급)
  - 가격 범위
- [ ] 정렬 드롭다운 (인기순/최신순/가격순/평점순)
- [ ] 코스 카드 그리드
- [ ] 페이지네이션 또는 무한 스크롤

**코스 카드 표시 정보**:
- 썸네일
- 제목
- 강사명
- 총 강의 수 / 총 시간
- 가격 (크레딧)
- 평점 / 수강생 수
- 찜하기 버튼 (로그인 시)

**파라미터**:
```typescript
Query: {
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  sort?: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating'
  search?: string
  page?: number
  limit?: number  // default: 12
}
```

---

### 4.5 코스 상세 페이지 (`/courses/[id]`)

**목적**: 코스 정보 확인 및 수강 신청

**구성 요소**:
- [ ] 코스 헤더 (썸네일, 제목, 설명)
- [ ] 강사 정보 카드
- [ ] 코스 메타 정보 (난이도, 총 시간, 강의 수)
- [ ] 가격 및 수강 신청 버튼
- [ ] 커리큘럼 목록 (아코디언)
- [ ] 미리보기 가능 강의 표시
- [ ] 코스 리뷰 섹션 (추후)
- [ ] 찜하기 버튼

**상태별 버튼**:
| 상태 | 버튼 |
|------|------|
| 비로그인 | "로그인하고 수강하기" |
| 미수강 | "수강 신청 (100 크레딧)" |
| 수강중 | "학습 계속하기" |
| 완료 | "다시 보기" |

**파라미터**:
```
Path: [id] - 코스 UUID
```

---

### 4.6 학습 페이지 (`/courses/[id]/learn`)

**목적**: 강의 시청 및 학습

**구성 요소**:
- [ ] 커리큘럼 사이드바
  - 강의 목록
  - 각 강의 완료 상태 아이콘
  - 현재 강의 하이라이트
  - 전체 진도율 표시
- [ ] 비디오 플레이어 영역
  - react-player
  - 재생/일시정지
  - 진도바
  - 볼륨
  - 재생 속도
  - 전체화면
- [ ] 현재 강의 정보 (제목, 설명)
- [ ] 이전/다음 강의 버튼
- [ ] 모든 강의 완료 시 "시험 응시하기" 버튼 표시

**핵심 기능**:
- 진도 자동 저장 (5초 간격)
- 이어보기 (마지막 시청 위치에서 시작)
- 95% 이상 시청 시 완료 처리

**파라미터**:
```
Path: [id] - 코스 UUID
Query: ?lecture=xxx - 현재 강의 ID (선택)
```

---

### 4.7 시험 안내 페이지 (`/exam/[courseId]`)

**목적**: 시험 정보 안내 및 시작

**구성 요소**:
- [ ] 코스 정보
- [ ] 시험 정보
  - 문제 수
  - 시간 제한
  - 합격 점수
- [ ] 응시 이력 (이전 점수, 응시 횟수)
- [ ] 주의사항 안내
- [ ] "시험 시작" 버튼

**접근 조건**:
- 모든 강의 완료 필수

**파라미터**:
```
Path: [courseId] - 코스 UUID
```

---

### 4.8 시험 응시 페이지 (`/exam/[courseId]/take/[sessionId]`)

**목적**: 실제 시험 응시

**구성 요소**:
- [ ] 상단 고정바
  - 남은 시간 타이머
  - 문제 번호 네비게이션 (답변 상태 표시)
- [ ] 문제 영역
  - 문제 번호 및 텍스트
  - 선택지 (라디오/체크박스)
- [ ] 이전/다음 문제 버튼
- [ ] "제출하기" 버튼
- [ ] 자동 저장 인디케이터

**핵심 기능**:
- 문제은행에서 랜덤 출제
- 답안 자동 저장 (중간 저장)
- 시간 초과 시 자동 제출
- 제출 전 확인 모달

**파라미터**:
```
Path: [courseId] - 코스 UUID
      [sessionId] - 시험 세션 UUID
```

---

### 4.9 시험 결과 페이지 (`/exam/[courseId]/result/[sessionId]`)

**목적**: 시험 결과 확인

**구성 요소**:
- [ ] 합격/불합격 상태 표시 (시각적 강조)
- [ ] 점수 정보
  - 획득 점수 / 총점
  - 정답률
  - 합격 기준 점수
- [ ] 응시 정보 (응시일, 소요시간)

**합격 시**:
- [ ] 축하 메시지
- [ ] 자격증 발급 안내
- [ ] "자격증 발급하기" 버튼 → /certificate/[courseId]/payment

**불합격 시**:
- [ ] 재도전 격려 메시지
- [ ] "다시 응시하기" 버튼

**파라미터**:
```
Path: [courseId] - 코스 UUID
      [sessionId] - 시험 세션 UUID
```

---

### 4.10 자격증 결제 페이지 (`/certificate/[courseId]/payment`)

**목적**: 자격증 발급비 결제

**구성 요소**:
- [ ] 코스 정보
- [ ] 발급 비용 (크레딧)
- [ ] 현재 보유 크레딧
- [ ] 잔액 충분 여부 표시

**잔액 충분 시**:
- [ ] "자격증 발급하기" 버튼

**잔액 부족 시**:
- [ ] 부족 금액 안내
- [ ] "크레딧 충전하기" 버튼 → /shop

**파라미터**:
```
Path: [courseId] - 코스 UUID
```

---

### 4.11 자격증 조회 페이지 (`/certificate/[id]`)

**목적**: 발급된 자격증 조회 및 다운로드

**구성 요소**:
- [ ] 자격증 미리보기 (디자인 적용)
  - 수료자 이름
  - 코스 제목
  - 강사명
  - 발급일
  - 자격증 번호
- [ ] "PDF 다운로드" 버튼
- [ ] "인쇄하기" 버튼
- [ ] "공유하기" 버튼 (SNS)

**파라미터**:
```
Path: [id] - 자격증 UUID
```

---

### 4.12 자격증 진위확인 페이지 (`/certificate/verify/[number]`)

**목적**: 자격증 진위 확인 (외부 공개)

**구성 요소**:
- [ ] 자격증 번호 입력 필드
- [ ] "확인" 버튼
- [ ] 결과 표시
  - 유효: 수료자명, 코스명, 발급일
  - 무효: "존재하지 않는 자격증입니다"

**파라미터**:
```
Path: [number] - 자격증 번호 (선택, 직접 링크용)
```

---

### 4.13 상점 페이지 (`/shop`)

**목적**: 크레딧 충전

**구성 요소**:
- [ ] 현재 보유 크레딧 표시
- [ ] 크레딧 패키지 카드 목록
  - 패키지명
  - 크레딧 수량
  - 보너스 크레딧
  - 가격 (원)
  - 크레딧당 가격
  - "가성비" 뱃지 (해당 시)
- [ ] "구매하기" 버튼 → /shop/checkout/[packageId]

---

### 4.14 마이페이지 - 대시보드 (`/mypage`)

**목적**: 학습 현황 한눈에 보기

**구성 요소**:
- [ ] 사용자 정보 카드
  - 이름, 이메일, 프로필 이미지
  - 현재 크레딧 잔액
- [ ] 학습 통계
  - 수강 중인 코스 수
  - 완료한 코스 수
  - 발급받은 자격증 수
  - 총 학습 시간
- [ ] 수강 중인 코스 목록 (진도율 표시)
- [ ] 최근 활동 타임라인

---

### 4.15 관리자 - 대시보드 (`/admin`)

**목적**: 관리자 통계 및 빠른 접근

**구성 요소**:
- [ ] 통계 카드
  - 총 사용자 수
  - 총 코스 수
  - 총 수강 신청 수
  - 오늘 발급된 자격증 수
- [ ] 최근 가입 사용자 목록
- [ ] 최근 자격증 발급 목록
- [ ] 빠른 링크 (코스 추가, 문제 추가 등)

---

## 5. 데이터베이스 스키마

### 5.1 ERD 개요

```
profiles ─────────┬─────────── course_enrollments ──────── courses
    │             │                                          │
    │             │                                          │
    ├── course_favorites                                     ├── lectures
    ├── instructor_favorites                                 ├── question_banks
    ├── credit_transactions                                  └── instructors
    ├── payments
    ├── exam_sessions
    ├── exam_histories
    ├── course_completions
    └── certificates
```

### 5.2 테이블 상세

#### profiles (사용자)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_instructor BOOLEAN DEFAULT FALSE,
  credit_balance INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### instructors (강사)
```sql
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  bio TEXT,
  profile_image TEXT,
  specialty TEXT[],
  total_students INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### courses (코스)
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  price_credits INTEGER NOT NULL DEFAULT 0,
  certificate_fee INTEGER DEFAULT 0,
  pass_score INTEGER DEFAULT 70,
  total_duration_minutes INTEGER DEFAULT 0,
  total_lectures INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### lectures (개별 강의)
```sql
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### course_enrollments (수강 신청)
```sql
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);
```

#### lecture_progress (강의 진도)
```sql
CREATE TABLE lecture_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress DECIMAL(5,4) DEFAULT 0,
  last_position INTEGER DEFAULT 0,
  watch_time INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);
```

#### question_banks (문제은행)
```sql
CREATE TABLE question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### exam_sessions (시험 세션)
```sql
CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  questions JSONB NOT NULL,
  answers JSONB,
  time_limit_minutes INTEGER DEFAULT 60,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score INTEGER,
  total_points INTEGER,
  passed BOOLEAN,
  attempt_number INTEGER DEFAULT 1
);
```

#### exam_histories (시험 이력)
```sql
CREATE TABLE exam_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id UUID REFERENCES exam_sessions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  attempt_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### course_completions (코스 수료)
```sql
CREATE TABLE course_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exam_session_id UUID REFERENCES exam_sessions(id),
  completion_type TEXT CHECK (completion_type IN ('lectures_only', 'with_exam')),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

#### certificates (자격증)
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completion_id UUID REFERENCES course_completions(id),
  status TEXT DEFAULT 'issued' CHECK (status IN ('pending_payment', 'issued', 'revoked')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  pdf_url TEXT
);
```

#### credit_packages (크레딧 상품)
```sql
CREATE TABLE credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_krw INTEGER NOT NULL,
  bonus_credits INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### credit_transactions (크레딧 거래)
```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'spend', 'refund', 'bonus')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### payments (결제 내역)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credit_package_id UUID REFERENCES credit_packages(id),
  amount_krw INTEGER NOT NULL,
  credits_purchased INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'test',
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### course_favorites (코스 찜)
```sql
CREATE TABLE course_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

#### instructor_favorites (강사 찜)
```sql
CREATE TABLE instructor_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instructor_id)
);
```

### 5.3 인덱스
```sql
CREATE INDEX idx_lectures_course_id ON lectures(course_id);
CREATE INDEX idx_lecture_progress_user_course ON lecture_progress(user_id, course_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_exam_sessions_user_course ON exam_sessions(user_id, course_id);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_course_favorites_user ON course_favorites(user_id);
CREATE INDEX idx_instructor_favorites_user ON instructor_favorites(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
```

### 5.4 트리거

#### 자동 프로필 생성
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 6. API 명세

> API 엔드포인트는 Next.js App Router의 Route Handlers 또는
> Supabase 클라이언트를 통한 직접 호출로 구현

### 6.1 인증 API

| 기능 | 메서드 | 설명 |
|------|--------|------|
| 회원가입 | `supabase.auth.signUp()` | 이메일/비밀번호 가입 |
| 로그인 | `supabase.auth.signInWithPassword()` | 이메일 로그인 |
| 로그아웃 | `supabase.auth.signOut()` | 세션 종료 |
| 현재 사용자 | `supabase.auth.getUser()` | 로그인 상태 확인 |

### 6.2 코스 API

| 기능 | 테이블 | 설명 |
|------|--------|------|
| 코스 목록 | `courses` | 필터/정렬/페이지네이션 |
| 코스 상세 | `courses` + `lectures` | 커리큘럼 포함 |
| 수강 신청 | `course_enrollments` | 크레딧 차감 후 등록 |
| 찜하기 | `course_favorites` | 토글 |

### 6.3 학습 API

| 기능 | 테이블 | 설명 |
|------|--------|------|
| 진도 저장 | `lecture_progress` | upsert |
| 진도 조회 | `lecture_progress` | 코스별 전체 진도 |

### 6.4 시험 API

| 기능 | 설명 |
|------|------|
| 시험 시작 | 문제 랜덤 출제 → `exam_sessions` 생성 |
| 답안 저장 | `exam_sessions.answers` 업데이트 |
| 시험 제출 | 채점 → 점수/합격여부 저장 |
| 결과 조회 | `exam_sessions` + `exam_histories` |

### 6.5 크레딧 API

| 기능 | 설명 |
|------|------|
| 잔액 조회 | `profiles.credit_balance` |
| 크레딧 충전 | `payments` + `credit_transactions` + `profiles` 업데이트 |
| 크레딧 사용 | `credit_transactions` + `profiles` 업데이트 |
| 내역 조회 | `credit_transactions` |

### 6.6 자격증 API

| 기능 | 설명 |
|------|------|
| 자격증 발급 | 크레딧 차감 → `certificates` 생성 → PDF 생성 |
| 자격증 조회 | `certificates` |
| 진위 확인 | `certificates` (certificate_number 검색) |

---

## 7. 개발 진행 현황

### 7.1 Phase 1: 핵심 기능 (필수)

| 작업 | 상태 | 담당 | 비고 |
|------|------|------|------|
| DB 스키마 생성 | ⬜ 대기 | - | Supabase SQL |
| 미들웨어 수정 | ⬜ 대기 | - | 1middleware.ts → middleware.ts |
| 코스 구조 변경 | ⬜ 대기 | - | 코스 → 강의 계층 |
| 코스 목록 페이지 | 🔄 진행중 | - | 기본 구현됨, 필터 추가 필요 |
| 코스 상세 페이지 | 🔄 진행중 | - | 커리큘럼 추가 필요 |
| 학습 페이지 | ⬜ 대기 | - | 새로 생성 |
| 수강 신청 기능 | ⬜ 대기 | - | 크레딧 차감 로직 |
| 시험 시스템 | ⬜ 대기 | - | 문제은행, 출제, 채점 |
| 크레딧 시스템 | ⬜ 대기 | - | 충전, 사용, 내역 |

### 7.2 Phase 2: 자격증 & 결제

| 작업 | 상태 | 담당 | 비고 |
|------|------|------|------|
| 자격증 결제 페이지 | ⬜ 대기 | - | |
| PDF 자격증 생성 | ⬜ 대기 | - | pdf-lib 사용 |
| 자격증 진위확인 | ⬜ 대기 | - | 공개 페이지 |
| 상점 페이지 | ⬜ 대기 | - | 크레딧 패키지 |
| 마이페이지 연동 | ⬜ 대기 | - | 실제 데이터 |

### 7.3 Phase 3: 부가 기능

| 작업 | 상태 | 담당 | 비고 |
|------|------|------|------|
| 강사 목록/상세 | ⬜ 대기 | - | |
| 찜하기 기능 | ⬜ 대기 | - | 코스, 강사 |
| 검색 기능 | ⬜ 대기 | - | 통합 검색 |
| 리뷰/평점 | ⬜ 대기 | - | 추후 |

### 7.4 Phase 4: UI/UX 개선

| 작업 | 상태 | 담당 | 비고 |
|------|------|------|------|
| 토스트 알림 | ⬜ 대기 | - | react-hot-toast |
| 스켈레톤 로딩 | ⬜ 대기 | - | |
| 반응형 개선 | ⬜ 대기 | - | 모바일 |
| 접근성 | ⬜ 대기 | - | ARIA |

### 7.5 상태 범례

| 아이콘 | 의미 |
|--------|------|
| ⬜ | 대기 |
| 🔄 | 진행중 |
| ✅ | 완료 |
| ❌ | 보류/취소 |

---

## 8. 기술 스택

### 8.1 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 15.5.4 | 프레임워크 (App Router) |
| React | 19.1.0 | UI 라이브러리 |
| TypeScript | 5.x | 타입 안정성 |
| Tailwind CSS | 4.x | 스타일링 |
| react-player | 3.3.3 | 비디오 플레이어 |

### 8.2 백엔드 & 데이터베이스

| 기술 | 버전 | 용도 |
|------|------|------|
| Supabase | - | BaaS (인증, DB, 스토리지) |
| PostgreSQL | - | 데이터베이스 (Supabase) |

### 8.3 유틸리티

| 기술 | 버전 | 용도 |
|------|------|------|
| pdf-lib | 1.17.1 | PDF 자격증 생성 |

### 8.4 추가 고려 라이브러리

| 기술 | 용도 |
|------|------|
| react-hot-toast | 토스트 알림 |
| react-hook-form | 폼 관리 |
| zod | 유효성 검사 |
| date-fns | 날짜 포맷 |
| lucide-react | 아이콘 |

---

## 9. 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2025-12-11 | 1.0.0 | 초기 문서 작성 | - |

---

## 부록

### A. 테스트 계정 정보

> 테스트 단계에서 사용할 계정

| 유형 | 이메일 | 비밀번호 | 크레딧 |
|------|--------|----------|--------|
| 일반 사용자 | test@example.com | test1234 | 10,000 |
| 관리자 | admin@example.com | admin1234 | - |

### B. 크레딧 가격표 (예시)

| 패키지 | 크레딧 | 보너스 | 가격 | 크레딧당 |
|--------|--------|--------|------|----------|
| 베이직 | 100 | 0 | ₩10,000 | ₩100 |
| 스탠다드 | 300 | 30 | ₩27,000 | ₩81.8 |
| 프리미엄 | 500 | 100 | ₩40,000 | ₩66.7 |
| 프로 | 1,000 | 300 | ₩70,000 | ₩53.8 |

### C. 자격증 번호 형식

```
ECLASS-[연도]-[월]-[일련번호]
예: ECLASS-2025-12-000001
```

---

> **문서 끝**
