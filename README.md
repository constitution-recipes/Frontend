# ChiDiet (체다이어트)

당신만을 위한 맞춤형 건강 식단 플랫폼

> Chi(기) + Diet의 합성어로, 한의학의 체질 이론을 현대적으로 재해석하여 개인 맞춤형 건강 식단을 제공하는 서비스입니다.

전통 지식과 현대 AI로 맞춤형 건강 여정을 시작하세요.

## 프로젝트 구조

```
/
└── frontend/            # Next.js 프론트엔드
    ├── app/            # Next.js 13+ App Router
    ├── components/     # 재사용 가능한 UI 컴포넌트
    │   ├── common/    # 공통 컴포넌트 (Button, Input 등)
    │   └── ui/        # shadcn/ui 컴포넌트
    ├── lib/           # 유틸리티 함수 및 설정
    └── public/        # 정적 파일
```

## 개발 환경 설정

### 요구 사항

- Node.js 18 이상
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

4. shadcn/ui 설치 및 초기화

```bash
# shadcn/ui CLI 설치
npx shadcn-ui@latest init

# 설치 과정에서 다음 옵션 선택:
# - Would you like to use TypeScript? Yes
# - Which style would you like to use? Default
# - Which color would you like to use as base color? Slate
# - Where is your global CSS file? app/globals.css
# - Would you like to use CSS variables? Yes
# - Where is your tailwind.config.js located? tailwind.config.js
# - Configure the import alias for components? @/components
# - Configure the import alias for utils? @/lib/utils
```

5. 필요한 컴포넌트 설치 예시

```bash
# 버튼 컴포넌트 설치
npx shadcn-ui@latest add button

# 입력 필드 컴포넌트 설치
npx shadcn-ui@latest add input

# 카드 컴포넌트 설치
npx shadcn-ui@latest add card

# 기타 필요한 컴포넌트들도 동일한 방식으로 설치
```

6. PostCSS 설정

`postcss.config.js` 파일이 다음과 같이 설정되어 있는지 확인:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

7. Tailwind CSS 설정

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

8. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 경우 값을 수정:

```bash
cp .env.example .env.local
```

9. 개발 서버 실행

```bash
npm run dev
```

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

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.