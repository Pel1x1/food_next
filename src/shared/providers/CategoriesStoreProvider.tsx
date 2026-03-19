"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { CategoriesStore } from "@/stores/categoriesStore";
import type { RecipeCategory } from "@/shared/entity/recipe";

const CategoriesStoreContext = createContext<CategoriesStore | null>(null);

export function CategoriesStoreProvider({
  children,
  initialCategories,
}: {
  children: ReactNode;
  initialCategories: RecipeCategory[];
}) {
  const [store] = useState(() => CategoriesStore.init(initialCategories));
  return (
    <CategoriesStoreContext.Provider value={store}>
      {children}
    </CategoriesStoreContext.Provider>
  );
}

export function useCategoriesStore() {
  const store = useContext(CategoriesStoreContext);
  if (!store) throw new Error("useCategoriesStore must be used within CategoriesStoreProvider");
  return store;
}

