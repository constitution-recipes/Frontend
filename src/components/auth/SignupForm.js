'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * 회원가입 폼 컴포넌트
 */
export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    allergies: [],
    healthGoals: [],
    currentHealthStatus: 'average',
    existingConditions: '',
  });

  // 알레르기 옵션 정의
  const allergyOptions = [
    { id: 'none', label: '알레르기 없음' },
    { id: 'peanuts', label: '땅콩' },
    { id: 'treeNuts', label: '견과류' },
    { id: 'milk', label: '우유' },
    { id: 'eggs', label: '계란' },
    { id: 'fish', label: '생선' },
    { id: 'shellfish', label: '조개류' },
    { id: 'wheat', label: '밀가루' },
    { id: 'soy', label: '대두' },
    { id: 'sesame', label: '참깨' },
    { id: 'corn', label: '옥수수' },
    { id: 'fruits', label: '과일류' },
  ];

  // 건강 목표 옵션
  const healthGoalOptions = [
    { value: 'weight_loss', label: '체중 감량' },
    { value: 'muscle_gain', label: '근육 증가' },
    { value: 'cardiovascular_health', label: '심혈관 건강' },
    { value: 'flexibility', label: '유연성 향상' },
    { value: 'energy', label: '에너지 증진' },
  ];

  // 건강 상태 옵션
  const healthStatusOptions = [
    { value: 'poor', label: '나쁨' },
    { value: 'average', label: '보통' },
    { value: 'good', label: '좋음' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergyChange = (allergyId) => {
    setFormData(prev => {
      // '알레르기 없음' 선택 시
      if (allergyId === 'none') {
        return {
          ...prev,
          allergies: prev.allergies.includes('none') ? [] : ['none']
        };
      }

      // 이미 '알레르기 없음'이 선택된 상태면 아무 것도 하지 않음
      if (prev.allergies.includes('none')) {
        return prev;
      }

      // 다른 알레르기 선택/해제
      const newAllergies = prev.allergies.includes(allergyId)
        ? prev.allergies.filter(id => id !== allergyId)
        : [...prev.allergies, allergyId];

      return {
        ...prev,
        allergies: newAllergies
      };
    });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual signup logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      router.push('/dashboard');
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    if (validateStep1()) {
      setError('');
      setStep(2);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {step === 1 ? '회원가입' : '건강 프로필 작성'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {step === 1 
            ? '건강한 삶을 위한 첫 걸음, ChiDiet과 함께하세요'
            : '맞춤형 건강 관리를 위한 정보를 입력해주세요'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="text-sm animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="안전한 비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="010-0000-0000"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="button"
              className="w-full font-semibold h-11 transition-all duration-200"
              onClick={goToNextStep}
              disabled={isLoading}
            >
              다음 단계
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>알레르기 정보</Label>
                <p className="text-sm text-muted-foreground">
                  해당되는 알레르기를 모두 선택해주세요.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((allergy) => (
                  <button
                    key={allergy.id}
                    type="button"
                    onClick={() => handleAllergyChange(allergy.id)}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      "border hover:bg-accent hover:text-accent-foreground",
                      formData.allergies.includes(allergy.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input",
                      allergy.id !== 'none' && formData.allergies.includes('none') && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading || (allergy.id !== 'none' && formData.allergies.includes('none'))}
                  >
                    {allergy.label}
                    {formData.allergies.includes(allergy.id) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* 선택된 알레르기 표시 */}
              {formData.allergies.length > 0 && !formData.allergies.includes('none') && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-2">선택된 알레르기:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map(id => {
                      const allergy = allergyOptions.find(opt => opt.id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1 py-1"
                        >
                          {allergy?.label}
                          <button
                            type="button"
                            onClick={() => handleAllergyChange(id)}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentHealthStatus">현재 건강 상태</Label>
              <select
                id="currentHealthStatus"
                name="currentHealthStatus"
                value={formData.currentHealthStatus}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              >
                <option value="poor">나쁨</option>
                <option value="average">보통</option>
                <option value="good">좋음</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingConditions">현재 질병</Label>
              <Input
                id="existingConditions"
                name="existingConditions"
                type="text"
                placeholder="현재 겪고 있는 질병이 있다면 입력하세요"
                value={formData.existingConditions}
                onChange={handleChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                이전
              </Button>
              <Button
                type="submit"
                className="w-full font-semibold h-11 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? '가입 중...' : '가입 완료'}
              </Button>
            </div>
          </>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:text-primary/90 transition-colors"
          >
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
} 