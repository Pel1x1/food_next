"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { RecipesStore, type RecipesStoreInitialData } from "@/stores/recipesStore";

const RecipesStoreContext = createContext<RecipesStore | null>(null);

export function RecipesStoreProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: RecipesStoreInitialData;
}) {
  const [store] = useState(() => RecipesStore.init(initialData));
  return <RecipesStoreContext.Provider value={store}>{children}</RecipesStoreContext.Provider>;
}

export function useRecipesStore() {
  const store = useContext(RecipesStoreContext);
  if (!store) throw new Error("useRecipesStore must be used within RecipesStoreProvider");
  return store;
}

