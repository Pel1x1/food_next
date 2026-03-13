import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { spoonacularUrls } from '@/shared/config/api';
import { getErrorMessage } from '@/shared/utils/error';
import { 
  TimeFrame, MealPlan, MealInformation, DayPlanItem, RawDayPlan, RawWeekMealPlan 
} from './types';

export class MealPlanningStore {
  timeFrame: TimeFrame = 'day';
  targetCalories = '';
  diet = '';
  exclude = '';

  plan: MealPlan | null = null;
  selectedMeal: MealInformation | null = null;

  loadingPlan = false;
  loadingMeal = false;
  error: string | null = null;
  mealError: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isApiConfigured(): string | null {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;
    return apiKey || null;
  }

  setTimeFrame(value: TimeFrame) { this.timeFrame = value; }
  setTargetCalories(value: string) { this.targetCalories = value; }
  setDiet(value: string) { this.diet = value; }
  setExclude(value: string) { this.exclude = value; }

  resetSelection() {
    this.selectedMeal = null;
    this.mealError = null;
  }

  async generatePlan() {
    const apiKey = this.isApiConfigured;
    if (!apiKey) { this.error = 'API key for Spoonacular is not configured.'; return; }

    this.loadingPlan = true;
    this.error = null;
    this.plan = null;
    this.selectedMeal = null;

    try {
      const params: Record<string, unknown> = { timeFrame: this.timeFrame, apiKey };
      const calories = Number(this.targetCalories);
      if (!Number.isNaN(calories) && calories > 0) params.targetCalories = calories;
      if (this.diet.trim()) params.diet = this.diet.trim();
      if (this.exclude.trim()) params.exclude = this.exclude.trim();

      if (this.timeFrame === 'week') {
        const res = await axios.get<RawWeekMealPlan>(spoonacularUrls.mealPlan, { params });
        
        const days: DayPlanItem[] = Object.entries(res.data.week).map(([name, data]) => ({
          dayName: name.charAt(0).toUpperCase() + name.slice(1),
          meals: data.meals,
          nutrients: data.nutrients,
        }));

        const totalNutrients = days.reduce((acc, d) => {
          acc.calories += d.nutrients.calories;
          acc.carbohydrates += d.nutrients.carbohydrates;
          acc.fat += d.nutrients.fat;
          acc.protein += d.nutrients.protein;
          return acc;
        }, { calories: 0, carbohydrates: 0, fat: 0, protein: 0 });

        const length = days.length || 1;
        const avgNutrients = {
          calories: totalNutrients.calories / length,
          carbohydrates: totalNutrients.carbohydrates / length,
          fat: totalNutrients.fat / length,
          protein: totalNutrients.protein / length,
        };

        runInAction(() => {
          this.plan = { days, nutrients: avgNutrients };
        });
      } else {
        const res = await axios.get<RawDayPlan>(spoonacularUrls.mealPlan, { params });
        runInAction(() => {
          this.plan = {
            days: [{ dayName: 'Today', meals: res.data.meals, nutrients: res.data.nutrients }],
            nutrients: res.data.nutrients,
          };
        });
      }
    } catch (e) {
      runInAction(() => { this.error = getErrorMessage(e, 'Failed to generate meal plan'); });
    } finally {
      runInAction(() => { this.loadingPlan = false; });
    }
  }

  async loadMealInformation(id: number) {
    const apiKey = this.isApiConfigured;
    if (!apiKey) { this.mealError = 'API key for Spoonacular is not configured.'; return; }

    this.loadingMeal = true;
    this.mealError = null;

    try {
      const res = await axios.get<MealInformation>(
        spoonacularUrls.recipeInformation(id),
        { params: { apiKey } },
      );
      runInAction(() => { this.selectedMeal = res.data; });
    } catch (e) {
      runInAction(() => { this.mealError = getErrorMessage(e, 'Failed to load meal details'); });
    } finally {
      runInAction(() => { this.loadingMeal = false; });
    }
  }
}
