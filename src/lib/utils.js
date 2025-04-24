import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스 이름을 병합하는 함수
 * clsx 및 tailwind-merge를 활용하여 중복 없이 클래스를 결합
 * @param {...string} inputs - 결합할 클래스 문자열
 * @returns {string} - 병합된 클래스 문자열
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 