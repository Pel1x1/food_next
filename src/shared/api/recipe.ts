import { apiUrls } from "@/shared/config/api";
import type { RecipeFromApi, StrapiSingleResponse } from "@/stores/recipeStore/types";

export async function getRecipeServer(documentId: string): Promise<RecipeFromApi | null> {
  try {
    const searchParams = new URLSearchParams();
    [
      "ingradients",
      "equipments",
      "directions.image",
      "images",
      "category",
    ].forEach((p, idx) => searchParams.set(`populate[${idx}]`, p));

    const res = await fetch(`${apiUrls.recipes}/${documentId}?${searchParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as StrapiSingleResponse<any>;
    const data = json?.data;
    if (!data) return null;

    return {
      ...data,
      ingredients: data.ingradients || data.ingredients,
    } as RecipeFromApi;
  } catch {
    return null;
  }
}

