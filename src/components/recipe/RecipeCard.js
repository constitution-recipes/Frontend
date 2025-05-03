'use client';

import Link from 'next/link';
import { Clock, Star, ChefHat, Tag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addBookmark, removeBookmark } from '@/lib/utils/bookmarkApi';

export function RecipeCard({ recipe }) {
  const { id, title, description, difficulty, cookTime, image, rating, suitableFor, tags } = recipe;
  const { isAuthenticated } = useAuth();
  const accessToken = typeof window !== 'undefined' ? require('@/lib/services/authService').authService.getToken() : null;
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 마운트 시 localStorage에서 저장 여부 확인
  useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  //   setIsSaved(saved.includes(id));
  // }, [id]);
    if (isAuthenticated && accessToken) {
      // 서버에서 북마크 목록을 받아와서 체크하는 로직을 추가할 수도 있음
      // 여기서는 단순히 localStorage fallback 유지
      // 실제로는 상위에서 북마크 목록을 prop으로 내려주는 게 더 좋음
    } else {
      const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      setIsSaved(saved.includes(id));
    }
  }, [id, isAuthenticated, accessToken]);
  
  // 하트 클릭 시 저장/해제
  
  // const handleSave = (e) => {
  //   e.preventDefault(); // 클릭 이벤트가 Link로 전파되는 것을 방지
  //   const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  //   let updated;
  //   if (isSaved) {
  //     updated = saved.filter(savedId => savedId !== id);
  //   } else {
  //     updated = [...saved, id];
  //   }
  //   localStorage.setItem('savedRecipes', JSON.stringify(updated));
  //   setIsSaved(!isSaved);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !accessToken) {
      // 비로그인 fallback: localStorage
      const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      let updated;
      if (isSaved) {
        updated = saved.filter(savedId => savedId !== id);
      } else {
        updated = [...saved, id];
      }
      localStorage.setItem('savedRecipes', JSON.stringify(updated));
      setIsSaved(!isSaved);
      return;
    }
    setLoading(true);
    try {
      if (isSaved) {
        await removeBookmark(id, accessToken);
      } else {
        await addBookmark(id, accessToken);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      alert(err.message || '북마크 처리 중 오류 발생');
    }
    setLoading(false);
  };
  
  // 난이도에 따른 색상 설정
  const difficultyColor = {
    '쉬움': 'bg-green-100 text-green-800',
    '중간': 'bg-yellow-100 text-yellow-800',
    '어려움': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* 이미지 영역 */}
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        <button 
          onClick={handleSave}
          className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full transition-colors hover:bg-white"
        >
          <Heart size={18} className={isSaved ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"} />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
              +{tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* 내용 영역 */}
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', difficultyColor[difficulty] || 'bg-gray-100 text-gray-800')}>
            {difficulty}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            조리 {cookTime}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <ChefHat size={14} className="mr-1" />
            <span>조리 {cookTime}</span>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400" />
            <span className="text-gray-700 ml-1 font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <Tag size={14} className="mr-1" />
            <span className="line-clamp-1">{suitableFor}</span>
          </div>
        </div>

        <Link href={`/recipe/${id}`}>
          <Button className="w-full bg-teal-500 hover:bg-teal-600">레시피 보기</Button>
        </Link>
      </div>
    </div>
  );
} 