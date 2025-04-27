'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Heart, 
  User, 
  MessageSquare, 
  ChefHat, 
  LogOut, 
  Menu 
} from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 pathname을 사용하기 위한 처리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 홈, 로그인, 회원가입 페이지에서는 사이드바를 숨김
  if (!mounted || pathname === '/' || pathname.startsWith('/auth')) {
    return null;
  }

  // 메뉴 리스트
  const menus = [
    {
      name: '맞춤 레시피',
      icon: ChefHat,
      href: '/recommend_recipes',
      active: pathname === '/recommend_recipes'
    },
    {
      name: '저장함',
      icon: Heart,
      href: '/saved',
      active: pathname === '/saved'
    },
    {
      name: '프로필',
      icon: User,
      href: '/profile',
      active: pathname === '/profile'
    },
    {
      name: '챗봇',
      icon: MessageSquare,
      href: '/chatbot',
      active: pathname === '/chatbot'
    }
  ];

  // 모바일 Sheet용 사이드바 내용
  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <Link href="/chatbot" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-teal-500">ChiDiet</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {menus.map((menu) => (
          <Link
            href={menu.href}
            key={menu.name}
            className={`flex items-center px-4 py-3 rounded-lg ${
              menu.active 
                ? 'bg-teal-50 text-teal-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <menu.icon className={`h-5 w-5 ${menu.active ? 'text-teal-500' : 'text-gray-500'}`} />
            <span className="ml-4">{menu.name}</span>
            {menu.name === '저장함' && (
              <span className="ml-auto bg-teal-100 text-teal-600 text-xs py-0.5 px-2 rounded-full">
                {typeof window !== 'undefined' ? 
                  JSON.parse(localStorage.getItem('savedRecipes') || '[]').length : 0}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center px-4 py-3 w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg">
          <LogOut className="h-5 w-5 text-gray-500" />
          <span className="ml-4">로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md bg-white border shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <Menu className="h-6 w-6" />
              <span className="sr-only">메뉴 열기</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 max-w-full">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>
      {/* PC 사이드바 */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-10">
        {SidebarContent}
      </aside>
    </>
  );
} 