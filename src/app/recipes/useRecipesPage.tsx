"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Option } from "@/shared/components/MultiDropdown";
import { useRecipesStore } from "@/shared/providers/RecipesStoreProvider";

type InitialSearchParams = {
  search?: string;
  categories?: string;
  page?: string;
};

export const useRecipesPage = (initialSearchParams?: InitialSearchParams) => {
  const store = useRecipesStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isRoutingRef = useRef(false);
  const hasHydratedRef = useRef(false);

  if (!hasHydratedRef.current) {
    const params = new URLSearchParams();
    if (initialSearchParams?.search) params.set("search", initialSearchParams.search);
    if (initialSearchParams?.categories) params.set("categories", initialSearchParams.categories);
    if (initialSearchParams?.page) params.set("page", initialSearchParams.page);
    
    store.hydrateFromQuery(params);
    hasHydratedRef.current = true;
  }

  useEffect(() => {
    if (store.categories.length === 0) void store.fetchCategories();
    if (store.recipes.length === 0) void store.fetchRecipes();
  }, []);

  useEffect(() => {
    if (isRoutingRef.current) {
      isRoutingRef.current = false;
      return;
    }

    if (!searchParams) return;
    
    const currentQuery = store.toQueryParams();
    const urlQuery = Object.fromEntries(searchParams.entries());
    
    if (JSON.stringify(currentQuery) !== JSON.stringify(urlQuery)) {
      store.hydrateFromQuery(searchParams);
      void store.fetchRecipes();
    }
  }, [searchParams, store]);

  const categoryOptions: Option[] = store.categoryOptions;

  const syncUrl = useCallback(() => {
    const params = store.toQueryParams();
    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, String(value));
    });

    const queryString = urlParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    isRoutingRef.current = true;
    router.replace(newUrl, { scroll: false }); 
  }, [store, pathname, router]);

  const handleChangePage = (page: number) => {
    store.setPage(page);
    syncUrl();
    
    document
      .querySelector('[data-section="search-filter"]')
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    void store.fetchRecipes();
  };

  const handleSearchClick = () => {
    store.applyFilters();
    syncUrl(); 
  };

  return { store, categoryOptions, handleChangePage, handleSearchClick };
};
