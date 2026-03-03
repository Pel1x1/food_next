"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocalObservable } from "mobx-react-lite";
import type { Option } from "@/shared/components/MultiDropdown";
import { RecipesStore } from "@/stores/recipesStore";

export const useRecipesPage = () => {
  const store = useLocalObservable(() => new RecipesStore());
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    store.hydrateFromQuery(searchParams);
    void store.fetchCategories();
    void store.fetchRecipes();
  }, [searchParams, store]);

  const categoryOptions: Option[] = store.categoryOptions;

  const handleChangePage = (page: number) => {
    store.setPage(page);
    const gridElement = document.querySelector(
      `[data-section="search-filter"]`,
    );
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    void store.fetchRecipes();
  };

  const handleSearchClick = () => {
    void store.applyFilters();
  };

  return {
    store,
    categoryOptions,
    handleChangePage,
    handleSearchClick,
  };
};
