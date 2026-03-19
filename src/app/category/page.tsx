import { Suspense } from "react";
import Category from "./CategoryClient";
import { getCategoriesServer } from "@/shared/api/categories";
import { getRecipesServer } from "@/shared/api/recipes";
import { RecipesStoreProvider } from "@/shared/providers/RecipesStoreProvider";

type SearchParams = {
  search?: string;
  categories?: string;
  page?: string;
};

export default async function CategoryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const selectedCategories =
    searchParams?.categories
      ?.split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v)) ?? [];

  const page = searchParams?.page ? Number(searchParams.page) || 1 : 1;

  const [categoriesList, recipesData] = await Promise.all([
    getCategoriesServer(),
    getRecipesServer({
      search: searchParams?.search ?? "",
      categories: selectedCategories,
      page,
    }),
  ]);

  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <RecipesStoreProvider
        initialData={{
          recipes: recipesData.recipes,
          total: recipesData.total,
          categories: categoriesList,
          searchQuery: searchParams?.search ?? "",
          selectedCategoryIds: selectedCategories,
          page,
        }}
      >
        <Category />
      </RecipesStoreProvider>
    </Suspense>
  );
}
