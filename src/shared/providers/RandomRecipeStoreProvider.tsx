"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { RandomRecipeStore } from "@/stores/randomRecipeStore";

const RandomRecipeStoreContext = createContext<RandomRecipeStore | null>(null);

export function RandomRecipeStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new RandomRecipeStore());
  return (
    <RandomRecipeStoreContext.Provider value={store}>
      {children}
    </RandomRecipeStoreContext.Provider>
  );
}

export function useRandomRecipeStore() {
  const store = useContext(RandomRecipeStoreContext);
  if (!store) throw new Error("useRandomRecipeStore must be used within RandomRecipeStoreProvider");
  return store;
}

