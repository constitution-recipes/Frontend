'use client';

import React, { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Search, Clock, Utensils, User } from 'lucide-react';
import Link from 'next/link';

export default function RecommendRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [bodyType, setBodyType] = useState('');
  
  // 필터 상태
  const [filters, setFilters] = useState({
    cookingTime: [0, 60],
    mealType: [],
    ingredients: [],
    difficulty: [],
    bodyTypeMatch: true
  });

  const [activeFilter, setActiveFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    // 백엔드에서 모든 레시피 조회
    fetch(`${API_URL}/api/v1/recipes/get_all_recipes`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setFilteredRecipes(data);
      })
      .catch(err => console.error('레시피 불러오기 실패:', err));
    // 체질 정보 로드
    setBodyType('목양체질');
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, recipes]);

  const applyFilters = () => {
    // recipes가 배열이 아닐 경우 빈 배열로 초기화
    const base = Array.isArray(recipes) ? recipes : [];
    let results = [...base];
    const activeFiltersList = [];
    
    // 검색어 필터링
    if (searchQuery) {
      results = results.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      activeFiltersList.push(`검색: ${searchQuery}`);
    }
    
    // 조리 시간 필터링
    if (filters.cookingTime[1] < 60) {
      results = results.filter(recipe => 
        recipe.cookTime >= filters.cookingTime[0] && 
        recipe.cookTime <= filters.cookingTime[1]
      );
      activeFiltersList.push(`조리시간: ${filters.cookingTime[0]}~${filters.cookingTime[1]}분`);
    }
    
    // 식사 유형 필터링
    if (filters.mealType.length > 0) {
      results = results.filter(recipe => 
        filters.mealType.includes(recipe.mealType)
      );
      activeFiltersList.push(`식사유형: ${filters.mealType.join(', ')}`);
    }
    
    // 재료 필터링
    if (filters.ingredients.length > 0) {
      results = results.filter(recipe => 
        filters.ingredients.some(ing => recipe.ingredients.some(i => i.name.includes(ing)))
      );
      activeFiltersList.push(`재료: ${filters.ingredients.join(', ')}`);
    }
    
    // 난이도 필터링
    if (filters.difficulty.length > 0) {
      results = results.filter(recipe => 
        filters.difficulty.includes(recipe.difficulty)
      );
      activeFiltersList.push(`난이도: ${filters.difficulty.join(', ')}`);
    }
    
    // 체질 맞춤 필터링
    if (filters.bodyTypeMatch && bodyType) {
      results = results.filter(recipe =>
        Array.isArray(recipe.suitableBodyTypes) && recipe.suitableBodyTypes.includes(bodyType)
      );
      activeFiltersList.push(`체질맞춤: ${bodyType}`);
    }
    
    setFilteredRecipes(results);
    setActiveFilters(activeFiltersList);
  };

  const handleRemoveFilter = (filterToRemove) => {
    if (filterToRemove.startsWith('검색:')) {
      setSearchQuery('');
    } else if (filterToRemove.startsWith('조리시간:')) {
      setFilters({...filters, cookingTime: [0, 60]});
    } else if (filterToRemove.startsWith('식사유형:')) {
      setFilters({...filters, mealType: []});
    } else if (filterToRemove.startsWith('재료:')) {
      setFilters({...filters, ingredients: []});
    } else if (filterToRemove.startsWith('난이도:')) {
      setFilters({...filters, difficulty: []});
    } else if (filterToRemove.startsWith('체질맞춤:')) {
      setFilters({...filters, bodyTypeMatch: false});
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      cookingTime: [0, 60],
      mealType: [],
      ingredients: [],
      difficulty: [],
      bodyTypeMatch: true
    });
  };

  const handleCookingTimeChange = (values) => {
    setFilters({...filters, cookingTime: values});
  };

  const handleMealTypeChange = (mealType) => {
    const updatedMealTypes = filters.mealType.includes(mealType)
      ? filters.mealType.filter(m => m !== mealType)
      : [...filters.mealType, mealType];
    setFilters({...filters, mealType: updatedMealTypes});
  };

  const handleIngredientChange = (ingredient) => {
    const updatedIngredients = filters.ingredients.includes(ingredient)
      ? filters.ingredients.filter(i => i !== ingredient)
      : [...filters.ingredients, ingredient];
    setFilters({...filters, ingredients: updatedIngredients});
  };

  const handleDifficultyChange = (difficulty) => {
    const updatedDifficulties = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    setFilters({...filters, difficulty: updatedDifficulties});
  };

  const toggleBodyTypeMatch = () => {
    setFilters({...filters, bodyTypeMatch: !filters.bodyTypeMatch});
  };

  const toggleFilter = () => {
    setActiveFilter(!activeFilter);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 레시피 저장 토글
  const toggleSave = (recipeId) => {
    // 실제 구현에서는 API 호출 등으로 저장/삭제 처리
    console.log(`Toggle save for recipe ${recipeId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <SidebarLayout>
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">맞춤 레시피</h1>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                당신의 체질과 건강 상태에 맞게 개인화된 레시피를 추천해 드립니다. 
                원하는 재료, 조리 시간, 난이도 등을 선택하여 더 정확한 맞춤형 레시피를 찾아보세요.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="레시피 검색..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleFilter}
              >
                <Filter className="h-4 w-4" />
                필터
                <ChevronDown className={`h-4 w-4 transition-transform ${activeFilter ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* 필터 패널 */}
            {activeFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-4 rounded-lg border border-border/40 bg-card"
              >
                <Tabs defaultValue="category">
                  <TabsList className="mb-4">
                    <TabsTrigger value="category">카테고리</TabsTrigger>
                    <TabsTrigger value="time">조리시간</TabsTrigger>
                    <TabsTrigger value="difficulty">난이도</TabsTrigger>
                    <TabsTrigger value="bodyType">체질</TabsTrigger>
                    <TabsTrigger value="ingredients">재료</TabsTrigger>
                  </TabsList>

                  <TabsContent value="category">
                    <div className="flex flex-wrap gap-2">
                      {['전체', '한식', '중식', '일식', '양식', '디저트', '음료'].map((category) => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange('category', category)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.category === category 
                              ? 'bg-primary text-white' 
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="time">
                    <div className="flex flex-wrap gap-2">
                      {['전체', '15분 이내', '30분 이내', '1시간 이내', '1시간 이상'].map((time) => (
                        <button
                          key={time}
                          onClick={() => handleFilterChange('time', time)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.time === time 
                              ? 'bg-primary text-white' 
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="difficulty">
                    <div className="flex flex-wrap gap-2">
                      {['전체', '쉬움', '중간', '어려움'].map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => handleFilterChange('difficulty', difficulty)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.difficulty === difficulty 
                              ? 'bg-primary text-white' 
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="bodyType">
                    <div className="flex flex-wrap gap-2">
                      {['목양체질','목음체질','토양체질','토음체질','금양체질','금음체질','수양체질','수음체질'].map((type) => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange('bodyType', type)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.bodyType === type 
                              ? 'bg-primary text-white' 
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="ingredients">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {['육류', '해산물', '채소', '과일', '유제품', '견과류'].map((ingredient) => (
                        <div key={ingredient} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`ingredient-${ingredient}`}
                            checked={filters.ingredients.includes(ingredient)}
                            onChange={() => handleCheckboxChange('ingredients', ingredient)}
                            className="rounded border-border/40 text-primary focus:ring-primary/30"
                          />
                          <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {/* 활성화된 필터 표시 */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">활성 필터:</span>
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {filter}
                    <button
                      onClick={() => handleRemoveFilter(filter)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* 결과 탭 */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
                <TabsTrigger value="all">전체 ({Array.isArray(filteredRecipes) ? filteredRecipes.length : 0})</TabsTrigger>
                <TabsTrigger value="bodyType">
                  체질 맞춤 ({Array.isArray(filteredRecipes) ? filteredRecipes.filter(r => Array.isArray(r.suitableBodyTypes) && r.suitableBodyTypes.includes(bodyType)).length : 0})
                </TabsTrigger>
                <TabsTrigger value="trending">
                  인기 레시피 ({Array.isArray(filteredRecipes) ? filteredRecipes.filter(r => r.trending).length : 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.length > 0 ? (
                    filteredRecipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} bodyType={bodyType} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <h3 className="text-lg text-gray-500 mb-2">검색 결과가 없습니다.</h3>
                      <p className="text-gray-400 mb-4">다른 검색어나 필터를 사용해보세요.</p>
                      <Button onClick={resetFilters} variant="outline">필터 초기화</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bodyType">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(filteredRecipes) && filteredRecipes.filter(r => Array.isArray(r.suitableBodyTypes) && r.suitableBodyTypes.includes(bodyType)).length > 0 ? (
                    filteredRecipes
                      .filter(r => Array.isArray(r.suitableBodyTypes) && r.suitableBodyTypes.includes(bodyType))
                      .map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} bodyType={bodyType} />
                      ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <h3 className="text-lg text-gray-500 mb-2">체질 맞춤 레시피가 없습니다.</h3>
                      <p className="text-gray-400 mb-4">다른 필터를 사용해보세요.</p>
                      <Button onClick={resetFilters} variant="outline">필터 초기화</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="trending">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(filteredRecipes) && filteredRecipes.filter(r => r.trending).length > 0 ? (
                    filteredRecipes
                      .filter(r => r.trending)
                      .map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} bodyType={bodyType} />
                      ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <h3 className="text-lg text-gray-500 mb-2">인기 레시피가 없습니다.</h3>
                      <p className="text-gray-400 mb-4">다른 필터를 사용해보세요.</p>
                      <Button onClick={resetFilters} variant="outline">필터 초기화</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </SidebarLayout>
  );
} 