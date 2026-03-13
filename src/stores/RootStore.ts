import { CartStore } from './cartStore';
import { ThemeStore } from './themeStore';
import { FavouritesStore } from './favouritesStore';
import { CategoriesStore } from './categoriesStore';
import { RecipesStore } from './recipesStore';
import {RandomRecipeStore} from "./randomRecipeStore"
import { RecipeStore} from "./recipeStore/recipeStore";
import {MealPlanningStore} from "./mealPlanningStore/mealPlanningStore"
export class RootStore { 
  cartStore: CartStore;
  themeStore: ThemeStore;
  favouritesStore: FavouritesStore;
  categoriesStore: CategoriesStore;
  recipesStore: RecipesStore;
  randomRecipeStore: RandomRecipeStore;
  recipeStore : RecipeStore;
  mealPlanningStore : MealPlanningStore;
  constructor() {
    this.cartStore = new CartStore();
    this.themeStore = new ThemeStore();
    this.favouritesStore = new FavouritesStore();
    this.categoriesStore = new CategoriesStore();
    this.recipesStore = new RecipesStore();
    this.randomRecipeStore = new RandomRecipeStore();
    this.recipeStore = new RecipeStore
    this.mealPlanningStore = new MealPlanningStore();
  }
}
