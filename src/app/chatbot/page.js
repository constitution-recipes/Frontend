'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChatRecipeCard } from '@/components/recipe/ChatRecipeCard';
import { Send, ArrowLeft, Save, ChevronDown, ChevronUp, ChefHat, Loader2 } from 'lucide-react';

// 가상의 사용자 정보 (실제로는 로그인 상태에서 가져옵니다)
const userProfile = {
  name: '김민준',
  allergies: ['땅콩', '우유'],
  healthConditions: ['소화불량'],
  dietaryPreferences: ['저염식'],
};

// 더미 레시피 데이터
const dummyRecipes = [
  {
    id: 'chat-1',
    title: '맞춤형 영양 토마토 수프',
    description: '체질에 맞는 토마토의 효능을 최대화한 수프입니다. 소화불량에 도움이 되는 재료를 추가했습니다.',
    ingredients: [
      '토마토 4개',
      '양파 1개',
      '마늘 2쪽',
      '올리브 오일 2큰술',
      '바질 약간',
      '소금 약간 (저염)',
      '후추 약간',
      '물 또는 채소 스톡 2컵'
    ],
    steps: [
      '토마토를 깨끗이 씻어 십자 모양으로 칼집을 내고 끓는 물에 살짝 데친 후 껍질을 벗깁니다.',
      '양파와 마늘을 다집니다.',
      '팬에 올리브 오일을 두르고 양파와 마늘을 투명해질 때까지 약불에서 볶습니다.',
      '토마토를 손으로 으깨어 팬에 넣고 물 또는 채소 스톡을 부어줍니다.',
      '중불에서 약 15분간 끓입니다.',
      '핸드블렌더로 수프를 곱게 갈아줍니다.',
      '소금과 후추로 간을 맞추고 바질을 뿌려 마무리합니다.',
    ],
    cookTime: '30분',
    servings: '2인분',
    suitableFor: '소화불량 개선, 면역력 강화',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=500',
    nutritionalInfo: '칼로리: 120kcal, 탄수화물: 15g, 단백질: 3g, 지방: 7g, 나트륨: 200mg'
  }
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '안녕하세요! AI 레시피 어시스턴트입니다. 어떤 레시피를 찾고 계신가요? 원하는 음식, 재료, 식이 제한 등을 자유롭게 말씀해주세요.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [useProfile, setUseProfile] = useState(true);
  
  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedRecipe]);

  // 메시지 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // 사용자 메시지 추가
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // 실제 구현에서는 API 호출 (지금은 시뮬레이션)
    setTimeout(() => {
      // 3번째 메시지 이후에 레시피 생성
      if (messages.length >= 3) {
        setGeneratedRecipe(dummyRecipes[0]);
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: '요청하신 내용을 바탕으로 레시피를 만들었습니다. 체질에 맞게 조정된 토마토 수프 레시피입니다. 어떠신가요?' 
          }
        ]);
      } else {
        // 일반 응답
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: '더 구체적으로 알려주세요. 어떤 재료나 음식을 좋아하시나요? 특별한 요구사항이 있으신가요?' 
          }
        ]);
      }
      setLoading(false);
    }, 1500);
  };

  // 레시피 저장
  const saveRecipe = () => {
    alert('레시피가 저장되었습니다!');
    // 실제 구현에서는 API 호출
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 네비게이션 바 */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-teal-500">ChiDiet</Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                  맞춤 레시피로 돌아가기
                </Button>
              </Link>
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
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 뒤로가기 및 옵션 헤더 */}
        <div className="bg-white border-b py-3 px-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft size={18} className="mr-1" />
              <span>레시피 목록으로 돌아가기</span>
            </Link>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              옵션
              {showOptions ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
            </button>
          </div>
        </div>

        {/* 옵션 패널 */}
        {showOptions && (
          <div className="bg-gray-50 border-b py-3 px-4 animate-in slide-in-from-top duration-300">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Switch 
                    id="useProfile" 
                    checked={useProfile} 
                    onCheckedChange={setUseProfile}
                  />
                  <Label htmlFor="useProfile" className="ml-2">내 프로필 정보 활용하기</Label>
                </div>
                {useProfile && (
                  <div className="text-sm text-gray-500">
                    <span>알레르기: {userProfile.allergies.join(', ')}</span>
                    <span className="mx-2">|</span>
                    <span>식이: {userProfile.dietaryPreferences.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 pb-20">
              {/* 메시지들 */}
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-md p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-teal-500 text-white rounded-br-none' 
                        : 'bg-white shadow rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* 생성된 레시피 */}
              {generatedRecipe && (
                <div className="flex justify-start">
                  <div className="max-w-md w-full bg-white shadow rounded-lg rounded-bl-none p-4">
                    <ChatRecipeCard recipe={generatedRecipe} />
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        className="text-teal-500 border-teal-500"
                        onClick={saveRecipe}
                      >
                        <Save size={16} className="mr-1" />
                        레시피 저장
                      </Button>
                      <Link href={`/recipe/${generatedRecipe.id}`}>
                        <Button className="bg-teal-500">자세히 보기</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 로딩 표시 */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-lg shadow rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                      <p className="text-sm text-gray-500">레시피를 생성 중입니다...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 자동 스크롤을 위한 더미 엘리먼트 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="bg-white border-t py-4 px-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="레시피에 대해 질문하세요 (예: '소화에 좋은 저녁 메뉴 추천해줘')"
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="bg-teal-500 hover:bg-teal-600 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-xs text-gray-500 text-center">
              건강 정보, 선호하는 음식, 필요한 영양소 등을 자세히 알려주시면 더 맞춤화된 레시피를 제공해드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 