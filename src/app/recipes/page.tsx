import { Suspense } from "react";
import type { Metadata } from "next";
import RecipesHero from "./components/RecipesHero";
import RecipesClient from "./RecipesClient";
import { getRecipesServer } from "@/shared/api/recipes";
import { getCategoriesServer } from "@/shared/api/categories";
import Loader from "@/shared/components/Loader";
import { RecipesStoreProvider } from "@/shared/providers/RecipesStoreProvider";

export const metadata: Metadata = {
  title: "Recipes",
};

type SearchParams = {
  search?: string;
  categories?: string;
  page?: string;
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const categories =
    searchParams?.categories
      ?.split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v)) ?? [];

  const page = searchParams?.page ? Number(searchParams.page) || 1 : 1;

  const [categoriesList, recipesData] = await Promise.all([
    getCategoriesServer(),
    getRecipesServer({
      search: searchParams?.search ?? "",
      categories,
      page,
    }),
  ]);

  return (
    <>
      <RecipesHero />

      <Suspense fallback={<Loader size="l" />}>
        <RecipesStoreProvider
          initialData={{
            recipes: recipesData.recipes,
            total: recipesData.total,
            categories: categoriesList,
            searchQuery: searchParams?.search ?? "",
            selectedCategoryIds: categories,
            page,
          }}
        >
          <RecipesClient initialSearchParams={searchParams} />
        </RecipesStoreProvider>
      </Suspense>
    </>
  );
}
