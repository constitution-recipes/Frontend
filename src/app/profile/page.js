'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/lib/services/userService';
import { User, Mail, Phone, Heart, Edit, Save, X, AlertCircle, CheckCircle2, ListTodo, Clock } from 'lucide-react';
import ConstitutionCard from '@/components/common/ConstitutionCard';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    allergies: [],
    currentHealthStatus: '',
    healthGoals: [],
    existingConditions: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        allergies: user.allergies || [],
        currentHealthStatus: user.currentHealthStatus || '',
        healthGoals: user.healthGoals || [],
        existingConditions: user.existingConditions || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        allergies: user.allergies || [],
        currentHealthStatus: user.currentHealthStatus || '',
        healthGoals: user.healthGoals || [],
        existingConditions: user.existingConditions || ''
      });
    }
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile(profile);
      await refreshUser();
      setEditing(false);
      toast({
        title: "프로필 업데이트",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      toast({
        title: "오류 발생",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergiesChange = (e) => {
    const allergiesArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setProfile(prev => ({
      ...prev,
      allergies: allergiesArray
    }));
  };

  const handleHealthGoalsChange = (e) => {
    const goalsArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setProfile(prev => ({
      ...prev,
      healthGoals: goalsArray
    }));
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="relative w-full h-full flex items-center justify-center bg-primary/10 rounded-full">
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 체질 여부에 따른 배경 그라데이션 설정
  const hasConstitution = !!user.constitution;
  const gradientBg = hasConstitution 
    ? 'bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50'
    : 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100';

  return (
    <div className={`min-h-screen ${gradientBg} py-8 px-4 sm:px-6 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
          <div className="relative h-32 bg-gradient-to-r from-primary via-primary/90 to-primary/80">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              <div className="sm:mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-muted-foreground mt-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-auto mt-2 sm:mt-0">
                {!editing ? (
                  <Button onClick={handleEdit} size="sm" variant="outline" className="shadow-sm gap-1.5">
                    <Edit className="h-4 w-4" /> 프로필 수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} size="sm" variant="ghost" className="gap-1.5">
                      <X className="h-4 w-4" /> 취소
                    </Button>
                    <Button onClick={handleSave} size="sm" variant="default" className="shadow-sm gap-1.5">
                      <Save className="h-4 w-4" /> 저장
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 진행 상태 표시 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">프로필 완성도</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ 
                    width: `${
                      ((user.allergies?.length ? 1 : 0) + 
                      (user.currentHealthStatus ? 1 : 0) + 
                      (user.healthGoals?.length ? 1 : 0) + 
                      (user.existingConditions ? 1 : 0) +
                      (user.constitution ? 1 : 0)) * 20
                    }%` 
                  }}
                ></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <ProfileBadge 
                  active={user.allergies?.length > 0} 
                  icon={<AlertCircle className="w-3.5 h-3.5" />} 
                  text="알레르기 정보" 
                />
                <ProfileBadge 
                  active={!!user.currentHealthStatus} 
                  icon={<Heart className="w-3.5 h-3.5" />} 
                  text="건강 상태" 
                />
                <ProfileBadge 
                  active={user.healthGoals?.length > 0} 
                  icon={<ListTodo className="w-3.5 h-3.5" />} 
                  text="건강 목표" 
                />
                <ProfileBadge 
                  active={!!user.existingConditions} 
                  icon={<AlertCircle className="w-3.5 h-3.5" />} 
                  text="기존 질환" 
                />
                <ProfileBadge 
                  active={!!user.constitution} 
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />} 
                  text="체질 진단" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* 건강 정보 섹션 */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>건강 정보</span>
                </h2>
              </div>
              <div className="p-5 space-y-6">
                {editing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="text-sm font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-destructive/70" />
                        알레르기 (쉼표로 구분)
                      </Label>
                      <Input
                        id="allergies"
                        name="allergies"
                        value={profile.allergies?.join(', ') || ''}
                        onChange={handleAllergiesChange}
                        className="border-gray-200 focus:border-primary"
                        placeholder="예: 견과류, 계란, 유제품"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentHealthStatus" className="text-sm font-medium flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-primary/70" />
                        현재 건강 상태
                      </Label>
                      <Textarea
                        id="currentHealthStatus"
                        name="currentHealthStatus"
                        value={profile.currentHealthStatus || ''}
                        onChange={handleChange}
                        rows={3}
                        className="border-gray-200 focus:border-primary"
                        placeholder="현재 건강 상태를 간략히 설명해주세요."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="healthGoals" className="text-sm font-medium flex items-center gap-1.5">
                        <ListTodo className="w-4 h-4 text-teal-500/70" />
                        건강 목표 (쉼표로 구분)
                      </Label>
                      <Input
                        id="healthGoals"
                        name="healthGoals"
                        value={profile.healthGoals?.join(', ') || ''}
                        onChange={handleHealthGoalsChange}
                        className="border-gray-200 focus:border-primary"
                        placeholder="예: 체중 감량, 혈압 관리, 면역력 증진"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existingConditions" className="text-sm font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500/70" />
                        기존 질환
                      </Label>
                      <Textarea
                        id="existingConditions"
                        name="existingConditions"
                        value={profile.existingConditions || ''}
                        onChange={handleChange}
                        rows={3}
                        className="border-gray-200 focus:border-primary"
                        placeholder="혈압, 당뇨 등 기존 질환을 입력해주세요."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-destructive/70" />
                        알레르기
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.allergies?.length ? (
                          user.allergies.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-destructive rounded-full text-sm border border-red-100">
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">알레르기 정보가 없습니다.</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-primary/70" />
                        현재 건강 상태
                      </h3>
                      <p className="text-sm leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                        {user.currentHealthStatus || "건강 상태 정보가 없습니다."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <ListTodo className="w-4 h-4 text-teal-500/70" />
                        건강 목표
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.healthGoals?.length ? (
                          user.healthGoals.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-sm border border-teal-100">
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">건강 목표가 없습니다.</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500/70" />
                        기존 질환
                      </h3>
                      <p className="text-sm leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                        {user.existingConditions || "기존 질환 정보가 없습니다."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 체질 정보 섹션 */}
          <div className="md:col-span-2">
            {user.constitution ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>체질 진단 결과</span>
                  </h2>
                </div>
                <div className="p-5">
                  <ConstitutionCard constitution={user.constitution} />
                  {user.constitutionReason && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        <span className="font-medium block mb-1">진단 근거:</span>
                        {user.constitutionReason}
                      </p>
                      {user.constitutionConfidence && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">진단 신뢰도:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${user.constitutionConfidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(user.constitutionConfidence * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <h2 className="font-semibold text-lg">체질 진단</h2>
                </div>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">아직 체질 진단을 받지 않으셨습니다</h3>
                  <p className="text-muted-foreground text-sm mb-6">체질 진단을 통해 맞춤형 건강 식단을 추천받으세요.</p>
                  <Button className="rounded-lg" size="lg" asChild>
                    <a href="/constitution-diagnosis">체질 진단 받기</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 프로필 완성도 배지 컴포넌트
function ProfileBadge({ active, icon, text }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20' 
        : 'bg-gray-100 text-gray-500 border border-gray-200'
    }`}>
      {icon}
      <span>{text}</span>
      {active && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
    </div>
  );
} 