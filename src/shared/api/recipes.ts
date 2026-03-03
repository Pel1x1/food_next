import { apiUrls } from "@/shared/config/api";
import type { RecipeFromApi, RecipeItem, StrapiListResponse } from "@/shared/entity/recipe";
import { getRecipeImageUrl } from "@/shared/utils/media";

export type RecipesQuery = {
  search?: string;
  categories?: number[];
  page?: number;
};

const ITEMS_PER_PAGE = 9;

export async function getRecipesServer(
  query: RecipesQuery,
): Promise<{ recipes: RecipeItem[]; total: number }> {
  const params: Record<string, unknown> = {
    populate: ["images"],
    filters: {},
    pagination: {
      page: query.page ?? 1,
      pageSize: ITEMS_PER_PAGE,
    },
  };

  if (query.search?.trim()) {
    (params.filters as any).name = {
      $containsi: query.search.trim(),
    };
  }

  if (query.categories && query.categories.length > 0) {
    (params.filters as any).category = {
      id: {
        $in: query.categories,
      },
    };
  }

  const searchParams = new URLSearchParams();
  searchParams.set("populate[0]", "images");
  searchParams.set("pagination[page]", String(query.page ?? 1));
  searchParams.set("pagination[pageSize]", String(ITEMS_PER_PAGE));

  if (query.search?.trim()) {
    searchParams.set("filters[name][$containsi]", query.search.trim());
  }

  if (query.categories && query.categories.length > 0) {
    query.categories.forEach((id, index) => {
      searchParams.set(`filters[category][id][$in][${index}]`, String(id));
    });
  }

  const res = await fetch(`${apiUrls.recipes}?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = (await res.json()) as StrapiListResponse<RecipeFromApi>;

  const mapped: RecipeItem[] = data.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    summary: item.summary || "Нет описания",
    totalTime: String(item.totalTime ?? "0"),
    calories: String(item.calories ?? "0"),
    category: item.category?.title ?? "All",
    image: getRecipeImageUrl(item.images),
  }));

  return {
    recipes: mapped,
    total: data.meta.pagination.total ?? mapped.length,
  };
}

