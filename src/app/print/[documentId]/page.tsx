"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { observer} from "mobx-react-lite";
import styles from "./Print.module.scss";
import {
  LuTimer,
  LuUsers,
  LuFlame,
} from "react-icons/lu";
import { RecipeStoreProvider, useRecipeStore } from "@/shared/providers/RecipeStoreProvider";


const PrintRecipePage: React.FC = () => {
  const params = useParams<{ documentId: string }>();
  const documentId = params?.documentId;
  const store = useRecipeStore();
  
  useEffect(() => {
    if (documentId) {
      store.fetchRecipe(documentId).then(() => {
          window.print();

      });
    }
  }, [documentId, store]);

  if (store.loading) {
    return <div className={styles.loading}>Preparing document for print...</div>;
  }

  if (store.error || !store.recipe) {
    return <div className={styles.loading}>Recipe not found</div>;
  }

  const recipe = store.recipe;

  return (
    <div className={styles.printContainer}>
      <style>{`
        header, footer, nav { display: none !important; }
        body { background: white !important; margin: 0; padding: 0; }
        @page { margin: 20mm; }
      `}</style>

      <Link href={`/recipe/${documentId}`} className={styles.backBtn}>
        ← Back to Recipe
      </Link>

      <div className={styles.header}>
        <h1>{recipe.name}</h1>
        <div className={styles.stats}>
          <span><LuTimer/> {recipe.totalTime} min</span>
          <span><LuUsers/> {recipe.servings || 1} servings</span>
          <span><LuFlame/> {recipe.calories} kcal</span>
        </div>
      </div>

      {store.mainImageUrl && (
        <img src={store.mainImageUrl} alt={recipe.name} className={styles.image} />
      )}

      {recipe.summary && (
        <div 
          className={styles.summary} 
          dangerouslySetInnerHTML={{ __html: recipe.summary }} 
        />
      )}

      <div className={styles.grid}>
        <div>
          <h2>Ingredients</h2>
          <ul className={styles.list}>
            {recipe.ingredients?.map((ing) => (
              <li key={ing.id}>
                {ing.name} {ing.amount && `- ${ing.amount} ${ing.unit || ""}`}
              </li>
            ))}
          </ul>

          {recipe.equipments && recipe.equipments.length > 0 && (
            <>
              <h2 style={{ marginTop: "30px" }}>Equipment</h2>
              <ul className={styles.list}>
                {recipe.equipments.map((eq) => (
                  <li key={eq.id}>{eq.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          <h2>Instructions</h2>
          <div className={styles.steps}>
            {recipe.directions?.map((dir, i) => (
              <div key={dir.id || i} className={styles.step}>
                <strong>Step {i + 1}</strong>
                <p>{dir.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintRecipe = observer(PrintRecipePage);

export default function PrintRecipeRoute() {
  return (
    <RecipeStoreProvider initialRecipe={null}>
      <PrintRecipe />
    </RecipeStoreProvider>
  );
}
