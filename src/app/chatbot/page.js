'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChatRecipeCard } from '@/components/recipe/ChatRecipeCard';
import { 
  Send, 
  ArrowLeft, 
  Save, 
  ChefHat, 
  Loader2, 
  Settings, 
  XCircle, 
  MessageSquare, 
  FileText, 
  BarChart,
  Sparkles,
  Utensils,
  User,
  Calendar,
  ClipboardList
} from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatbotIntro from './ChatbotIntro';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') || 'default';

  const [messages, setMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const found = sessions.find(s => s.id === sessionId);
      return found?.messages || [
        { role: 'assistant', content: '안녕하세요! AI 레시피 어시스턴트입니다. 어떤 레시피를 찾고 계신가요? 원하는 음식, 재료, 식이 제한 등을 자유롭게 말씀해주세요.' }
      ];
    }
    return [
      { role: 'assistant', content: '안녕하세요! AI 레시피 어시스턴트입니다. 어떤 레시피를 찾고 계신가요? 원하는 음식, 재료, 식이 제한 등을 자유롭게 말씀해주세요.' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [useProfile, setUseProfile] = useState(true);
  const [initialState, setInitialState] = useState(messages.length === 1 && messages[0].role === 'assistant');
  
  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedRecipe]);

  // 메시지 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setLoading(true);
    
    // 입력 전 상태에서 메시지 전송 시 상태 변경
    if (initialState) setInitialState(false);
    
    // 세션 저장
    if (typeof window !== 'undefined') {
      let sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const idx = sessions.findIndex(s => s.id === sessionId);
      if (idx > -1) sessions[idx].messages = updated;
      else sessions.push({ id: sessionId, messages: updated });
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
    
    setTimeout(() => {
      if (updated.length >= 4) {
        setGeneratedRecipe(dummyRecipes[0]);
        const newMessages = [
          ...updated,
          { role: 'assistant', content: '요청하신 내용을 바탕으로 레시피를 만들었습니다. 체질에 맞게 조정된 토마토 수프 레시피입니다. 어떠신가요?' }
        ];
        setMessages(newMessages);
        // 세션 저장
        if (typeof window !== 'undefined') {
          let sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
          const idx = sessions.findIndex(s => s.id === sessionId);
          if (idx > -1) sessions[idx].messages = newMessages;
          else sessions.push({ id: sessionId, messages: newMessages });
          localStorage.setItem('chatSessions', JSON.stringify(sessions));
        }
      } else {
        const newMessages = [
          ...updated,
          { role: 'assistant', content: '더 구체적으로 알려주세요. 어떤 재료나 음식을 좋아하시나요? 특별한 요구사항이 있으신가요?' }
        ];
        setMessages(newMessages);
        // 세션 저장
        if (typeof window !== 'undefined') {
          let sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
          const idx = sessions.findIndex(s => s.id === sessionId);
          if (idx > -1) sessions[idx].messages = newMessages;
          else sessions.push({ id: sessionId, messages: newMessages });
          localStorage.setItem('chatSessions', JSON.stringify(sessions));
        }
      }
      setLoading(false);
    }, 1500);
  };

  // 페이지 첫 진입 시(세션이 'default'일 때) 항상 인트로 상태로 초기화
  useEffect(() => {
    if (sessionId === 'default') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chatSessions');
      }
      setInitialState(true);
      setMessages([
        { role: 'assistant', content: '안녕하세요! AI 레시피 어시스턴트입니다. 어떤 레시피를 찾고 계신가요? 원하는 음식, 재료, 식이 제한 등을 자유롭게 말씀해주세요.' }
      ]);
      setGeneratedRecipe(null);
    }
  }, [sessionId]);

  // 새 채팅/세션 변경 시 메시지 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const found = sessions.find(s => s.id === sessionId);
      setMessages(found?.messages || [
        { role: 'assistant', content: '안녕하세요! AI 레시피 어시스턴트입니다. 어떤 레시피를 찾고 계신가요? 원하는 음식, 재료, 식이 제한 등을 자유롭게 말씀해주세요.' }
      ]);
      setGeneratedRecipe(null);
      const isInitial = !found?.messages || (found?.messages.length === 1 && found?.messages[0].role === 'assistant');
      setInitialState(isInitial);
    }
  }, [sessionId]);

  // 레시피 저장
  const saveRecipe = () => {
    alert('레시피가 저장되었습니다!');
    // 실제 구현에서는 API 호출
  };

  // 기능 카드 데이터
  const featureCards = [
    { 
      title: 'AI 대화', 
      description: 'AI와 자유롭게 대화해보세요.', 
      icon: <MessageSquare className="w-6 h-6 text-primary" strokeWidth={1.5} />, 
      onClick: () => setInput('AI 대화 시작'), 
      bgClass: 'from-primary/10 to-primary/5'
    },
    { 
      title: '맞춤형 레시피', 
      description: '나에게 맞는 레시피를 추천해드립니다.', 
      icon: <ChefHat className="w-6 h-6 text-orange-500" strokeWidth={1.5} />, 
      onClick: () => setInput('체질에 맞는 레시피 추천해줘'), 
      bgClass: 'from-orange-100 to-orange-50'
    },
    { 
      title: '식단 추천', 
      description: '건강한 식단 조합을 추천해드립니다.', 
      icon: <FileText className="w-6 h-6 text-green-600" strokeWidth={1.5} />, 
      onClick: () => setInput('오늘 식단 추천해줘'), 
      bgClass: 'from-green-100 to-green-50'
    },
    { 
      title: '영양 분석', 
      description: '식단의 영양 정보를 분석해보세요.', 
      icon: <BarChart className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      onClick: () => setInput('영양 분석'), 
      bgClass: 'from-blue-100 to-blue-50'
    },
    { 
      title: '식재료 정보', 
      description: '식재료의 효능과 특성을 알려드립니다.', 
      icon: <Utensils className="w-6 h-6 text-purple-600" strokeWidth={1.5} />, 
      onClick: () => setInput('당근의 효능에 대해 알려줘'), 
      bgClass: 'from-purple-100 to-purple-50'
    },
    { 
      title: '다이어트 도우미', 
      description: '건강한 다이어트를 도와드립니다.', 
      icon: <User className="w-6 h-6 text-teal-600" strokeWidth={1.5} />, 
      onClick: () => setInput('1주일 다이어트 식단 알려줘'), 
      bgClass: 'from-teal-100 to-teal-50'
    },
    { 
      title: '제철 음식', 
      description: '계절에 맞는 음식을 추천해드립니다.', 
      icon: <Calendar className="w-6 h-6 text-amber-600" strokeWidth={1.5} />, 
      onClick: () => setInput('이달의 제철 음식 알려줘'), 
      bgClass: 'from-amber-100 to-amber-50'
    },
    { 
      title: '식사 기록', 
      description: '오늘 드신 음식을 기록하세요.', 
      icon: <ClipboardList className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />, 
      onClick: () => setInput('아침으로 사과와 시리얼을 먹었어'), 
      bgClass: 'from-indigo-100 to-indigo-50'
    },
  ];

  // 옵션 패널 외부에서 열기 위한 이벤트 리스너
  useEffect(() => {
    const handler = () => setShowOptions(true);
    window.addEventListener('openChatOptions', handler);
    return () => window.removeEventListener('openChatOptions', handler);
  }, []);

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen w-full bg-gradient-primary relative">
        {/* 채팅 시작 전: 중앙 인풋 + 기능 카드 */}
        {initialState && (
          <ChatbotIntro
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            featureCards={featureCards}
          />
        )}

        {/* 기존 챗봇 UI: 채팅 시작 후 */}
        {!initialState && (
          <div className="flex flex-col h-screen w-full">
            {/* 옵션 패널 - 모달 */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-card rounded-2xl shadow-lg p-0 w-full max-w-md mx-4 relative overflow-hidden border border-border"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* 상단 컬러풀 원형 아이콘 */}
                    <div className="flex flex-col items-center pt-8 pb-6 bg-gradient-to-r from-primary/80 via-primary to-secondary/80">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-3">
                        <Settings size={28} className="text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">챗봇 설정</h2>
                    </div>
                    <button
                      onClick={() => setShowOptions(false)}
                      className="absolute top-4 right-4 text-white hover:text-white/80 focus:outline-none transition-colors"
                    >
                      <XCircle size={28} />
                      <span className="sr-only">옵션 닫기</span>
                    </button>
                    <div className="p-6 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="useProfile" className="text-base font-medium">내 프로필 정보 활용</Label>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            체질, 알레르기, 건강 상태 등을 활용하여 맞춤형 레시피를 제공합니다.
                          </p>
                        </div>
                        <Switch 
                          id="useProfile" 
                          checked={useProfile} 
                          onCheckedChange={setUseProfile}
                        />
                      </div>
                      
                      {useProfile && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-muted rounded-lg p-4"
                        >
                          <h3 className="text-sm font-medium mb-2">프로필 정보</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-20 text-muted-foreground">알레르기:</span>
                              <span className="font-medium">{userProfile.allergies.join(', ')}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-20 text-muted-foreground">건강 상태:</span>
                              <span className="font-medium">{userProfile.healthConditions.join(', ')}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-20 text-muted-foreground">식이 제한:</span>
                              <span className="font-medium">{userProfile.dietaryPreferences.join(', ')}</span>
                            </div>
                        </div>
                        </motion.div>
                      )}

                      <div className="flex justify-end pt-2">
                        <Button
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => setShowOptions(false)}
                        >
                          저장
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 채팅 컨테이너: 메시지 영역 + 입력 영역 분리 */}
            <div className="flex flex-col flex-1 overflow-visible">
              {/* 메시지 영역 (스크롤 가능) */}
              <div className="flex-1 overflow-hidden p-4 md:p-6 pt-16 md:pt-16" style={{ paddingBottom: '96px' }}>
                <div className="max-w-3xl mx-auto space-y-6 h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                  {/* 메시지 렌더링 */}
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-center text-sm mr-2 flex-shrink-0">
                          <ChefHat size={16} />
                        </div>
                      )}
                      <div
                        className={`max-w-md px-5 py-3 rounded-2xl shadow-sm text-base ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-card border border-border/40 rounded-tl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm ml-2 flex-shrink-0">
                          {userProfile.name[0]}
                        </div>
                      )}
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-center text-sm mr-2 mt-3 flex-shrink-0">
                        <ChefHat size={16} />
                      </div>
                      <div className="max-w-md w-full bg-card shadow-soft rounded-2xl rounded-tl-none p-5 border border-border/40">
                        <ChatRecipeCard recipe={generatedRecipe} />
                        <div className="flex justify-between mt-4 gap-3">
                          <Button 
                            variant="outline" 
                            className="text-primary border-primary/30 hover:bg-primary/10 hover:text-primary flex-1"
                            onClick={saveRecipe}
                          >
                            <Save size={16} className="mr-1" />
                            저장
                          </Button>
                          <Link href={`/recipe/${generatedRecipe.id}`} className="flex-1">
                            <Button className="bg-primary hover:bg-primary/90 w-full">자세히 보기</Button>
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-center text-sm mr-2 flex-shrink-0">
                        <ChefHat size={16} />
                      </div>
                      <div className="bg-card p-4 rounded-xl rounded-tl-none shadow-sm border border-border/40">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                          </div>
                          <p className="text-sm text-muted-foreground">답변 생성 중...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              {/* 입력 영역 (고정) */}
              <div className="bg-card/95 backdrop-blur-sm border-t border-border/40 py-4 px-4 z-30">
                <div className="max-w-3xl mx-auto flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="AI 요리사에게 무엇이든 물어보세요! 🍳"
                      className="pl-4 pr-10 py-5 rounded-full bg-muted border-none shadow-sm text-base focus:ring-2 focus:ring-primary/30"
                      disabled={loading}
                      autoComplete="off"
                    />
                    {input && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        onClick={() => setInput('')}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="rounded-full bg-primary hover:bg-primary/90 shadow-md w-12 h-12 flex items-center justify-center p-0"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  건강 정보, 선호하는 음식, 필요한 영양소 등을 자세히 알려주시면 더 맞춤화된 레시피를 제공해드립니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
} 