'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Edit, Mail, Phone, Calendar, MapPin, Heart, ChevronRight } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    birthdate: '1990-01-01',
    address: '서울특별시 강남구',
    bodyType: '소양체질',
    bio: '건강한 식습관에 관심이 많습니다.',
    avatar: '/avatar-placeholder.jpg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [activityHistory, setActivityHistory] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 레시피 불러오기
    const loadSavedRecipes = () => {
      try {
        const savedRecipesData = localStorage.getItem('savedRecipes');
        if (savedRecipesData) {
          setSavedRecipes(JSON.parse(savedRecipesData));
        }
      } catch (error) {
        console.error('저장된 레시피를 불러오는 중 오류 발생:', error);
      }
    };

    // 활동 내역 더미 데이터
    setActivityHistory([
      { id: 1, type: '체질 테스트', date: '2023-04-15', description: '체질 분석 테스트 완료' },
      { id: 2, type: '레시피 저장', date: '2023-04-16', description: '단호박 수프 레시피 저장' },
      { id: 3, type: '프로필 업데이트', date: '2023-04-20', description: '프로필 정보 업데이트' }
    ]);

    loadSavedRecipes();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // 수정 완료 시 프로필 업데이트
      setProfile({ ...editedProfile });
    } else {
      // 수정 시작 시 현재 프로필 정보로 초기화
      setEditedProfile({ ...profile });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleBodyTypeChange = (value) => {
    setEditedProfile({
      ...editedProfile,
      bodyType: value
    });
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">마이 프로필</h1>
        
        <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">프로필 정보</TabsTrigger>
            <TabsTrigger value="saved">저장한 레시피</TabsTrigger>
            <TabsTrigger value="activity">활동 내역</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">내 정보</CardTitle>
                  <CardDescription>개인 정보 및 체질 정보를 확인하세요</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
                  {isEditing ? '저장' : '수정'} <Edit className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-teal-500">
                      <Image 
                        src={profile.avatar || '/avatar-placeholder.jpg'} 
                        alt={profile.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    {!isEditing ? (
                      <div className="text-center">
                        <h2 className="text-xl font-bold">{profile.name}</h2>
                        <p className="text-teal-600 font-medium">{profile.bodyType}</p>
                        <p className="text-gray-500 mt-2">{profile.bio}</p>
                      </div>
                    ) : (
                      <div className="w-full space-y-4">
                        <div>
                          <Label htmlFor="name">이름</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={editedProfile.name} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">자기소개</Label>
                          <Input 
                            id="bio" 
                            name="bio" 
                            value={editedProfile.bio} 
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-2/3 space-y-6">
                    {!isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Mail className="text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">이메일</p>
                            <p>{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">전화번호</p>
                            <p>{profile.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">생년월일</p>
                            <p>{profile.birthdate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">주소</p>
                            <p>{profile.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <User className="text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">체질</p>
                            <p>{profile.bodyType}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">이메일</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            value={editedProfile.email} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">전화번호</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={editedProfile.phone} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthdate">생년월일</Label>
                          <Input 
                            id="birthdate" 
                            name="birthdate" 
                            type="date" 
                            value={editedProfile.birthdate} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">주소</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={editedProfile.address} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label>체질</Label>
                          <RadioGroup 
                            value={editedProfile.bodyType} 
                            onValueChange={handleBodyTypeChange}
                            className="flex flex-col space-y-1 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="태양체질" id="type1" />
                              <Label htmlFor="type1">태양체질</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="태음체질" id="type2" />
                              <Label htmlFor="type2">태음체질</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="소양체질" id="type3" />
                              <Label htmlFor="type3">소양체질</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="소음체질" id="type4" />
                              <Label htmlFor="type4">소음체질</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">저장한 레시피</CardTitle>
                <CardDescription>내가 저장한 레시피 목록</CardDescription>
              </CardHeader>
              <CardContent>
                {savedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedRecipes.map(recipe => (
                      <div key={recipe.id} className="flex items-center p-4 border rounded-lg">
                        <div className="relative w-16 h-16 mr-4 overflow-hidden rounded">
                          <Image 
                            src={recipe.image || 'https://via.placeholder.com/150'} 
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{recipe.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{recipe.description}</p>
                        </div>
                        <Link href={`/recipe/${recipe.id}`}>
                          <ChevronRight className="text-gray-400" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">저장한 레시피가 없습니다</h3>
                    <p className="text-gray-400 mb-4">마음에 드는 레시피를 저장해보세요!</p>
                    <Button variant="outline" asChild>
                      <Link href="/recommend_recipes">맞춤 레시피 보기</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">활동 내역</CardTitle>
                <CardDescription>사이트에서의 활동을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {activityHistory.length > 0 ? (
                  <div className="space-y-4">
                    {activityHistory.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{activity.type}</h3>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <div className="text-sm text-gray-400">{activity.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">활동 내역이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
} 