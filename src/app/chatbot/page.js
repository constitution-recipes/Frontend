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
  Sparkles
} from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

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

  // 새 채팅/세션 변경 시 메시지 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const found = sessions.find(s => s.id === sessionId);
      setMessages(found?.messages || [
        { role: 'assistant', content: '안녕하세요! AI 레시피 어시스턴트입니다. 어떤 레시피를 찾고 계신가요? 원하는 음식, 재료, 식이 제한 등을 자유롭게 말씀해주세요.' }
      ]);
      setGeneratedRecipe(null);
      setInitialState(found?.messages?.length === 1 && found?.messages[0].role === 'assistant');
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
      title: '문서 작성', 
      description: '문서, 보고서, 이메일 등 다양한 글을 작성해보세요.', 
      icon: <FileText className="w-6 h-6 text-secondary" strokeWidth={1.5} />, 
      onClick: () => setInput('문서 작성 도와줘'), 
      bgClass: 'from-secondary/10 to-secondary/5'
    },
    { 
      title: '문서 번역', 
      description: '문서를 다양한 언어로 번역해보세요.', 
      icon: <ArrowLeft className="w-6 h-6 text-accent" strokeWidth={1.5} />, 
      onClick: () => setInput('문서 번역'), 
      bgClass: 'from-accent/10 to-accent/5'
    },
    { 
      title: '영양 분석', 
      description: '식단의 영양 정보를 분석해보세요.', 
      icon: <BarChart className="w-6 h-6 text-primary" strokeWidth={1.5} />, 
      onClick: () => setInput('영양 분석'), 
      bgClass: 'from-primary/10 to-primary/5'
    },
  ];

  return (
    <SidebarLayout>
      <div className="flex flex-col flex-1 overflow-hidden min-h-screen bg-gradient-primary relative">
        <AnimatePresence>
          {initialState && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: initialState ? 1 : 0, y: initialState ? 0 : -50 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-screen absolute inset-0 z-20 bg-gradient-hero"
            >
              <div className="w-full max-w-md mx-auto flex flex-col items-center gap-10 px-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center mb-2 rounded-full bg-primary/10 p-2">
                    <ChefHat className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                    AI 요리사에게 <span className="text-gradient">무엇이든</span> 물어보세요!
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    개인 맞춤형 레시피와 식단 추천을 받아보세요
                  </p>
                </motion.div>
                
                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  onSubmit={handleSubmit} 
                  className="w-full flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="예) 오늘 저녁 추천해줘, 다이어트 식단 알려줘"
                      className="pl-5 pr-10 py-6 rounded-full bg-muted border-none shadow-sm text-base focus:ring-2 focus:ring-primary/30"
                      autoFocus
                      autoComplete="off"
                    />
                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!input.trim()} 
                    className="rounded-full bg-primary hover:bg-primary/90 shadow-md w-12 h-12 flex items-center justify-center p-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </motion.form>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                >
                  {featureCards.map((card, idx) => (
                    <motion.button
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                      onClick={card.onClick}
                      className="flex flex-col items-start p-5 bg-gradient-to-br bg-card rounded-xl shadow-soft hover:shadow-md border border-border/40 transition-all h-32 group text-left"
                      type="button"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${card.bgClass} mb-3`}>{card.icon}</div>
                      <div className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">{card.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{card.description}</div>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 옵션 FAB 버튼 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          className="fixed z-40 bottom-24 right-6 md:bottom-8 md:right-8 group"
        >
          <button
            onClick={() => setShowOptions(true)}
            className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30"
            aria-label="옵션"
          >
            <Settings size={24} className="text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-16 bg-foreground/80 text-primary-foreground text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none whitespace-nowrap">
            옵션
          </span>
        </motion.div>

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

        {/* 채팅 영역 */}
        <div className={`flex-1 overflow-auto p-4 md:p-6 pt-12 md:pt-16 transition-opacity duration-500 ${initialState ? 'opacity-0' : 'opacity-100'}`}>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 pb-24">
              {/* 메시지들 */}
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

              {/* 자동 스크롤을 위한 더미 엘리먼트 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className={`bg-card/95 backdrop-blur-sm border-t border-border/40 py-4 px-4 sticky bottom-0 z-30 shadow-[0_-2px_10px_0_rgba(0,0,0,0.03)] transition-transform duration-500 ${initialState ? 'translate-y-full' : 'translate-y-0'}`}>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
            </form>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              건강 정보, 선호하는 음식, 필요한 영양소 등을 자세히 알려주시면 더 맞춤화된 레시피를 제공해드립니다.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
} 