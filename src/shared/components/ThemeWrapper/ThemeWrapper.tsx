"use client";

import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/shared/hooks/useStore';

export const ThemeWrapper = observer(({ children }: { children: React.ReactNode }) => {
  const { themeStore } = useStore();

  useEffect(() => {
   
    document.body.classList.toggle('theme-dark', themeStore.isDark);
  }, [themeStore.isDark]);

  return <>{children}</>;
});
