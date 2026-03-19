import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import type { RecipeItem, StrapiListResponse, RecipeFromApi } from '@/shared/entity/recipe';
import { apiUrls } from '@/shared/config/api';
import { getErrorMessage } from '@/shared/utils/error';
import { mapRecipeItem } from '@/shared/utils/mappers';

export class RandomRecipeStore {
  recipe: RecipeItem | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchRandomRecipe() {
    this.loading = true;
    this.error = null;
    this.recipe = null;

    try {
      const metaRes = await axios.get<StrapiListResponse<RecipeFromApi>>(`${apiUrls.recipes}?pagination[limit]=1`);
      const total = metaRes.data.meta.pagination.total;
      if (total === 0) throw new Error('Рецепты не найдены');

      const randomStart = Math.floor(Math.random() * total);
      const res = await axios.get<StrapiListResponse<RecipeFromApi>>(
        `${apiUrls.recipes}?pagination[start]=${randomStart}&pagination[limit]=1&populate[0]=images`
      );

      const item = res.data.data[0];
      if (!item) throw new Error('Не удалось получить рецепт');

      runInAction(() => { this.recipe = mapRecipeItem(item); });
    } catch (e: unknown) {
      runInAction(() => { this.error = getErrorMessage(e, 'Ошибка получения случайного рецепта'); });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  reset() {
    this.recipe = null;
    this.error = null;
    this.loading = false;
  }
}
