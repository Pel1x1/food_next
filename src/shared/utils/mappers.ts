import type { RecipeFromApi, RecipeItem } from '@/shared/entity/recipe';
import { getRecipeImageUrl } from '@/shared/utils/media';

export function mapRecipeItem(item: RecipeFromApi): RecipeItem {
  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    summary: item.summary || 'Нет описания',
    totalTime: String(item.totalTime ?? '0'),
    calories: String(item.calories ?? '0'),
    category: item.category?.title ?? 'All',
    image: getRecipeImageUrl(item.images),
  };
}
