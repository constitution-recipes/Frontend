'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, ChefHat, Star, ArrowLeft, Heart, Share2, Users, Award, CheckCircle, Leaf, ShoppingBag, Calendar, Flame, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RecipeDetailClient({ id }) {
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const router = useRouter();

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${API_URL}/api/v1/recipes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setRecipe(data))
      .catch(() => router.replace('/404'))
      .finally(() => setLoading(false));
  }, [id, router]);

  // 레시피 로드 후 localStorage 저장 상태 확인 (항상 같은 훅 순서)
  useEffect(() => {
    if (recipe) {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setIsSaved(saved.includes(recipe.id));
    }
  }, [recipe]);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-3xl opacity-50"></div>
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden relative z-10">
            <CardContent className="p-0">
              <Skeleton className="h-80 sm:h-96 w-full rounded-t-xl" />
              <div className="p-8 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (!recipe) return null;

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 relative">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10"
      >
        <Link 
          href="/recommend_recipes" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">레시피 목록으로 돌아가기</span>
        </Link>
        
        {/* 레시피 카드 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-3xl opacity-70"></div>
          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden relative z-10">
            <CardContent className="p-0">
              {/* 이미지 영역 */}
              <div className="relative h-80 sm:h-96">
                <img
                  src={imgError ? 'https://placekitten.com/1200/800' : recipe.image}
                  alt={recipe.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* 버튼 영역 */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <motion.button 
                    onClick={handleSave}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                  >
                    <Heart 
                      size={22} 
                      className={isSaved ? "text-rose-500 fill-rose-500" : "text-gray-700"}
                    />
                    <AnimatePresence>
                      {isSaved && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute inset-0 bg-rose-500/20 rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <motion.button 
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 relative"
                  >
                    <Share2 size={22} className="text-gray-700" />
                    <AnimatePresence>
                      {copied && (
                        <motion.span 
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-medium rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg"
                        >
                          URL 복사됨!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                
                {/* 제목 영역 (이미지 위) */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-2 flex-wrap">
                      {recipe.tags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border-white/10 py-1 px-3 text-sm font-medium tracking-wide shadow-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight text-shadow-lg leading-tight">
                      {recipe.title}
                    </h1>
                    <div className="flex items-center flex-wrap gap-4 text-white/90">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400/20 backdrop-blur-sm mr-3">
                          <Star size={16} className="text-yellow-400" fill="currentColor" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{recipe.rating.toFixed(1)}</div>
                          <div className="text-xs text-white/70">평점</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm mr-3">
                          <Clock size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{recipe.cookTime}</div>
                          <div className="text-xs text-white/70">조리 시간</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm mr-3">
                          <ChefHat size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{recipe.difficulty}</div>
                          <div className="text-xs text-white/70">난이도</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* 내용 영역 */}
              <div className="p-8 sm:p-10">
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">{recipe.description}</p>
                
                {/* 정보 카드 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12">
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10 h-full">
                      <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Clock size={22} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">조리 시간</span>
                        <span className="font-semibold text-lg mt-1">{recipe.cookTime}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10 h-full">
                      <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Users size={22} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">인분</span>
                        <span className="font-semibold text-lg mt-1">{recipe.servings}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card className="border-none shadow-md bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 h-full">
                      <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-3">
                          <Star size={22} className="text-yellow-500" />
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">평점</span>
                        <span className="font-semibold text-lg mt-1">{recipe.rating.toFixed(1)}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10 h-full">
                      <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <ChefHat size={22} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">난이도</span>
                        <span className="font-semibold text-lg mt-1">{recipe.difficulty}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                
                {/* 체질 맞춤 정보 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-12"
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 via-primary/5 to-secondary/5 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <CardContent className="p-8 relative">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mr-4">
                          <Leaf size={24} className="text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">체질 맞춤 정보</h2>
                          <p className="text-sm text-muted-foreground mt-1">당신의 체질에 맞춘 레시피입니다</p>
                        </div>
                      </div>
                      
                      <p className="text-foreground text-lg mb-6 leading-relaxed border-l-4 border-primary/30 pl-4 py-2 bg-primary/5 rounded-sm">
                        {recipe.suitableFor}
                      </p>
                      
                      <div className="flex items-start p-5 bg-white rounded-2xl shadow-sm border border-primary/10">
                        <div className="mt-1 mr-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle size={20} className="text-primary" />
                          </div>
                        </div>
                        <div>
                          <span className="text-base font-semibold">이 레시피가 당신의 체질에 이로운 이유</span>
                          <p className="text-muted-foreground mt-2 leading-relaxed">
                            {recipe.reason || "체질에 맞는 재료와 조리법이 사용되었습니다. 체질 특성을 고려한 영양소 균형과 조리 방법으로 건강에 도움을 줍니다."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* 탭 영역 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Tabs defaultValue="ingredients" className="mb-6" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-8 bg-muted/50 p-1 rounded-full">
                      <TabsTrigger 
                        value="ingredients" 
                        className="rounded-full py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300"
                      >
                        <ShoppingBag size={18} className="mr-2" />
                        재료
                      </TabsTrigger>
                      <TabsTrigger 
                        value="steps" 
                        className="rounded-full py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300"
                      >
                        <ChefHat size={18} className="mr-2" />
                        조리 방법
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ingredients" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center mb-6">
                            <ShoppingBag size={20} className="text-primary mr-3" />
                            <h3 className="text-xl font-bold">필요한 재료</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
                            {recipe.ingredients.map((item, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="flex items-center py-4 border-b border-border/30"
                              >
                                <div className="w-3 h-3 bg-primary/80 rounded-full mr-4 shadow-sm"></div>
                                <span className="text-foreground text-base">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="steps" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center mb-6">
                            <ChefHat size={20} className="text-primary mr-3" />
                            <h3 className="text-xl font-bold">조리 방법</h3>
                          </div>
                          
                          <div className="space-y-8">
                            {recipe.steps.map((step, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex"
                              >
                                <div className="flex-shrink-0 mr-5">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md text-white font-bold text-lg">
                                    {idx + 1}
                                  </div>
                                </div>
                                <div className="pt-1">
                                  <p className="text-foreground text-lg leading-relaxed">{step}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
                
                {/* 영양 정보 */}
                {recipe.nutritionalInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-12"
                  >
                    <Card className="border-none shadow-md bg-gradient-to-br from-white to-primary/5">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <Award size={22} className="text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">영양 정보</h2>
                            <p className="text-sm text-muted-foreground mt-1">1인분 기준</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-base leading-relaxed mt-2">
                          {recipe.nutritionalInfo}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                
                {/* 추가 버튼 영역 */}
                <div className="flex justify-center mt-14 gap-4">
                  <Button
                    onClick={handleSave}
                    variant={isSaved ? "outline" : "default"}
                    size="lg"
                    className={`rounded-full px-6 py-6 shadow-md ${
                      isSaved 
                        ? "border-rose-200 text-rose-500 hover:bg-rose-50" 
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    <Heart size={18} className={`mr-2 ${isSaved ? "fill-rose-500" : ""}`} />
                    <span>{isSaved ? "저장됨" : "레시피 저장하기"}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
} 