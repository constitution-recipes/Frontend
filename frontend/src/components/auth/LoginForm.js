'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/utils/validation';
import { FormInput } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

/**
 * 로그인 폼 컴포넌트
 */
export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * 로그인 폼 제출 핸들러
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password);
    } catch (error) {
      setError(error.response?.data?.detail || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/30 to-background">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl px-8 py-10 space-y-8 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              로그인
            </h1>
            <p className="text-center text-base text-muted-foreground">
              개인 맞춤형 건강 여정을 시작하세요
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="이메일"
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              error={errors.email?.message}
              disabled={isLoading}
              className="h-12"
              {...register('email')}
            />

            <FormInput
              label="비밀번호"
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              error={errors.password?.message}
              disabled={isLoading}
              className="h-12"
              {...register('password')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">
                  또는
                </span>
              </div>
            </div>

            <div className="space-y-3 text-center text-sm">
              <Link 
                href="/auth/forgot-password" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
              <div>
                계정이 없으신가요?{' '}
                <Link 
                  href="/auth/signup" 
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 