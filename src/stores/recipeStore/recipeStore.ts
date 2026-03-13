import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import { apiUrls } from '@/shared/config/api';
import { getErrorMessage } from '@/shared/utils/error';
import { getRecipeMainImageUrl } from '@/shared/utils/media';
import type { RecipeFromApi, StrapiSingleResponse } from './types';

export class RecipeStore {
  recipe: RecipeFromApi | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get mainImageUrl(): string {
    return getRecipeMainImageUrl(this.recipe?.images);
  }

  async fetchRecipe(documentId: string) {
    try {
      this.loading = true;
      this.error = null;

      const query = qs.stringify(
        { populate: ['ingradients', 'equipments', 'directions.image', 'images', 'category'] },
        { encodeValuesOnly: true },
      );

      const res = await axios.get<StrapiSingleResponse<any>>(
        `${apiUrls.recipes}/${documentId}?${query}`
      ); 

      runInAction(() => { 
        const data = res.data.data;
        this.recipe = {
          ...data,
          ingredients: data.ingradients || data.ingredients, 
        };
      });
    } catch (e: unknown) {
      runInAction(() => { this.error = getErrorMessage(e, 'Ошибка загрузки рецепта'); });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
}
