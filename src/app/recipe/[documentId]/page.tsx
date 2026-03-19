import { getRecipeServer } from "@/shared/api/recipe";
import RecipeClient from "./recipeClient";
import { RecipeStoreProvider } from "@/shared/providers/RecipeStoreProvider";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const recipe = await getRecipeServer(documentId);

  return (
    <RecipeStoreProvider initialRecipe={recipe}>
      <RecipeClient documentId={documentId} />
    </RecipeStoreProvider>
  );
}
