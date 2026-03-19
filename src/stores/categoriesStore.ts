import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { apiUrls } from '@/shared/config/api';
import { getErrorMessage } from '@/shared/utils/error';
import type { RecipeCategory } from '@/shared/entity/recipe';

export class CategoriesStore {
  categories: RecipeCategory[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static init(initialCategories: RecipeCategory[]): CategoriesStore {
    const store = new CategoriesStore();
    store.categories = initialCategories.filter((cat) => cat.title !== 'All');
    return store;
  }

  async fetchCategories() {
    this.loading = true;
    this.error = null;
    try {
      const res = await axios.get<{ data: RecipeCategory[] }>(apiUrls.mealCategories);
      runInAction(() => {
        this.categories = res.data.data.filter((cat) => cat.title !== 'All');
      });
    } catch (e: unknown) {
      runInAction(() => { this.error = getErrorMessage(e, 'Ошибка загрузки категорий'); });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
}
