"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLocalObservable } from "mobx-react-lite";
import type { Option } from "@/shared/components/MultiDropdown";
import { RecipesStore } from "@/stores/recipesStore";

type InitialSearchParams = {
  search?: string;
  categories?: string;
  page?: string;
};

export const useRecipesPage = (initialSearchParams?: InitialSearchParams) => {
  const store = useLocalObservable(() => new RecipesStore());
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isRoutingRef = useRef(false);
  const hasHydratedRef = useRef(false);

  // 1. ПЕРВАЯ ЗАГРУЗКА: Берем данные с сервера (они 100% точные при F5)
  // Делаем это синхронно до всяких useEffect, чтобы избежать миганий интерфейса
  if (!hasHydratedRef.current) {
    const params = new URLSearchParams();
    if (initialSearchParams?.search) params.set("search", initialSearchParams.search);
    if (initialSearchParams?.categories) params.set("categories", initialSearchParams.categories);
    if (initialSearchParams?.page) params.set("page", initialSearchParams.page);
    
    store.hydrateFromQuery(params);
    hasHydratedRef.current = true;
  }

  // 2. Фетчим данные при первом монтировании компонента
  useEffect(() => {
    void store.fetchCategories();
    void store.fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. РЕАКЦИЯ НА URL: Слушаем изменения из адресной строки (Назад/Вперед)
  useEffect(() => {
    // Если мы сами программно меняем URL через syncUrl, пропускаем эффект
    if (isRoutingRef.current) {
      isRoutingRef.current = false;
      return;
    }

    if (!searchParams) return;
    
    const currentQuery = store.toQueryParams();
    const urlQuery = Object.fromEntries(searchParams.entries());
    
    // Проверяем, реально ли URL отличается от нашего текущего состояния
    if (JSON.stringify(currentQuery) !== JSON.stringify(urlQuery)) {
      store.hydrateFromQuery(searchParams);
      void store.fetchRecipes();
    }
  }, [searchParams, store]);

  const categoryOptions: Option[] = store.categoryOptions;

  // 4. ПУШ В URL: обновляем строку без перезагрузки
  const syncUrl = useCallback(() => {
    const params = store.toQueryParams();
    const urlParams = new URLSearchParams();
    
    // Добавляем только непустые значения
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, String(value));
    });

    const queryString = urlParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    isRoutingRef.current = true; // Блокируем useEffect
    router.replace(newUrl, { scroll: false }); // Используем replace, чтобы не плодить пустые истории
  }, [store, pathname, router]);

  // Смена страницы
  const handleChangePage = (page: number) => {
    store.setPage(page);
    syncUrl();
    
    document
      .querySelector('[data-section="search-filter"]')
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    void store.fetchRecipes();
  };

  // Клик на кнопку поиска
  const handleSearchClick = () => {
    store.applyFilters(); // Внутри уже вызывается fetchRecipes
    syncUrl(); 
  };

  return { store, categoryOptions, handleChangePage, handleSearchClick };
};
