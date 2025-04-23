# 안식: 맞춤형 건강 솔루션

전통 지식과 현대 AI로 맞춤형 건강 여정을 시작하세요.

## 프로젝트 구조

```
/
├── frontend/            # Next.js 프론트엔드
│   ├── app/            # Next.js 13+ App Router
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   │   ├── common/    # 공통 컴포넌트 (Button, Input 등)
│   │   └── ui/        # shadcn/ui 컴포넌트
│   ├── lib/           # 유틸리티 함수 및 설정
│   └── public/        # 정적 파일
│
├── backend/            # FastAPI 백엔드
│   ├── app/           # 메인 애플리케이션
│   │   ├── api/      # API 라우트
│   │   ├── core/     # 핵심 설정 및 유틸리티
│   │   ├── models/   # 데이터 모델
│   │   └── services/ # 비즈니스 로직
│   └── tests/        # 테스트 코드
│
└── README.md
```

## 개발 환경 설정

### 요구 사항

- Node.js 18 이상
- Python 3.9 이상
- Git

### 프론트엔드 설정 (Next.js)

1. 프론트엔드 디렉토리로 이동

```bash
cd frontend
```

2. 기본 의존성 설치

```bash
npm install
```

3. Tailwind CSS 및 필수 의존성 설치

```bash
# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer

# shadcn/ui 의존성 설치
npm install class-variance-authority clsx tailwind-merge lucide-react

# 애니메이션 플러그인 설치
npm install tailwindcss-animate
```

4. PostCSS 설정

`postcss.config.js` 파일이 다음과 같이 설정되어 있는지 확인:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

5. Tailwind CSS 설정

`tailwind.config.js` 파일이 프로젝트에 맞게 설정되어 있는지 확인:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... 기타 색상 설정
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

6. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 경우 값을 수정:

```bash
cp .env.example .env.local
```

7. 개발 서버 실행

```bash
npm run dev
```

### 백엔드 설정 (FastAPI)

1. 백엔드 디렉토리로 이동

```bash
cd backend
```

2. 가상 환경 생성 및 활성화

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. 의존성 설치

```bash
pip install -r requirements.txt
```

4. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 필요한 경우 값을 수정:

```bash
cp .env.example .env
```

5. 개발 서버 실행

```bash
uvicorn app.main:app --reload
```

## 주요 기능

### 사용자 인증

- 회원가입: 이름, 이메일, 비밀번호, 전화번호, 알레르기 정보, 건강 목표 등 상세 정보를 수집
- 로그인: 이메일과 비밀번호로 로그인

### 사용자 프로필

- 프로필 조회: 사용자의 상세 정보 조회
- 프로필 수정: 사용자 정보 업데이트

## API 엔드포인트

| 경로 | 메서드 | 설명 |
|------|------|------|
| `/auth/signup` | POST | 새 사용자 등록 |
| `/auth/login` | POST | 사용자 로그인 및 토큰 발급 |
| `/users/me` | GET | 현재 로그인한 사용자 정보 조회 |
| `/users/{user_id}` | GET | 특정 사용자 정보 조회 |
| `/users/{user_id}` | PUT | 사용자 정보 업데이트 |
| `/users/{user_id}` | DELETE | 사용자 계정 삭제 |

## 기술 스택

### 프론트엔드

- Next.js 15+ (App Router)
- React 18
- Tailwind CSS
- shadcn/ui (UI 컴포넌트)
- Zustand (상태 관리)
- React Query (서버 상태 관리)
- React Hook Form (폼 관리)
- Zod (데이터 유효성 검증)

### 백엔드

- FastAPI (웹 프레임워크)
- Pydantic (데이터 검증)
- SQLModel (ORM)
- MongoDB (메인 데이터베이스)
- Redis (캐싱, 세션)
- Celery (비동기 작업)
- RabbitMQ (메시지 큐)
- FAISS/Milvus (벡터 데이터베이스)
- PyJWT (JWT 인증)
- Bcrypt (비밀번호 해싱)

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.