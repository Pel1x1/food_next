"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { RecipeStore } from "@/stores/recipeStore/recipeStore";
import type { RecipeFromApi } from "@/stores/recipeStore/types";

const RecipeStoreContext = createContext<RecipeStore | null>(null);

export function RecipeStoreProvider({
  children,
  initialRecipe,
}: {
  children: ReactNode;
  initialRecipe: RecipeFromApi | null;
}) {
  const [store] = useState(() => RecipeStore.init(initialRecipe));
  return <RecipeStoreContext.Provider value={store}>{children}</RecipeStoreContext.Provider>;
}

export function useRecipeStore() {
  const store = useContext(RecipeStoreContext);
  if (!store) throw new Error("useRecipeStore must be used within RecipeStoreProvider");
  return store;
}

