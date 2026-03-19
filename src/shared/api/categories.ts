import { apiUrls } from "@/shared/config/api";
import type { RecipeCategory } from "@/shared/entity/recipe";

export async function getCategoriesServer(): Promise<RecipeCategory[]> {
  try {
    const res = await fetch(apiUrls.mealCategories, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as { data?: RecipeCategory[] };
    const categories = Array.isArray(json.data) ? json.data : [];
    return categories.filter((cat) => cat.title !== "All");
  } catch {
    return [];
  }
}

