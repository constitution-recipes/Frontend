import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export const metadata = {
  title: '회원가입 - 안식',
  description: '안식 계정을 만들어 맞춤형 건강 여정을 시작하세요.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 정보 영역 */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="h-full flex flex-col items-center justify-center text-white p-12">
          <h1 className="text-4xl font-bold mb-6">건강한 변화의 시작</h1>
          <p className="text-xl max-w-md text-center mb-8">
            안식과 함께 몸과 마음의 균형을 찾고, 당신만을 위한 맞춤형 건강 여정을 시작하세요.
          </p>
          
          <div className="grid grid-cols-2 gap-6 max-w-md w-full">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-2">🧘</div>
              <h3 className="text-lg font-semibold mb-1">맞춤형 분석</h3>
              <p className="text-sm text-white/80">당신의 체질에 맞는 건강 솔루션을 제공합니다</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-2">🥗</div>
              <h3 className="text-lg font-semibold mb-1">개인화된 식단</h3>
              <p className="text-sm text-white/80">체질에 맞는 식단과 레시피를 추천해드립니다</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-1">건강 추적</h3>
              <p className="text-sm text-white/80">건강 상태를 지속적으로 모니터링하고 분석합니다</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="text-lg font-semibold mb-1">AI 컨설팅</h3>
              <p className="text-sm text-white/80">지속적인 AI 건강 코칭을 제공합니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 회원가입 폼 영역 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold text-teal-500 hover:text-teal-600">안식</div>
            </Link>
          </div>
          
          <SignupForm />
        </div>
      </div>
    </div>
  );
} 