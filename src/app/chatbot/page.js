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
import { Send, ArrowLeft, Save, ChevronDown, ChevronUp, ChefHat, Loader2, Settings, XCircle } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { motion, AnimatePresence } from 'framer-motion';

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
    <SidebarLayout>
      <div className="flex flex-col flex-1 overflow-hidden min-h-screen bg-gradient-to-b from-teal-50 via-white to-white relative">
        {/* 옵션 FAB 버튼 (fancy) */}
        <div className="fixed z-40 bottom-24 right-6 md:bottom-10 md:right-10 group">
          <button
            onClick={() => setShowOptions(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-400 via-teal-500 to-teal-600 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-200"
            aria-label="옵션"
          >
            <Settings size={28} className="text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-16 bg-black/80 text-white text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none whitespace-nowrap">
            옵션
          </span>
        </div>

        {/* 옵션 패널 - fancy 카드 */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-md mx-auto relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* 상단 컬러풀 원형 아이콘 */}
                <div className="flex flex-col items-center pt-8 pb-2 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-500">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-2">
                    <Settings size={32} className="text-teal-500" />
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">챗봇 옵션</h2>
                </div>
                <button
                  onClick={() => setShowOptions(false)}
                  className="absolute top-4 right-4 text-teal-400 hover:text-teal-600 focus:outline-none"
                >
                  <XCircle size={32} />
                  <span className="sr-only">옵션 닫기</span>
                </button>
                <div className="p-8 pt-4 flex flex-col gap-6">
                  <div className="flex items-center">
                    <Switch 
                      id="useProfile" 
                      checked={useProfile} 
                      onCheckedChange={setUseProfile}
                    />
                    <Label htmlFor="useProfile" className="ml-2 text-base">내 프로필 정보 활용하기</Label>
                  </div>
                  {useProfile && (
                    <div className="text-sm text-gray-600 bg-teal-50 rounded-lg px-4 py-2">
                      <span>알레르기: {userProfile.allergies.join(', ')}</span>
                      <span className="mx-2">|</span>
                      <span>식이: {userProfile.dietaryPreferences.join(', ')}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-auto p-4 md:p-6 pt-12 md:pt-16">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 pb-32">
              {/* 메시지들 */}
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-5 py-3 rounded-2xl shadow-md text-base break-words ${
                      message.role === 'user'
                        ? 'bg-gradient-to-tr from-teal-400 via-teal-500 to-teal-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-teal-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* 생성된 레시피 */}
              {generatedRecipe && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: messages.length * 0.05 }}
                  className="flex justify-start"
                >
                  <div className="max-w-md w-full bg-white shadow rounded-2xl rounded-bl-md p-4 border border-teal-100">
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
                </motion.div>
              )}

              {/* 로딩 표시 */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: messages.length * 0.05 + 0.1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-4 rounded-2xl shadow rounded-bl-md border border-teal-100">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                      <p className="text-sm text-gray-500">레시피를 생성 중입니다...</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 자동 스크롤을 위한 더미 엘리먼트 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* 입력 영역 (fancy) */}
        <div className="bg-white/90 border-t py-4 px-4 sticky bottom-0 z-30 shadow-[0_-2px_16px_0_rgba(0,0,0,0.04)]">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="AI 요리사에게 무엇이든 물어보세요! 🍳"
                className="flex-1 rounded-full bg-gray-50 border-none shadow-inner px-5 py-3 text-base focus:ring-2 focus:ring-teal-200"
                disabled={loading}
                autoComplete="off"
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="rounded-full bg-gradient-to-tr from-teal-400 via-teal-500 to-teal-600 hover:from-teal-500 hover:to-teal-700 shadow-lg w-12 h-12 flex items-center justify-center p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="mt-2 text-xs text-gray-500 text-center">
              건강 정보, 선호하는 음식, 필요한 영양소 등을 자세히 알려주시면 더 맞춤화된 레시피를 제공해드립니다.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
} 