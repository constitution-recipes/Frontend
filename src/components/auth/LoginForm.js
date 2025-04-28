'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';

/**
 * 로그인 폼 컴포넌트
 */
export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const email = event.target.email.value;
      const password = event.target.password.value;
      await authService.login(email, password);
      router.push('/chatbot');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">환영합니다!</h1>
        <p className="text-muted-foreground text-sm">
          건강한 삶을 위한 첫 걸음, ChiDiet과 함께하세요
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="text-sm animate-shake">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <Link
              href="/auth/reset-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            disabled={isLoading}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button
          type="submit"
          className="w-full font-semibold h-11 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?{' '}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary hover:text-primary/90 transition-colors"
          >
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
} 