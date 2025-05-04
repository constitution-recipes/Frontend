// Remove client directive to allow params access in server component
import { use } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import RecipeDetailClient from './RecipeDetailClient';

export default function RecipeDetailPage({ params }) {
  // params를 Promise에서 언랩
  const { id } = use(params);
  return (
    <SidebarLayout>
      <RecipeDetailClient id={id} />
    </SidebarLayout>
  );
} 