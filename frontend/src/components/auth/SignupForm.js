'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/utils/validation';
import { FormInput } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FormDropdown } from '@/components/common/Dropdown';
import { MultiSelect } from '@/components/common/MultiSelect';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

/**
 * 회원가입 폼 컴포넌트
 */
export function SignupForm() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // 알레르기 옵션
  const allergyOptions = [
    { value: 'peanuts', label: '땅콩' },
    { value: 'dairy', label: '유제품' },
    { value: 'eggs', label: '계란' },
    { value: 'wheat', label: '밀가루' },
    { value: 'soy', label: '대두' },
    { value: 'fish', label: '생선' },
    { value: 'shellfish', label: '조개류' },
    { value: 'nuts', label: '견과류' },
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      allergies: [],
      healthGoals: [],
      currentHealthStatus: 'average',
      existingConditions: '',
    },
    mode: 'onChange',
  });

  /**
   * 회원가입 폼 제출 핸들러
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      // 배열 형태의 데이터를 문자열로 변환
      const userData = {
        ...data,
        allergies: data.allergies.join(','),
        healthGoals: data.healthGoals.join(','),
      };

      await signup(userData);
    } catch (error) {
      setError(error.response?.data?.detail || '회원가입에 실패했습니다. 다시 시도해주세요.');
      setStep(1); // 오류 발생 시 첫 단계로 돌아가기
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 다중 선택 값 변경 핸들러
   */
  const handleMultiSelectChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };

  /**
   * 단일 선택 값 변경 핸들러
   */
  const handleSelectChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };

  /**
   * 다음 단계로 이동
   */
  const goToNextStep = () => {
    setStep(step + 1);
  };

  /**
   * 이전 단계로 이동
   */
  const goToPrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="text-gray-500">
            {step === 1 && '기본 정보를 입력해주세요'}
            {step === 2 && '건강 프로필을 완성해주세요'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 단계 1: 기본 정보 */}
          {step === 1 && (
            <>
              <FormInput
                label="이름"
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                error={errors.name?.message}
                disabled={isLoading}
                {...register('name')}
              />

              <FormInput
                label="이메일"
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                error={errors.email?.message}
                disabled={isLoading}
                {...register('email')}
              />

              <FormInput
                label="비밀번호"
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요 (최소 6자)"
                error={errors.password?.message}
                disabled={isLoading}
                {...register('password')}
              />

              <FormInput
                label="전화번호"
                id="phoneNumber"
                type="tel"
                placeholder="전화번호를 입력하세요"
                error={errors.phoneNumber?.message}
                disabled={isLoading}
                {...register('phoneNumber')}
              />

              <Button
                type="button"
                className="w-full h-11 bg-teal-500 hover:bg-teal-600"
                disabled={isLoading || Object.keys(errors).some(key => ['name', 'email', 'password', 'phoneNumber'].includes(key))}
                onClick={goToNextStep}
              >
                다음
              </Button>
            </>
          )}

          {/* 단계 2: 건강 프로필 */}
          {step === 2 && (
            <>
              <FormDropdown
                label="현재 건강 상태"
                id="currentHealthStatus"
                options={healthStatusOptions}
                value={watch('currentHealthStatus')}
                onChange={(value) => handleSelectChange('currentHealthStatus', value)}
                placeholder="현재 건강 상태를 선택하세요"
                error={errors.currentHealthStatus?.message}
              />

              <MultiSelect
                label="알레르기 정보"
                id="allergies"
                options={allergyOptions}
                value={watch('allergies')}
                onChange={(value) => handleMultiSelectChange('allergies', value)}
                error={errors.allergies?.message}
              />

              <FormInput
                label="현재 질병"
                id="existingConditions"
                type="text"
                placeholder="현재 겪고 있는 질병이 있다면 입력하세요"
                error={errors.existingConditions?.message}
                disabled={isLoading}
                {...register('existingConditions')}
              />

              <MultiSelect
                label="건강 목표"
                id="healthGoals"
                options={healthGoalOptions}
                value={watch('healthGoals')}
                onChange={(value) => handleMultiSelectChange('healthGoals', value)}
                error={errors.healthGoals?.message}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  className="w-full h-11"
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={isLoading}
                >
                  이전
                </Button>
                <Button
                  type="submit"
                  className="w-full h-11 bg-teal-500 hover:bg-teal-600"
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? '가입 중...' : '가입하기'}
                </Button>
              </div>
            </>
          )}
        </form>

        <div className="text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-teal-600 font-semibold hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
} 