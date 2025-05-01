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
import { useAuth } from '@/contexts/AuthContext';

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
  // URL 쿼리에서 초기 sessionId 가져오기
  const initialSessionId = searchParams.get('session');
  const [sessionId, setSessionId] = useState(initialSessionId);
  // URL 변경 시 state 동기화
  useEffect(() => {
    setSessionId(searchParams.get('session'));
  }, [searchParams]);

  // 로그인한 사용자 정보
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [useProfile, setUseProfile] = useState(true);
  const [initialState, setInitialState] = useState(true);
  
  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedRecipe]);

  // sessionId가 변경될 때마다 백엔드에서 메시지 로드
  useEffect(() => {
    console.log(`[DEBUG][ChatPage] sessionId changed to: ${sessionId}`);
    if (sessionId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/messages/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          const msgs = data.map(m => ({ role: m.role, content: m.content }));
          console.log(`[DEBUG][ChatPage] Loaded ${msgs.length} messages for session ${sessionId}`);
          setMessages(msgs);
          setInitialState(msgs.length === 0);
          setGeneratedRecipe(null);
        })
        .catch(err => console.error('메시지 조회 오류:', err));
    } else {
      // 새로운 채팅 시작 시 초기 상태
      console.log('[DEBUG][ChatPage] No sessionId, resetting messages');
      setMessages([]);
      setInitialState(true);
      setGeneratedRecipe(null);
    }
  }, [sessionId]);

  // 응답 처리: JSON 레시피 데이터일 경우 카드 렌더링, 아니면 일반 대화
  function processResponse(raw, currentMessages) {
    let rawMessage = raw.trim();
    // 문자열로 한 번 더 인코딩된 경우 언랩
    if (rawMessage.startsWith('"') && rawMessage.endsWith('"')) {
      try { rawMessage = JSON.parse(rawMessage); } catch {}
    }
    // 코드펜스 제거
    const cleaned = rawMessage.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    try {
      const parsed = JSON.parse(cleaned);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length > 0 && (arr[0]?.id || arr[0]?.title)) {
        setGeneratedRecipe(arr[0]);
        return;
      }
    } catch (e) {
      console.error('processResponse JSON parse error:', e, cleaned);
    }
    // JSON이 아니거나 레시피 구조가 아니면 일반 대화로 처리
    setMessages([...currentMessages, { role: 'assistant', content: raw }]);
  }

  // 메시지 제출 처리 (세션 생성 포함)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    console.log(`[DEBUG][ChatPage] handleSubmit called with sessionId: ${sessionId}, user: ${user?.id}`);
    // 세션이 없으면 생성 (첫 메시지도 저장할 수 있게 return 제거)
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      console.log(`[DEBUG][ChatPage] Creating new session for user: ${user?.id}`);
      try {
        const sessRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/session`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: user.id, title: '' }),
          }
        );
        if (!sessRes.ok) throw new Error('세션 생성 실패');
        const sessData = await sessRes.json();
        currentSessionId = sessData.id;
        console.log(`[DEBUG][ChatPage] New session created: ${currentSessionId}`);
        // URL 히스토리만 교체하여 state 동기화
        window.history.replaceState(null, '', `/chatbot?session=${currentSessionId}`);
        setSessionId(currentSessionId);
      } catch (err) {
        console.error('세션 생성 오류:', err);
        return;
      }
    }

    const userMessage = { role: 'user', content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setLoading(true);
    setGeneratedRecipe(null);

    // 입력 전 상태에서 메시지 전송 시 상태 변경
    if (initialState) setInitialState(false);

    console.log('handleSubmit payload:', { session_id: currentSessionId, messages: updated });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ session_id: currentSessionId, messages: updated }),
        }
      );
      console.log('handleSubmit response raw:', res);
      if (!res.ok) throw new Error('API error');
      const { message: rawMessage } = await res.json();
      console.log('handleSubmit response json:', rawMessage);
      processResponse(rawMessage, updated);
    } catch (err) {
      setMessages([
        ...updated,
        { role: 'assistant', content: '오류가 발생했습니다. 나중에 다시 시도해주세요.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 레시피 저장
  const saveRecipe = async () => {
    if (!generatedRecipe) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/recipes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedRecipe),
      });
      if (!res.ok) throw new Error('레시피 저장 실패');
      const saved = await res.json();
      setGeneratedRecipe(prev => ({ ...prev, id: saved.id }));
      alert('레시피가 저장되었습니다!');
    } catch (error) {
      console.error('saveRecipe error:', error);
      alert('레시피 저장 중 오류가 발생했습니다.');
    }
  };

  // 기능별 챗봇 호출 함수
  const handleFeatureClick = async (featureKey, featureTitle) => {
    const sysMsg = { role: 'system', content: `${featureTitle} 기능이 선택되었습니다.` };
    const updatedMsgs = [...messages, sysMsg];
    setMessages(updatedMsgs);
    setLoading(true);
    setGeneratedRecipe(null);

    try {
      console.log('handleFeatureClick payload:', { session_id: sessionId, feature: featureKey, messages: updatedMsgs });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, feature: featureKey, messages: updatedMsgs }),
        }
      );
      console.log('handleFeatureClick response raw:', res);
      if (!res.ok) throw new Error('API error');
      const { message: rawMessage } = await res.json();
      console.log('handleFeatureClick response json:', rawMessage);
      processResponse(rawMessage, updatedMsgs);
    } catch (err) {
      setMessages([...updatedMsgs, { role: 'assistant', content: '오류가 발생했습니다. 나중에 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  // 4가지 기능 카드 데이터
  const featureCards = [
    {
      title: '레시피 변경',
      description: '알레르기·선호·상황에 맞춰 레시피 커스터마이즈',
      icon: <ChefHat className="w-6 h-6 text-primary" strokeWidth={1.5} />,
      onClick: () => handleFeatureClick('customize', '레시피 커스터마이즈'),
    },
    {
      title: '다이어트 플랜',
      description: '건강 목표에 맞는 식단 추천',
      icon: <BarChart className="w-6 h-6 text-blue-600" strokeWidth={1.5} />,
      onClick: () => handleFeatureClick('diet', '다이어트 플랜'),
    },
    {
      title: '이벤트 메뉴',
      description: '파티·명절 등 이벤트 메뉴 추천',
      icon: <Sparkles className="w-6 h-6 text-amber-600" strokeWidth={1.5} />,
      onClick: () => handleFeatureClick('event', '이벤트 메뉴'),
    },
    {
      title: '난이도 조정',
      description: '요리 난이도에 맞춘 레시피 제공',
      icon: <Utensils className="w-6 h-6 text-purple-600" strokeWidth={1.5} />,
      onClick: () => handleFeatureClick('difficulty', '난이도 조정'),
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
      <div className="flex flex-col h-full min-h-screen w-full bg-gradient-primary relative">
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
          <div className="flex flex-col h-full w-full flex-1 min-h-0 pt-16">
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

            {/* 채팅+입력 전체 영역 */}
            <div className="flex flex-col h-full min-h-0">
              {/* 채팅 메시지 영역 (스크롤) */}
              <div className="grow overflow-y-auto min-h-0 w-full px-4 md:px-6 pt-4" style={{ paddingBottom: '120px' }}>
                <div className="max-w-3xl mx-auto">
                  <div className="space-y-6">
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
                            {generatedRecipe.id ? (
                            <Link href={`/recipe/${generatedRecipe.id}`} className="flex-1">
                              <Button className="bg-primary hover:bg-primary/90 w-full">자세히 보기</Button>
                            </Link>
                            ) : (
                              <Button className="bg-primary/30 w-full" disabled>DB 저장 중...</Button>
                            )}
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

                    {/* 자동 스크롤용 더미 */}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* 입력 영역 (항상 화면 하단 고정) */}
              <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-card/95 backdrop-blur-sm border-t border-border/40 py-4 px-4 z-40 shadow-[0_-2px_10px_0_rgba(0,0,0,0.05)]">
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
          </div>
        )}
      </div>
    </SidebarLayout>
  );
} 