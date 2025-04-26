import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: '회원가입 - ChiDiet',
  description: 'ChiDiet 계정을 만들어 맞춤형 건강 여정을 시작하세요.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 소개 영역 */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-[#F4F9F4]">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/natural.svg')] opacity-5" />
        </div>
        
        {/* 블러 효과 원형들 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#E8F3E8]/40 rounded-full blur-[100px]" />
        
        {/* 메인 컨텐츠 */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-8 relative">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-primary/10 flex items-center justify-center">
                <span className="text-5xl">🌱</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70 text-transparent bg-clip-text">
            맞춤형 건강 여정의<br />시작
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
            ChiDiet과 함께<br />
            당신만의 건강한 라이프스타일을<br />
            디자인해보세요.
          </p>
          
          {/* 특징 리스트 */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-medium text-sm text-primary/80">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 오른쪽 회원가입 영역 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-b from-background to-primary/5">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-block group">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text group-hover:opacity-90 transition-opacity">
                ChiDiet
              </div>
            </Link>
          </div>
          
          {/* 회원가입 폼 */}
          <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: '🌱',
    title: '체질 맞춤 진단',
    description: '한의학 기반 개인 체질 분석'
  },
  {
    icon: '🍜',
    title: '건강식 레시피',
    description: '당신의 체질에 맞는 식단 추천'
  },
  {
    icon: '📊',
    title: '영양 분석',
    description: '실시간 건강 상태 모니터링'
  },
  {
    icon: '🛒',
    title: '식재료 추천',
    description: '맞춤형 식재료 구매 가이드'
  }
]; 