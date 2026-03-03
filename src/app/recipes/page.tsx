import type { Metadata } from "next";
import RecipesClient from "./RecipesClient";
import { getRecipesServer } from "@/shared/api/recipes";

export const metadata: Metadata = {
  title: "Recipes",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: { search?: string; categories?: string; page?: string };
}) {
  const categories =
    searchParams?.categories
      ?.split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v)) ?? [];

  const page = searchParams?.page ? Number(searchParams.page) || 1 : 1;

  await getRecipesServer({
    search: searchParams?.search ?? "",
    categories,
    page,
  });

  return <RecipesClient />;
}
