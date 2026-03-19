"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MealPlanningStore } from "@/stores/mealPlanningStore/mealPlanningStore";

const MealPlanningStoreContext = createContext<MealPlanningStore | null>(null);

export function MealPlanningStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new MealPlanningStore());
  return (
    <MealPlanningStoreContext.Provider value={store}>
      {children}
    </MealPlanningStoreContext.Provider>
  );
}

export function useMealPlanningStore() {
  const store = useContext(MealPlanningStoreContext);
  if (!store) throw new Error("useMealPlanningStore must be used within MealPlanningStoreProvider");
  return store;
}

