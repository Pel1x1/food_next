import { makeAutoObservable } from 'mobx';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

const THEME_STORAGE_KEY = 'theme';

export class ThemeStore {
  theme: Theme = Theme.Light;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

      if (saved === Theme.Dark || saved === Theme.Light) {
        this.theme = saved;
      } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        this.theme = Theme.Dark;
      }
    }
  }

  get isDark() {
    return this.theme === Theme.Dark;
  }

  get isLight() {
    return this.theme === Theme.Light;
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }

  toggleTheme() {
    this.setTheme(this.theme === Theme.Light ? Theme.Dark : Theme.Light);
  }
}
