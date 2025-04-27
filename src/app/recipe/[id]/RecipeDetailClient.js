'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, ChefHat, Star, ArrowLeft, Heart, Share2, Users, Award, CheckCircle } from 'lucide-react';

export default function RecipeDetailClient({ recipe }) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // 마운트 시 localStorage에서 저장 여부 확인
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setIsSaved(saved.includes(recipe.id));
  }, [recipe.id]);

  // 하트 클릭 시 저장/해제
  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    let updated;
    if (isSaved) {
      updated = saved.filter(id => id !== recipe.id);
    } else {
      updated = [...saved, recipe.id];
    }
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  // 공유 버튼 클릭 시 URL 복사
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const difficultyColor = {
    '쉬움': 'bg-green-100 text-green-800',
    '중간': 'bg-yellow-100 text-yellow-800',
    '어려움': 'bg-red-100 text-red-800',
  };
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Link href="/recommend_recipes" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6">
        <ArrowLeft size={18} className="mr-1" /> 레시피 목록으로 돌아가기
      </Link>
      {/* 레시피 헤더 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative h-72 sm:h-96">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleSave}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            >
              <Heart size={20} className={isSaved ? "text-red-500 fill-red-500" : "text-gray-700"} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors relative"
            >
              <Share2 size={20} className="text-gray-700" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs rounded px-2 py-1 shadow">URL 복사됨!</span>
              )}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyColor[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            {recipe.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-6">{recipe.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Clock size={24} className="text-teal-500 mb-1" />
              <span className="text-xs text-gray-500">준비 시간</span>
              <span className="font-medium">{recipe.prepTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <ChefHat size={24} className="text-teal-500 mb-1" />
              <span className="text-xs text-gray-500">조리 시간</span>
              <span className="font-medium">{recipe.cookTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Users size={24} className="text-teal-500 mb-1" />
              <span className="text-xs text-gray-500">인분</span>
              <span className="font-medium">{recipe.servings}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Star size={24} className="text-yellow-500 mb-1" />
              <span className="text-xs text-gray-500">평점</span>
              <span className="font-medium">{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Award size={20} className="text-teal-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">체질 맞춤 정보</h2>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-gray-700">{recipe.suitableFor}</p>
              <div className="flex items-center gap-2 mt-3 text-teal-700">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">이 레시피가 당신의 체질에 이로운 이유: <span className="font-normal text-gray-700">{recipe.suitableFor}에 도움을 줄 수 있는 재료와 조리법이 사용되었습니다.</span></span>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">필요한 재료</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {recipe.ingredients.map((item, idx) => (
                <div key={idx} className="flex items-center py-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">조리 방법</h2>
            <div className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-semibold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {recipe.nutritionalInfo && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">영양 정보</h2>
              <p className="text-gray-700">{recipe.nutritionalInfo}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 