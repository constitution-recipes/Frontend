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
import { dummyRecipes } from '@/lib/dummy-data';
import SidebarLayout from '@/components/layout/SidebarLayout';

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

  useEffect(() => {
    // 더미 데이터 로드
    setRecipes(dummyRecipes);
    setFilteredRecipes(dummyRecipes);
    
    // 체질 정보 로드 (실제로는 API 또는 로컬 스토리지에서 가져옴)
    setBodyType('소양체질');
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, recipes]);

  const applyFilters = () => {
    let results = [...recipes];
    const activeFiltersList = [];
    
    // 검색어 필터링
    if (searchTerm) {
      results = results.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      activeFiltersList.push(`검색: ${searchTerm}`);
    }
    
    // 조리 시간 필터링
    if (filters.cookingTime[1] < 60) {
      results = results.filter(recipe => 
        recipe.cookingTime >= filters.cookingTime[0] && 
        recipe.cookingTime <= filters.cookingTime[1]
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
        recipe.suitableBodyTypes.includes(bodyType)
      );
      activeFiltersList.push(`체질맞춤: ${bodyType}`);
    }
    
    setFilteredRecipes(results);
    setActiveFilters(activeFiltersList);
  };

  const handleRemoveFilter = (filterToRemove) => {
    if (filterToRemove.startsWith('검색:')) {
      setSearchTerm('');
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
    setSearchTerm('');
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

  return (
    <SidebarLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">맞춤 레시피</h1>
        
        {/* 검색 및 필터 섹션 */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-2/3">
            <Input
              type="text"
              placeholder="레시피 또는 재료 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10"
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="w-full md:w-1/3 flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Filter size={16} />
                  필터
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>레시피 필터</SheetTitle>
                  <SheetDescription>
                    원하는 조건으로 레시피를 필터링하세요
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  {/* 체질 맞춤 필터 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="body-type-match" className="text-base font-semibold">내 체질 맞춤 레시피</Label>
                      <Checkbox 
                        id="body-type-match" 
                        checked={filters.bodyTypeMatch}
                        onCheckedChange={toggleBodyTypeMatch}
                      />
                    </div>
                    {bodyType && (
                      <p className="text-sm text-gray-500">현재 체질: {bodyType}</p>
                    )}
                  </div>
                  
                  {/* 조리 시간 필터 */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">조리 시간</Label>
                      <p className="text-sm text-gray-500">
                        {filters.cookingTime[0]}분 - {filters.cookingTime[1] === 60 ? '60+' : filters.cookingTime[1]}분
                      </p>
                    </div>
                    <Slider
                      defaultValue={[0, 60]}
                      value={filters.cookingTime}
                      min={0}
                      max={60}
                      step={5}
                      onValueChange={handleCookingTimeChange}
                      className="my-4"
                    />
                  </div>
                  
                  {/* 식사 유형 필터 */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">식사 유형</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['아침', '점심', '저녁', '간식', '디저트'].map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`meal-type-${type}`} 
                            checked={filters.mealType.includes(type)}
                            onCheckedChange={() => handleMealTypeChange(type)}
                          />
                          <Label htmlFor={`meal-type-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 주요 재료 필터 */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">주요 재료</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['쌀', '밀가루', '고기', '생선', '채소', '과일', '유제품'].map(ingredient => (
                        <div key={ingredient} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`ingredient-${ingredient}`} 
                            checked={filters.ingredients.includes(ingredient)}
                            onCheckedChange={() => handleIngredientChange(ingredient)}
                          />
                          <Label htmlFor={`ingredient-${ingredient}`} className="text-sm">{ingredient}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 난이도 필터 */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">난이도</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['쉬움', '보통', '어려움'].map(difficulty => (
                        <div key={difficulty} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`difficulty-${difficulty}`} 
                            checked={filters.difficulty.includes(difficulty)}
                            onCheckedChange={() => handleDifficultyChange(difficulty)}
                          />
                          <Label htmlFor={`difficulty-${difficulty}`} className="text-sm">{difficulty}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={resetFilters} variant="outline" className="w-full">
                    필터 초기화
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button onClick={resetFilters} variant="ghost" size="icon">
              <X size={16} />
            </Button>
          </div>
        </div>
        
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
            <TabsTrigger value="all">전체 ({filteredRecipes.length})</TabsTrigger>
            <TabsTrigger value="bodyType">체질 맞춤 ({filteredRecipes.filter(r => r.suitableBodyTypes.includes(bodyType)).length})</TabsTrigger>
            <TabsTrigger value="trending">인기 레시피 ({filteredRecipes.filter(r => r.trending).length})</TabsTrigger>
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
              {filteredRecipes.filter(r => r.suitableBodyTypes.includes(bodyType)).length > 0 ? (
                filteredRecipes
                  .filter(r => r.suitableBodyTypes.includes(bodyType))
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
              {filteredRecipes.filter(r => r.trending).length > 0 ? (
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
      </div>
    </SidebarLayout>
  );
} 