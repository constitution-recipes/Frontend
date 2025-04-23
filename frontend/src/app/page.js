import Link from 'next/link';
import { Button } from '@/components/common/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 네비게이션 */}
      <nav className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">안식</div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              로그인
            </Link>
            <Link href="/auth/signup">
              <Button size="lg">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="flex-1 bg-gradient-primary">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              전통 지식과 현대 AI로 <br />
              <span className="text-primary">건강한 삶을 위한 맞춤형 솔루션</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              몸의 균형을 찾고 체질에 맞는 건강법을 발견하세요. 
              안식은 당신의 건강 여정을 과학적이고 개인화된 방식으로 도와드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  더 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-primary">안식</span>의 특별한 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-primary">안식</div>
              <p className="text-muted-foreground mt-1">건강한 삶을 위한 맞춤형 솔루션</p>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                서비스 소개
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                이용약관
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                개인정보처리방침
              </Link>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm mt-8">
            © 2024 안식. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    title: "맞춤형 체질 분석",
    description: "과학적 설문과 AI 분석을 통해 당신의 체질을 정확히 진단하고, 개인화된 건강 솔루션을 제공합니다."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    title: "건강 목표 달성",
    description: "체중 관리, 면역력 강화, 스트레스 감소 등 당신의 건강 목표를 위한 맞춤형 식단과 운동법을 제공합니다."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v6h6"></path>
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
        <path d="M21 22v-6h-6"></path>
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
      </svg>
    ),
    title: "지속적인 건강 관리",
    description: "정기적인 피드백과 건강 추적 기능으로 당신의 건강 상태를 지속적으로 모니터링하고 개선합니다."
  }
]; 