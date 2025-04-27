'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { ChevronRight, Filter, Plus, ChefHat } from 'lucide-react';

export default function DashboardPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ difficulty: 'all', time: 'all' });

  // 샘플 데이터 (실제로는 API에서 가져올 것입니다)
  useEffect(() => {
    // 실제 구현에서는 여기에 API 호출이 들어갑니다
    const dummyRecipes = [
      {
        id: '1',
        title: '단호박 효능 높이는 체질별 맞춤 수프',
        description: '체질에 맞는 재료와 조리법으로 단호박의 효능을 극대화하는 수프 레시피입니다.',
        difficulty: '쉬움',
        prepTime: '15분',
        cookTime: '25분',
        ingredients: ['단호박', '양파', '마늘', '올리브 오일', '소금', '후추', '치킨 스톡'],
        image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ba2a?q=80&w=500',
        rating: 4.8,
        suitableFor: '음양 균형, 소화력 강화',
        tags: ['계절식', '영양식', '간편식'],
      },
      {
        id: '2',
        title: '체질별 맞춤 닭가슴살 샐러드',
        description: '다양한 신선한 채소와 단백질이 풍부한 닭가슴살을 체질에 맞게 조합한 샐러드입니다.',
        difficulty: '쉬움',
        prepTime: '20분',
        cookTime: '15분',
        ingredients: ['닭가슴살', '양상추', '시금치', '방울토마토', '아보카도', '올리브 오일', '레몬즙'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500',
        rating: 4.5,
        suitableFor: '단백질 흡수 개선, 면역력 강화',
        tags: ['고단백', '저칼로리', '가벼운 식사'],
      },
      {
        id: '3',
        title: '대추차 활용 냉이 영양밥',
        description: '대추차의 달콤함과 냉이의 영양을 모두 담은 맞춤형 영양밥으로 체질 개선에 도움을 줍니다.',
        difficulty: '중간',
        prepTime: '15분',
        cookTime: '30분',
        ingredients: ['쌀', '냉이', '대추', '마늘', '참기름', '소금'],
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=500',
        rating: 4.7,
        suitableFor: '혈액순환 개선, 소화기능 강화',
        tags: ['한식', '약선요리', '영양식'],
      },
      {
        id: '4',
        title: '체질별 맞춤 당근생강주스',
        description: '체질에 맞게 조절된 당근과 생강의 비율로 최적의 영양 흡수를 도와주는 주스입니다.',
        difficulty: '쉬움',
        prepTime: '10분',
        cookTime: '0분',
        ingredients: ['당근', '생강', '사과', '레몬', '꿀'],
        image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?q=80&w=500',
        rating: 4.9,
        suitableFor: '소화력 증진, 면역력 강화',
        tags: ['주스', '건강음료', '간편식'],
      }
    ];

    setTimeout(() => {
      setRecipes(dummyRecipes);
      setLoading(false);
    }, 1000);
  }, []);

  // 필터 적용
  const filteredRecipes = recipes.filter(recipe => {
    if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 바 */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-teal-500">ChiDiet</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="border-teal-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  맞춤 레시피
                </Link>
                <Link href="/profile" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  내 프로필
                </Link>
                <Link href="/saved" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  저장한 레시피
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 상단 헤더 */}
        <div className="px-4 sm:px-0 mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">맞춤 레시피 추천</h1>
              <p className="mt-1 text-sm text-gray-500">
                당신의 체질과 건강 상태에 맞는 맞춤형 레시피를 추천해드립니다.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/chatbot">
                <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
                  <ChefHat size={16} />
                  <span>직접 레시피 만들기</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="text-sm font-medium">필터:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="text-sm border border-gray-300 rounded-md p-1.5"
              >
                <option value="all">난이도: 전체</option>
                <option value="쉬움">쉬움</option>
                <option value="중간">중간</option>
                <option value="어려움">어려움</option>
              </select>
              <select
                value={filters.time}
                onChange={(e) => setFilters({...filters, time: e.target.value})}
                className="text-sm border border-gray-300 rounded-md p-1.5"
              >
                <option value="all">조리시간: 전체</option>
                <option value="quick">30분 이하</option>
                <option value="medium">30분-1시간</option>
                <option value="long">1시간 이상</option>
              </select>
            </div>
          </div>
        </div>

        {/* 레시피 그리드 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* 페이지네이션 또는 더 불러오기 버튼 */}
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="text-teal-500 border-teal-500 hover:bg-teal-50">
                더 많은 레시피 보기
              </Button>
            </div>
          </>
        )}

        {/* 하단 챗봇 안내 섹션 */}
        <div className="mt-12 mb-8 bg-teal-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">원하는 레시피가 없으신가요?</h2>
              <p className="mt-1 text-gray-600">
                AI 레시피 어시스턴트와 대화하며 나만의 맞춤 레시피를 만들어보세요.
              </p>
            </div>
            <Link href="/chatbot">
              <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
                <span>레시피 챗봇 시작하기</span>
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 