import { makeAutoObservable, runInAction, reaction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import type { RecipeFromApi, RecipeItem, StrapiListResponse, RecipeCategory } from '@/shared/entity/recipe';
import { apiUrls } from '@/shared/config/api';
import { getErrorMessage } from '@/shared/utils/error';
import { mapRecipeItem } from '@/shared/utils/mappers';

const ITEMS_PER_PAGE = 9;

export type RecipesStoreInitialData = {
  recipes: RecipeItem[];
  total: number;
  categories: RecipeCategory[];
  searchQuery: string;
  selectedCategoryIds: number[];
  page: number;
};

export class RecipesStore {
  recipes: RecipeItem[] = [];
  categories: RecipeCategory[] = [];
  loading = false;
  error: string | null = null;

  searchQuery = '';
  selectedCategoryIds: number[] = [];
  draftSearchQuery = '';
  draftSelectedCategoryIds: number[] = [];
  currentPage = 1;
  total = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    reaction(
      () => [this.searchQuery, this.selectedCategoryIds.length],
      () => { this.currentPage = 1; }
    );
  }

  static init(data: RecipesStoreInitialData): RecipesStore {
    const store = new RecipesStore();
    store.recipes = data.recipes;
    store.total = data.total;
    store.categories = data.categories;
    store.searchQuery = data.searchQuery;
    store.selectedCategoryIds = data.selectedCategoryIds;
    store.draftSearchQuery = data.searchQuery;
    store.draftSelectedCategoryIds = [...data.selectedCategoryIds];
    store.currentPage = data.page;
    return store;
  }

  get categoryOptions() {
    return this.categories.map((cat) => ({ key: String(cat.id), value: cat.title }));
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / ITEMS_PER_PAGE));
  }

  setSearchQuery(value: string) { this.searchQuery = value; }
  setSelectedCategoryIds(ids: number[]) { this.selectedCategoryIds = ids; }
  setDraftSearchQuery(value: string) { this.draftSearchQuery = value; }
  setDraftSelectedCategoryIds(ids: number[]) { this.draftSelectedCategoryIds = ids; }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  async applyFilters() {
    this.searchQuery = this.draftSearchQuery.trim();
    this.selectedCategoryIds = [...this.draftSelectedCategoryIds];
    await this.fetchRecipes();
  }

  hydrateFromQuery(params: URLSearchParams) {
    const search = params.get('search') || '';
    const pageParam = params.get('page');
    const categoriesParam = params.get('categories');

    const page = pageParam ? Number(pageParam) : 1;
    const categoryIds = categoriesParam ? categoriesParam.split(',').map(Number).filter(id => !Number.isNaN(id)) : [];

    this.searchQuery = search;
    this.currentPage = page > 0 ? page : 1;
    this.selectedCategoryIds = categoryIds;
    this.draftSearchQuery = search;
    this.draftSelectedCategoryIds = [...categoryIds];
  }

  toQueryParams() {
    const params: Record<string, string> = {};
    if (this.searchQuery.trim() !== '') params.search = this.searchQuery.trim();
    if (this.selectedCategoryIds.length > 0) params.categories = this.selectedCategoryIds.join(',');
    if (this.currentPage > 1) params.page = String(this.currentPage);
    return params;
  }

  async fetchCategories() {
    try {
      const res = await axios.get<{ data: RecipeCategory[] }>(apiUrls.mealCategories);
      runInAction(() => { this.categories = res.data.data; });
    } catch (e) { console.error(e); }
  }

  async fetchRecipes() {
    try {
      this.loading = true;
      this.error = null;

      const filters: Record<string, unknown> = {};
      let hasFilters = false;

      if (this.searchQuery.trim() !== '') {
        filters.name = { $containsi: this.searchQuery.trim() };
        hasFilters = true;
      }

      if (this.selectedCategoryIds.length > 0) {
        filters.category = { id: { $in: this.selectedCategoryIds } };
        hasFilters = true;
      }

      const params: Record<string, unknown> = {
        populate: ['images'],
        pagination: { page: this.currentPage, pageSize: ITEMS_PER_PAGE },
      };
      if (hasFilters) params.filters = filters;

      const query = qs.stringify(params, { encodeValuesOnly: true });
      const res = await axios.get<StrapiListResponse<RecipeFromApi>>(`${apiUrls.recipes}?${query}`);

      const mapped = res.data.data.map(mapRecipeItem);

      runInAction(() => {
        this.recipes = mapped;
        this.total = res.data.meta.pagination.total ?? mapped.length;
      });
    } catch (e: unknown) {
      runInAction(() => { this.error = getErrorMessage(e, 'Ошибка загрузки рецептов'); });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
}
