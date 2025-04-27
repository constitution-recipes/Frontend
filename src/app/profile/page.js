'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '홍길동',
    email: 'user@example.com',
    phone: '010-1234-5678',
    birthdate: '1990-01-01',
    gender: '남성',
    height: 175,
    weight: 70,
    medicalConditions: ['고혈압', '당뇨병 전단계'],
    dietaryRestrictions: ['견과류 알레르기'],
    preferences: ['한식', '저염식', '채식']
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = () => {
    // 실제 구현에서는 API 호출 등으로 저장
    setEditing(false);
    alert('프로필이 저장되었습니다.');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽 프로필 카드 */}
          <div className="w-full md:w-1/3">
            <div className="card shadow-md bg-white border-border/30">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground text-sm">{profile.email}</p>

                <div className="mt-6 w-full">
                  <div className="flex justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground">계정 타입</span>
                    <span className="font-medium">기본 회원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground">가입일</span>
                    <span className="font-medium">2023.09.15</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">상태</span>
                    <span className="font-medium text-primary">활성</span>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  {!editing ? (
                    <Button 
                      onClick={handleEdit} 
                      className="w-full"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      프로필 수정
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave} 
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 상세 정보 */}
          <div className="w-full md:w-2/3">
            <div className="card shadow-md bg-white border-border/30">
              <h3 className="text-xl font-semibold mb-6 text-foreground">개인 정보</h3>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">이름</Label>
                    {editing ? (
                      <Input 
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="border-border/40"
                      />
                    ) : (
                      <div className="flex items-center py-2">
                        <User className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">이메일</Label>
                    {editing ? (
                      <Input 
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="border-border/40"
                      />
                    ) : (
                      <div className="flex items-center py-2">
                        <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">전화번호</Label>
                    {editing ? (
                      <Input 
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="border-border/40"
                      />
                    ) : (
                      <div className="flex items-center py-2">
                        <Phone className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">생년월일</Label>
                    {editing ? (
                      <Input 
                        name="birthdate"
                        type="date"
                        value={profile.birthdate}
                        onChange={handleChange}
                        className="border-border/40"
                      />
                    ) : (
                      <div className="flex items-center py-2">
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{profile.birthdate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-border/40" />

                <h3 className="text-lg font-medium mb-4 text-foreground">건강 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">성별</Label>
                    {editing ? (
                      <select 
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        className="w-full h-10 px-3 rounded-md border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                        <option value="기타">기타</option>
                      </select>
                    ) : (
                      <div className="py-2">{profile.gender}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">키 (cm)</Label>
                    {editing ? (
                      <Input 
                        name="height"
                        type="number"
                        value={profile.height}
                        onChange={handleChange}
                        className="border-border/40"
                      />
                    ) : (
                      <div className="py-2">{profile.height} cm</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">체중 (kg)</Label>
                    {editing ? (
                      <Input 
                        name="weight"
                        type="number"
                        value={profile.weight}
                        onChange={handleChange}
                        className="border-border/40"
                      />
                    ) : (
                      <div className="py-2">{profile.weight} kg</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">BMI</Label>
                    <div className="py-2">
                      {(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)} (정상)
                    </div>
                  </div>
                </div>

                <hr className="border-border/40" />

                <h3 className="text-lg font-medium mb-4 text-foreground">식이 정보</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">의학적 상태</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.medicalConditions.map((condition, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">식이 제한</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.dietaryRestrictions.map((restriction, i) => (
                        <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm">
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">선호 음식</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.map((preference, i) => (
                        <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                          {preference}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 