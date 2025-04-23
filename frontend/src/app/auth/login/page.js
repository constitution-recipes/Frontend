import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: '로그인 - 안식',
  description: '안식 계정에 로그인하여 맞춤형 건강 여정을 시작하세요.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 이미지 영역 */}
      <div className="hidden md:block md:w-1/2 bg-teal-500">
        <div className="h-full flex flex-col items-center justify-center text-white p-12">
          <h1 className="text-4xl font-bold mb-6">안녕하세요, 반갑습니다!</h1>
          <p className="text-xl max-w-md text-center mb-8">
            안식에 다시 오신 것을 환영합니다. 개인 맞춤형 건강 여정을 함께해요.
          </p>
          <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <span className="text-5xl">🍃</span>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 폼 영역 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold text-teal-500 hover:text-teal-600">안식</div>
            </Link>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 