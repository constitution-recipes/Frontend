'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ConstitutionCard from '@/components/common/ConstitutionCard';
import { XCircle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/services/authService';

export default function ConstitutionPage() {
  const token = authService.getToken();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [constitutionResult, setConstitutionResult] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (authLoading || !token) return;
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/constitution`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          credentials: 'include',
          body: JSON.stringify({ answers: [] }),
        });
        if (res.status === 401) {
          console.error('초기 질문 인증 실패:', res.status);
          router.push('/auth/login');
          return;
        }
        if (!res.ok) {
          console.error('초기 질문 API 에러 코드:', res.status);
          setMessages([{ role: 'assistant', content: '초기 질문을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.' }]);
          return;
        }
        const data = await res.json();
        if (!data.can_diagnose) {
          setMessages([{ role: 'assistant', content: data.next_question || '' }]);
        } else {
          setConstitutionResult({
            constitution: data.constitution,
            reason: data.reason,
            confidence: data.confidence,
          });
        }
      } catch (err) {
        console.error('초기 질문 로드 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [token, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, constitutionResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    const lastQuestion = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';
    const newQa = { question: lastQuestion, answer: input };
    const newQaList = [...qaList, newQa];
    setQaList(newQaList);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/constitution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ answers: newQaList }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.can_diagnose) {
        setConstitutionResult({
          constitution: data.constitution,
          reason: data.reason,
          confidence: data.confidence,
        });
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.next_question || '' }]);
      }
    } catch (err) {
      console.error('에러:', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full w-full bg-gradient-primary min-h-screen relative">
        {constitutionResult ? (
          <div className="pt-16 px-4 md:px-6 space-y-4">
            <ConstitutionCard
              constitution={constitutionResult.constitution}
              reason={constitutionResult.reason}
              confidence={constitutionResult.confidence}
            />
            <div className="flex justify-center">
              <Button onClick={() => router.push('/chatbot')} className="bg-primary">
                챗봇 시작
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full flex-1 min-h-0 pt-16">
            <div className="grow overflow-y-auto w-full px-4 md:px-6 pt-4 pb-32">
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-md px-5 py-3 rounded-2xl shadow-sm text-base ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-card border border-border/40 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-card p-4 rounded-xl rounded-tl-none shadow-sm border border-border/40">
                      <p className="text-sm text-muted-foreground">응답 생성 중...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-card/95 backdrop-blur-sm border-t border-border/40 py-4 px-4 z-40 shadow-[0_-2px_10px_0_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
                <div className="relative flex-1">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="AI에게 질문을 입력하세요..."
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
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                체질 진단을 위해 질문에 답변해주세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
