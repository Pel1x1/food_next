export type TimeFrame = 'day' | 'week';

export type MealPlanMeal = {
  id: number;
  title: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
};

export type MealPlanNutrients = {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
};

export type DayPlanItem = {
  dayName: string;
  meals: MealPlanMeal[];
  nutrients: MealPlanNutrients;
};

export type MealPlan = {
  days: DayPlanItem[];
  nutrients: MealPlanNutrients; 
};

export type MealInformation = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  dishTypes: string[];
  extendedIngredients: Array<{ id: number; original: string }>;
};

export type RawDayPlan = { meals: MealPlanMeal[]; nutrients: MealPlanNutrients };
export type RawWeekMealPlan = { week: Record<string, RawDayPlan> };
