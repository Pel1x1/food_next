"use client";

import { createContext, ReactNode, useState } from 'react';
import { RootStore, type RootStoreInitialData } from '@/stores/RootStore';
import { enableStaticRendering } from 'mobx-react-lite';

enableStaticRendering(typeof window === 'undefined');

export const StoreContext = createContext<RootStore | null>(null);

export function StoreProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: RootStoreInitialData;
}) {
  const [store] = useState(() => RootStore.init(initialData));

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}
