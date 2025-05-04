'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConstitutionCard from '@/components/common/ConstitutionCard';
import { XCircle, Send, Leaf, ArrowRight, CornerDownRight, AlertCircle, ChefHat } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ConstitutionPage() {
  const initialFetchRef = useRef(false);
  const token = authService.getToken();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progression, setProgression] = useState(0);
  const [error, setError] = useState(null);
  const [showRecipeButton, setShowRecipeButton] = useState(false);
  const [constitution, setConstitution] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (authLoading || !token || initialFetchRef.current) return;
    initialFetchRef.current = true;
    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/constitution`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          credentials: 'include',
          body: JSON.stringify({ answers: [] }),
        });
        if (res.status === 401) {
          console.error('초기 질문 인증 실패:', res.status);
          setError({
            title: '인증 오류',
            message: '로그인이 필요한 서비스입니다. 다시 로그인해주세요.',
            code: 401
          });
          router.push('/auth/login');
          return;
        }
        if (!res.ok) {
          console.error('초기 질문 API 에러 코드:', res.status);
          setError({
            title: '서버 오류',
            message: '체질 진단 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
            code: res.status
          });
          setMessages([{ role: 'assistant', type: 'text', content: '초기 질문을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.' }]);
          return;
        }
        const data = await res.json();
        if (!data.can_diagnose) {
          setMessages([{ role: 'assistant', type: 'text', content: data.next_question || '' }]);
        }
      } catch (err) {
        console.error('초기 질문 로드 오류:', err);
        setError({
          title: '연결 오류',
          message: '체질 진단 서비스에 연결할 수 없습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
          code: 'NETWORK_ERROR'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [token, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // 진행률 업데이트: 질문마다 12.5%씩 증가, 최대 100%
    if (qaList.length > 0) {
      const newProgression = Math.min(qaList.length * 12.5, 100);
      setProgression(newProgression);
    }
  }, [qaList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', type: 'text', content: input };
    setMessages((prev) => [...prev, userMsg]);
    
    const lastQuestion = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';
    const newQa = { question: lastQuestion, answer: input };
    const newQaList = [...qaList, newQa];
    
    setQaList(newQaList);
    setInput('');
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/constitution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ answers: newQaList }),
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data = await res.json();
      
      if (data.can_diagnose) {
        setConstitution(data.constitution);
        setShowRecipeButton(true);
        setMessages((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            type: 'text', 
            content: `진단이 완료되었습니다! 당신의 체질은 ${data.constitution}체질입니다. 이제 당신의 체질에 맞는 맞춤형 레시피를 확인하거나 새롭게 생성해보세요.` 
          },
          { role: 'assistant', type: 'card', constitution: data.constitution }
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', type: 'text', content: data.next_question || '' }]);
      }
    } catch (err) {
      console.error('에러:', err);
      setError({
        title: '진단 오류',
        message: '체질 진단 과정에서 오류가 발생했습니다. 다시 시도해주세요.',
        code: err.message || 'UNKNOWN_ERROR'
      });
      setMessages((prev) => [...prev, { role: 'assistant', type: 'text', content: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipe = () => {
    // 체질 정보를 쿼리 파라미터로 전달
    if (constitution) {
      router.push(`/chatbot`);
    }
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-background to-primary/5 min-h-screen relative">
        <div className="max-w-4xl mx-auto w-full pt-6 px-4 md:px-8">
          {/* 에러 알림 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertTitle className="font-semibold">{error.title}</AlertTitle>
                  <AlertDescription className="text-sm">
                    {error.message}
                    {error.code && (
                      <span className="block mt-1 text-xs opacity-70">
                        오류 코드: {error.code}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-primary to-blue-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">체질 진단</h1>
                  <p className="text-sm text-muted-foreground">한의학 원리 기반 8체질 진단</p>
                </div>
              </div>
              
              {!messages.length && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <p className="text-muted-foreground">
                    몇 가지 질문에 답변하여 당신의 체질을 진단해 드립니다. 정확한 진단을 위해 솔직하게 응답해주세요.
                  </p>
                  
                  {/* 진행 상태 표시 */}
                  <div className="mt-4 mb-6">
                    <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progression}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>질문 {qaList.length}/8</span>
                      <span>{progression.toFixed(0)}% 완료</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col h-full w-full flex-1 min-h-0">
          <div className="grow overflow-y-auto w-full px-4 md:px-6 pt-4 pb-32">
            <div className="space-y-6 max-w-3xl mx-auto">
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  if (msg.type === 'card') {
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center px-4 md:px-6 mb-6"
                      >
                        <ConstitutionCard
                          constitution={msg.constitution}
                        />
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role !== 'user' && (
                        <div className="flex items-center mr-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      <div
                        className={`max-w-md px-5 py-3 rounded-2xl shadow-sm text-base leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-white border border-border/40 rounded-tl-none'
                        }`}
                      >
                        {msg.role !== 'user' && msg.role === 'assistant' && (
                          <p className="text-xs text-primary mb-1 font-medium tracking-wide">진단 도우미</p>
                        )}
                        {msg.content}
                        
                        {/* 레시피 생성 버튼 (체질 진단 완료 메시지 바로 위에 추가) */}
                        {showRecipeButton && idx === messages.length - 2 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4"
                          >
                            <Button 
                              onClick={handleCreateRecipe}
                              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-primary hover:opacity-90 gap-2"
                            >
                              <ChefHat className="h-4 w-4" />
                              나만의 레시피 생성하기
                            </Button>
                          </motion.div>
                        )}
                      </div>
                      
                      {msg.role === 'user' && (
                        <div className="flex items-center ml-2">
                          <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center mr-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm border border-border/40">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-sm border-t border-border/40 py-4 px-4 z-40 shadow-[0_-2px_10px_0_rgba(0,0,0,0.05)]">
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex items-center gap-2 max-w-3xl mx-auto"
            >
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="질문에 대한 답변을 입력하세요..."
                  className="pl-5 pr-10 py-6 rounded-full bg-muted border-none shadow-sm text-base focus:ring-2 focus:ring-primary/30"
                  disabled={loading || showRecipeButton}
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
                disabled={loading || !input.trim() || showRecipeButton}
                className="rounded-full bg-primary hover:bg-primary/90 shadow-md w-14 h-14 flex items-center justify-center p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.form>
            
            <div className="mt-3 flex justify-center items-center space-x-2 text-xs text-muted-foreground">
              {showRecipeButton ? (
                <p className="flex items-center">
                  <ChefHat className="h-3 w-3 mr-1" />
                  체질 진단이 완료되었습니다. 맞춤형 레시피를 생성해보세요!
                </p>
              ) : (
                <p className="flex items-center">
                  <CornerDownRight className="h-3 w-3 mr-1" />
                  체질 진단을 위해 질문에 솔직하게 답변해주세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
