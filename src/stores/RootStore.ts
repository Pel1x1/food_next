import { CartStore } from './cartStore';
import { ThemeStore } from './themeStore';
import { FavouritesStore } from './favouritesStore';

import type { FavouriteRecipe } from '@/shared/utils/favourites';

export type RootStoreInitialData = {
  favourites?: FavouriteRecipe[];
};

export class RootStore { 
  cartStore: CartStore;
  themeStore: ThemeStore;
  favouritesStore: FavouritesStore;

  constructor() {
    this.cartStore = new CartStore();
    this.themeStore = new ThemeStore();
    this.favouritesStore = new FavouritesStore();
  }

  static init(initialData?: RootStoreInitialData): RootStore {
    const store = new RootStore();

    if (initialData?.favourites) {
      store.favouritesStore = FavouritesStore.init(initialData.favourites);
    }

    return store;
  }
}
