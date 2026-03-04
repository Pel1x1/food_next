"use client";

import React from "react";
import s from "./Recipes.module.scss";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { gridContainerVariants } from "./config";
import { useRecipesPage } from "./useRecipesPage";
import RecipesSearchFilter from "./components/RecipesSearchFilter";
import RecipesState from "./components/RecipesState";
import RecipeCard from "./components/RecipeCard";
import RecipesPagination from "./components/RecipesPagination";

type Props = {
  initialSearchParams?: {
    search?: string;
    categories?: string;
    page?: string;
  };
};

const RecipesClient: React.FC<Props> = observer(({ initialSearchParams }) => {
  const { store, categoryOptions, handleChangePage, handleSearchClick } =
    useRecipesPage(initialSearchParams);

  return (
    <div className={s.recipes}>
      <motion.section
        className={s.recipes__searchFilterSection}
        data-section="search-filter"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className={s.recipes__container}>
          <RecipesSearchFilter
            searchValue={store.draftSearchQuery}
            onSearchChange={(v) => store.setDraftSearchQuery(v)}
            categoryOptions={categoryOptions}
            selectedCategoryIds={store.draftSelectedCategoryIds}
            onCategoryChange={(ids) => store.setDraftSelectedCategoryIds(ids)}
            onSearchClick={handleSearchClick}
          />
        </div>
      </motion.section>

      <section className={s.recipes__gridSection}>
        <div className={s.recipes__container}>
          <RecipesState
            loading={store.loading}
            error={store.error}
            hasContent={store.paginatedRecipes.length > 0}
          >
            <motion.div
              className={s.recipes__grid}
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {store.paginatedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </motion.div>

            <RecipesPagination
              currentPage={store.currentPage}
              totalPages={store.totalPages}
              onChangePage={handleChangePage}
            />
          </RecipesState>
        </div>
      </section>
    </div>
  );
});

export default RecipesClient;
