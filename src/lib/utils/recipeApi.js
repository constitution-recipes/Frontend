export const deleteAllRecipes = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    const response = await fetch(`${API_URL}/api/v1/recipes/delete_all`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '레시피 삭제 중 오류가 발생했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('레시피 삭제 실패:', error);
    throw error;
  }
}; 