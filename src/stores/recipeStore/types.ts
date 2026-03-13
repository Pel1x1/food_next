import type { RecipeImage } from '@/shared/entity/recipe';

export type Ingredient = {
  id: number;
  name: string;
  amount?: string;
  unit?: string;
};

export type Equipment = {
  id: number;
  name: string;
};

export type Direction = {
  id: number;
  description: string;
  image?: RecipeImage;
};

export type Category = {
  id: number;
  name: string;
};

export type RecipeFromApi = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: string;
  calories: string;
  servings?: number;
  difficulty?: string;
  images?: RecipeImage[];
  ingredients?: Ingredient[]; 
  equipments?: Equipment[];
  directions?: Direction[];
  category?: Category;
  amount?: string;
  unit?: string;
};

export type StrapiSingleResponse<T> = {
  data: T;
};
