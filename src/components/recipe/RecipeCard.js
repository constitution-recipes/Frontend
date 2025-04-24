import Link from 'next/link';
import Image from 'next/image';
import { Clock, Star, ChefHat, Tag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function RecipeCard({ recipe }) {
  const { id, title, description, difficulty, prepTime, cookTime, image, rating, suitableFor, tags } = recipe;
  
  // 난이도에 따른 색상 설정
  const difficultyColor = {
    '쉬움': 'bg-green-100 text-green-800',
    '중간': 'bg-yellow-100 text-yellow-800',
    '어려움': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* 이미지 영역 */}
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full transition-colors hover:bg-white">
          <Heart size={18} className="text-gray-600 hover:text-red-500" />
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
            조리 {parseInt(cookTime) + parseInt(prepTime.replace(/\D/g, ''))}분
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center mr-3">
            <Clock size={14} className="mr-1" />
            <span>준비 {prepTime}</span>
          </div>
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